import { handleResponse } from '@/api/v1/ResponseHelper'
import { handleResponse as handleResponseV2 } from '@/api/v2/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { wellFor, wellToIndex } from './wellHelpers'
import { validate, valid, payload } from './pool'

/** TODO: should move all of these non-exported functions to a helper file
These can be shared across ONT and Pacbio
*/

const sourceRegex = /^(?<barcode>[\w-]+)(:(?<wellName>\w[0-9]{1,2})){0,1}$/

const errorFor = ({ lines, records }, message) => `Library ${records} on line ${lines}: ${message}`
const csvLogger = (commit, info, level) => (message) =>
  commit('traction/addMessage', { type: level, message: errorFor(info, message) }, { root: true })
const tubeFor = ({ resources }, { ont_request_id }) =>
  Object.values(resources.tubes).find((tube) => tube.requests[0] == ont_request_id)
const autoTagPlate = ({ state, commit }, { library }) => {
  const initialWell = wellFor(state, library)
  const initialIndex = wellToIndex(initialWell)
  const tags = state.resources.tagSets[state.selected.tagSet.id].tags
  const initialTagIndex = tags.indexOf(library.tag_id)
  const plate = initialWell.plate

  Object.values(state.pooling.libraries).forEach(({ ont_request_id }) => {
    const otherWell = wellFor(state, { ont_request_id })

    if (otherWell?.plate !== plate) return

    const offset = wellToIndex(otherWell) - initialIndex

    if (offset < 1) return

    const newTag = (initialTagIndex + offset) % tags.length
    commit('updatePoolingLibrary', { ont_request_id, tag_id: tags[newTag] })
  })
}

const autoTagTube = ({ state, commit, getters }, { library }) => {
  const initialTube = tubeFor(state, library)
  const tags = state.resources.tagSets[state.selected.tagSet.id].tags
  const initialTagIndex = tags.indexOf(library.tag_id)

  Object.values(getters.selectedRequests)
    .filter((request) => {
      const tube = tubeFor(state, { ont_request_id: request.id })
      return tube && parseInt(tube.id) > parseInt(initialTube.id)
    })
    .forEach((req, offset) => {
      const newTag = (initialTagIndex + offset + 1) % tags.length
      commit('updatePoolingLibrary', { ont_request_id: req.id, tag_id: tags[newTag] })
    })
}

/**
 * Finds the requests associated with a given plate
 * @param {String} barcode - The plate barcode to find requests for
 * @param wellName the location of the plate well
 * @param plates a list of the vuex plate resources
 * @param commit the vuex commit object. Provides access to mutations
 * @param wells a list of the vuex well resources
 * @returns {Object} Request ids / errors and success state
 */
const requestsForPlate = ({ barcode, wellName, plates, commit, wells }) => {
  const plate = Object.values(plates).find((plate) => plate.barcode == barcode)
  if (!plate) return { success: false, errors: barcodeNotFound(barcode) }

  commit('selectPlate', { id: plate.id, selected: true })
  const wellId = plate.wells.find((well_id) => wells[well_id].position == wellName)
  if (!wellId)
    return {
      success: false,
      errors: `A well named ${wellName} could not be found on ${barcode}`,
    }
  return { success: true, requestIds: wells[wellId].requests }
}

/**
 * Finds the requests associated with a given tube
 * @param {String} barcode - The tube barcode to find requests for
 * @param tubes the list of tube resources from the vuex state
 * @param commit the vuex commit object. Provides access to mutations
 * @returns {Object} Request ids / errors and success state
 */
const requestsForTube = ({ barcode, tubes, commit }) => {
  const tube = Object.values(tubes).find((tube) => tube.barcode == barcode)
  if (!tube) return { success: false, errors: barcodeNotFound(barcode) }

  commit('selectTube', { id: tube.id, selected: true })
  return { success: true, requestIds: tube.requests }
}

/**
 * Finds the requests associated with a given source
 * @param {Object} sourceData - Data about the source to find requests for
 * @param commit the vuex commit object. Provides access to mutations
 * @param resources the vuex state resources object. Provides access to current state resources
 * @returns {Object} Request ids / errors and success state
 */
const findRequestsForSource = ({
  sourceData: { barcode, wellName },
  commit,
  resources: { plates, wells, tubes },
}) => {
  if (wellName) {
    return requestsForPlate({ barcode, wellName, plates, commit, wells })
  } else {
    return requestsForTube({ barcode, tubes, commit })
  }
}

/**
 * Returns a barcode not found error messag
 * @param {String} barcode - A barcode
 * @returns {String} String to be used in a barcode not found error message
 */
const barcodeNotFound = (barcode) =>
  `${barcode} could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.`

/**
 * Finds the tag id for the tag specified by tag, within the current tag group
 * @param {Object} options - An options object
 * @param {Object} options.getters Ont VueX store getters object
 * @param {String} options.tag Tag group_id to find
 * @param {Function} options.error Error function for user feedback
 * @returns {Object} Object containing the matching tag_id
 */
const buildTagAttributes = ({ getters, tag, error }) => {
  if (tag) {
    const matchedTag = getters.selectedTagSet.tags.find(({ group_id }) => group_id === tag)
    if (matchedTag) {
      return { tag_id: matchedTag.id }
    } else {
      error(`Could not find a tag named ${tag} in selected tag group`)
    }
  }
  return {}
}

export default {
  /**
   * Sets the pool data in the store
   * @param state the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @param id the id of the pool
   */
  setPoolData: async ({ commit, rootState }, id) => {
    // We always want to clear out old data first
    commit('clearPoolData')
    // Guard clause to not run the rest if the id is not a number e.g. 'new'
    if (isNaN(id)) {
      return { success: true, errors: [] }
    }

    const request = rootState.api.v1.traction.ont.pools
    const promise = request.find({
      id: id,
      include:
        'libraries.tag.tag_set,libraries.source_plate.wells.requests,libraries.source_tube.requests,libraries.request,tube',
    })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      const {
        libraries,
        requests,
        wells,
        plates = [],
        tag_sets: [tag_set] = [{}],
        tubes,
      } = groupIncludedByResource(included)
      // We need to find the pool tube in the list of returned tubes
      const poolingTube = tubes.find((tube) => tube.id == data.relationships.tube.data.id)
      commit('populatePoolAttributes', data)
      commit('populatePoolingLibraries', libraries)
      commit('populatePoolingTube', poolingTube)
      commit('populateTubes', tubes)
      commit('populateRequests', requests)
      commit('populateWells', wells)
      commit('populatePlates', plates)
      commit('selectTagSet', tag_set)

      tubes.forEach(({ id }) => commit('selectTube', { id, selected: true }))
      plates.forEach(({ id }) => commit('selectPlate', { id, selected: true }))
    }

    return { success, errors }
  },

  /**
   * Sets the plate data in the store
   * @param rootState the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @param filter the filter applied to the plate search
   */
  findOntPlate: async ({ commit, rootState }, filter) => {
    // Here we want to make sure the filter exists
    // If it doesn't exist the request will return all plates
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a plate barcode'],
      }
    }

    const request = rootState.api.v1.traction.ont.plates
    const promise = request.get({ filter: filter, include: 'wells.requests' })
    const response = await handleResponse(promise)

    let { success, data: { data, included = [] } = {}, errors = [] } = response
    const { wells, requests } = groupIncludedByResource(included)

    // We will be return a successful empty list if no plates match the filter
    // Therefore we want to return an error if we don't have any plates
    if (!data.length) {
      success = false
      errors = [`Unable to find plate with barcode: ${filter['barcode']}`]
    }

    if (success) {
      // We want to grab the first (and only) record from the applied filter
      commit('selectPlate', { id: data[0].id, selected: true })
      commit('populatePlates', data)
      commit('populateWells', wells)
      commit('populateRequests', requests)
    }

    return { success, errors }
  },

  /**
   * Sets the tube data in the store
   * @param rootState the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @param filter the filter applied to the tube search
   */
  findOntTube: async ({ commit, rootState }, filter) => {
    // Here we want to make sure the filter exists
    // If it doesn't exist the request will return all tubes
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a tube barcode'],
      }
    }

    const request = rootState.api.v1.traction.ont.tubes
    const promise = request.get({ filter: filter, include: 'requests' })
    const response = await handleResponse(promise)
    let { success, data: { data, included = [] } = {}, errors = [] } = response
    const { requests } = groupIncludedByResource(included)

    // We will be return a successful empty list if no tubes match the filter
    // Therefore we want to return an error if we don't have any tubes
    if (!data.length) {
      success = false
      errors = [`Unable to find tube with barcode: ${filter['barcode']}`]
    }

    if (success) {
      // We want to grab the first (and only) record from the applied filter
      commit('selectTube', { id: data[0].id, selected: true })
      commit('populateTubes', data)
      commit('populateRequests', requests)
    }

    return { success, errors }
  },

  /**
   * Inverts the selected state of all requests associated with a
   * well. We May need to iterate on this if we have multiple requests
   * per well.
   * @param state the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  selectWellRequests: ({ commit, state }, well_id) => {
    const { requests } = state.resources.wells[well_id]
    const selectedRequests = state.pooling.libraries
    for (const id of requests) {
      const selected = !!selectedRequests[id]
      commit('selectRequest', { id, selected: !selected })
    }
  },

  /**
   * Retrieves a list of ont requests from traction-service and populates the source
   * with associated data
   * @param rootState the vuex rootState object. Provides access to the current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchOntRequests: async ({ commit, rootState }, filter, page) => {
    const request = rootState.api.v1.traction.ont.requests
    const promise = request.get({ page, filter })
    const response = await handleResponse(promise)

    const { success, data: { data, meta = {} } = {}, errors = [] } = response

    if (success) {
      commit('setRequests', data)
    }

    return { success, errors, meta }
  },

  /**
   * Validate a pool for the given barcode exists
   * @param rootState the vuex state object. Provides access to current state
   * @param barcode the barcode applied to the pool search
   */
  validatePoolBarcode: async ({ rootState }, barcode) => {
    // Here we want to make sure the barcode exists
    // If it doesn't, set success to null for component validation
    if (barcode.trim() === '') {
      return {
        success: null,
      }
    }

    const request = rootState.api.v1.traction.ont.pools
    const promise = request.get({ filter: { barcode } })
    const response = await handleResponse(promise)
    let { success, data: { data } = {} } = response

    // We will be returned a successful empty list if no pools match the barcode
    // Therefore we want to return success false, if we don't have any pools
    if (!data.length) {
      success = false
    }
    return { success }
  },
  /**
   * Retrieves a list of ont pools from traction-service and populates the source
   * with associated data
   * @param rootState the vuex rootState object. Provides access to the current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchOntPools: async ({ commit, rootState }, filter, page) => {
    const request = rootState.api.v1.traction.ont.pools
    const promise = request.get({
      page,
      filter,
      include: 'tube,libraries.tag,libraries.request',
    })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [], meta = {} } = {}, errors = [] } = response
    const { tubes, libraries, tags, requests } = groupIncludedByResource(included)

    if (success) {
      commit('populateRequests', requests)
      commit('populateTubes', tubes)
      commit('populateTags', tags)
      commit('populateLibraries', libraries)
      commit('setPools', data)
    }

    return { success, errors, meta }
  },

  /**
   * Retrieves a list of ont pools from traction-service and populates the source
   * with associated data, appending data to the previously stored state
   * @param rootState the vuex rootState object. Provides access to the current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  // For the component, the included relationships are not required
  // However, the functionality does not appear to work without them
  populateOntPools: async ({ commit, rootState }, filter) => {
    const request = rootState.api.v1.traction.ont.pools
    const promise = request.get({
      filter: filter,
      include: 'tube,libraries.tag,libraries.request',
    })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response
    const { tubes, libraries, tags, requests } = groupIncludedByResource(included)

    if (success) {
      commit('populateRequests', requests)
      commit('populateTubes', tubes)
      commit('populateTags', tags)
      commit('populateLibraries', libraries)
      commit('populatePools', data)
    }

    return { success, errors }
  },

  /**
   * Sets the tagSet and tags data in the store
   * @param rootState the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchOntTagSets: async ({ commit, rootState }) => {
    const request = rootState.api.v2.traction.ont.tag_sets
    const promise = request.get({ include: 'tags' })
    const response = await handleResponseV2(promise)

    const { success, body: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      commit('populateTagSets', data)
      /* We are currently only including tags. So this is really simple */
      commit('populateTags', included)
    }

    return { success, errors, response }
  },

  /*
   * Creates a pool from the libraries
   */
  createPool: async ({
    rootState,
    state: {
      pooling: { libraries, pool },
    },
  }) => {
    validate({ libraries })
    if (!valid({ libraries })) return { success: false, errors: 'The pool is invalid' }
    const request = rootState.api.v1.traction.ont.pools
    const promise = request.create({ data: payload({ libraries, pool }), include: 'tube' })
    const { success, data: { included = [] } = {}, errors } = await handleResponse(promise)
    const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
    const { attributes: { barcode = '' } = {} } = tube
    return { success, barcode, errors }
  },

  /*
   * Update a pool and libraries
   */
  updatePool: async ({
    rootState,
    state: {
      pooling: { libraries, pool },
    },
  }) => {
    validate({ libraries })
    if (!valid({ libraries })) return { success: false, errors: 'The pool is invalid' }
    const request = rootState.api.v1.traction.ont.pools
    const promise = request.update(payload({ libraries, pool }))
    const { success, errors } = await handleResponse(promise)
    return { success, errors }
  },

  /**
   * Given a record extracted from a csv file, will update the corresponding library
   * Each library is identified by the key 'source' which consists of a string identifying
   * the source plate barcode and its well. eg. DN814597W-A10
   * @param state the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  updateLibraryFromCsvRecord: (
    { state: { resources, pooling }, commit, getters },
    { record: { source, tag, ...attributes }, info },
  ) => {
    const error = csvLogger(commit, info, 'danger')
    if (!source) return error('has no source')

    const match = source.match(sourceRegex)
    const sourceData = match?.groups || { barcode: source }

    const { success, errors, requestIds } = findRequestsForSource({ sourceData, resources, commit })

    if (!success) return error(errors)
    if (requestIds.length === 0) return error(`no requests associated with ${source}`)

    const tagAttributes = buildTagAttributes({ getters, tag, error })

    requestIds.forEach((ont_request_id) => {
      if (!pooling.libraries[ont_request_id]) {
        // We're adding a library
        csvLogger(commit, info, 'info')(`Added ${source} to pool`)
      }
      commit('updatePoolingLibrary', { ont_request_id, ...tagAttributes, ...attributes })
    })
  },

  /*
   * Given a tag change to library_a, will automatically apply tags to the remaining wells
   * on the plate with the following  rules:
   * - Only apply additional tags if autoTag is true
   * - Tags applied in column order based on the source well
   * - Do not apply tags that appear earlier on the plate
   * - Do not apply tags to request originating from other plates
   * - Offset tags based on well position, ignoring occupancy. For example
   *   if tag 2 was applied to A1, then C1 would receive tag 4 regardless
   *   the state of B1.
   */
  applyTags: ({ state, commit, getters }, { library, autoTag }) => {
    // We always apply the first tag
    commit('updatePoolingLibrary', library)
    if (autoTag) {
      const request = state.resources.requests[library.ont_request_id]
      const plateMatch = request.source_identifier.match(sourceRegex)?.groups.wellName
      if (plateMatch) {
        autoTagPlate({ state, commit }, { library })
      } else {
        autoTagTube({ state, commit, getters }, { library })
      }
    }
  },

  /**
   * When a plate is deselected, we need to also remove all its requests
   */
  deselectPlateAndContents: ({ commit, state }, plateId) => {
    commit('selectPlate', { id: plateId, selected: false })
    const { wells } = state.resources.plates[plateId]
    for (const wellId of wells) {
      const { requests = [] } = state.resources.wells[wellId]
      for (const requestId of requests) {
        commit('selectRequest', { id: requestId, selected: false })
        commit('removeResource', { resource: 'requests', id: requestId })
      }
      commit('removeResource', { resource: 'wells', id: wellId })
    }
    commit('removeResource', { resource: 'plates', id: plateId })
  },

  /**
   * When a tube is deselected, we need to also remove all its requests
   */
  deselectTubeAndContents: ({ commit, state }, tubeBarcode) => {
    const tube = Object.values(state.resources.tubes).find((tube) => tube.barcode == tubeBarcode)
    commit('selectTube', { id: tube.id, selected: false })
    const { requests } = state.resources.tubes[tube.id]

    for (const requestId of requests) {
      commit('selectRequest', { id: requestId, selected: false })
      commit('removeResource', { resource: 'requests', id: requestId })
    }
    commit('removeResource', { resource: 'tubes', id: tube.id })
  },
}
