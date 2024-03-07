import { groupIncludedByResource } from '@/api/JsonApi.js'
import { validate, payload, valid } from '@/store/traction/pacbio/poolCreate/pool.js'
import { handleResponse } from '@/api/ResponseHelper.js'
import { wellFor, wellToIndex } from '@/store/traction/pacbio/poolCreate/wellHelpers.js'

const sourceRegex = /^(?<barcode>[\w-]+)(:(?<wellName>\w[0-9]{1,2})){0,1}$/

const errorFor = ({ lines, records }, message) => `Library ${records} on line ${lines}: ${message}`
const csvLogger = (commit, info, level) => (message) =>
  commit('traction/addMessage', { type: level, message: errorFor(info, message) }, { root: true })
/**
 *
 * Finds the tube associated with a pacbio_request
 * @param {Object} resources PacbioVueX store resources object
 * @returns {Object} the matching tube from the store
 */
const tubeFor = ({ resources }, { pacbio_request_id }) =>
  resources.tubes[resources.requests[pacbio_request_id]?.tube]

const autoTagPlate = ({ state, commit }, { library }) => {
  const initialWell = wellFor(state, library)
  const initialIndex = wellToIndex(initialWell)
  const tags = state.resources.tagSets[state.selected.tagSet.id].tags
  const initialTagIndex = tags.indexOf(library.tag_id)
  const plate = initialWell.plate

  Object.values(state.libraries).forEach(({ pacbio_request_id }) => {
    const otherWell = wellFor(state, { pacbio_request_id })

    if (otherWell?.plate !== plate) return

    const offset = wellToIndex(otherWell) - initialIndex

    if (offset < 1) return

    const newTag = (initialTagIndex + offset) % tags.length
    commit('updateLibrary', { pacbio_request_id, tag_id: tags[newTag] })
  })
}

const autoTagTube = ({ state, commit, getters }, { library }) => {
  const initialTube = tubeFor(state, library)
  const tags = state.resources.tagSets[state.selected.tagSet.id].tags
  const initialTagIndex = tags.indexOf(library.tag_id)

  Object.values(getters.selectedRequests)
    .filter((request) => {
      return request.tube && parseInt(request.tube) > parseInt(initialTube.id)
    })
    .forEach((req, offset) => {
      const newTag = (initialTagIndex + offset + 1) % tags.length
      commit('updateLibrary', { pacbio_request_id: req.id, tag_id: tags[newTag] })
    })
}

/**
 *
 * Finds the tag id for the tag specified by tag, within the current tag group
 * @param {Object} options - An options object
 * @param {Object} options.getters PacbioVueX store getters object
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

const barcodeNotFound = (barcode) =>
  `${barcode} could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.`

const requestsForPlate = ({ barcode, wellName, plates, commit, wells }) => {
  const plate = Object.values(plates).find((plate) => plate.barcode == barcode)
  if (!plate) return { success: false, errors: barcodeNotFound(barcode) }

  // Ensure the plate is registered as selected
  commit('selectPlate', { id: plate.id, selected: true })
  const wellId = plate.wells.find((well_id) => wells[well_id].position == wellName)
  if (!wellId)
    return {
      success: false,
      errors: `A well named ${wellName} could not be found on ${barcode}`,
    }
  return { success: true, requestIds: wells[wellId].requests }
}

const requestsForTube = ({ barcode, tubes, commit }) => {
  const tube = Object.values(tubes).find((tube) => tube.barcode == barcode)
  if (!tube) return { success: false, errors: barcodeNotFound(barcode) }
  // Ensure the tube is registered as selected
  commit('selectTube', { id: tube.id, selected: true })
  return { success: true, requestIds: tube.requests }
}

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
// Actions handle asynchronous update of state, via mutations.
// see https://vuex.vuejs.org/guide/actions.html
export default {
  fetchPacbioTagSets: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.tag_sets
    /* I've been explicit about the includes here as we make an assumption
       below that only tags are included. */
    const promise = request.get({ include: 'tags' })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      commit('populateTagSets', data)
      /* We are currently only including tags. So this is really simple */
      commit('populateTags', included)
    }

    return { success, errors, response }
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
    const selectedRequests = state.libraries
    for (const id of requests) {
      const selected = !!selectedRequests[`_${id}`]
      commit('selectRequest', { id, selected: !selected })
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
      }
    }
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
    }
  },
  /**
   * When a tube is deselected, we need to also remove all its requests
   */
  selectTubeAndContents: ({ commit, state }, tubeId) => {
    commit('selectTube', { id: tubeId, selected: true })

    const { requests } = state.resources.tubes[tubeId]

    for (const requestId of requests) {
      commit('selectRequest', { id: requestId, selected: true })
    }
  },

  /*
   * Creates a pool from the libraries
   */
  createPool: async ({ rootState, state: { libraries, pool } }) => {
    validate({ libraries })
    if (!valid({ libraries })) return { success: false, errors: 'The pool is invalid' }
    const request = rootState.api.traction.pacbio.pools
    const promise = request.create({ data: payload({ libraries, pool }), include: 'tube' })
    const { success, data: { included = [] } = {}, errors } = await handleResponse(promise)
    const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
    const { attributes: { barcode = '' } = {} } = tube
    return { success, barcode, errors }
  },
  /*
   * Update a pool and libraries
   */
  updatePool: async ({ rootState, state: { libraries, pool } }) => {
    validate({ libraries })
    if (!valid({ libraries })) return { success: false, errors: 'The pool is invalid' }
    const request = rootState.api.traction.pacbio.pools
    const promise = request.update(payload({ libraries, pool }))
    const { success, errors } = await handleResponse(promise)
    return { success, errors }
  },
  populateLibrariesFromPool: async ({ commit, rootState }, poolId) => {
    const request = rootState.api.traction.pacbio.pools
    const promise = request.find({
      id: poolId,
      // We want to load *all* associated records, as otherwise we might be referencing them
      // before they are loaded. Furthermore, if we start filtering the plates list at all,
      // we may *never* load the relevant records.
      // We load the other wells associated with the plate too, to ensure the remaining plate
      // doesn't appear empty. This is especially important if the pool request finishes
      // after the request for all plates, as otherwise the partial record will over-write
      // the full one.
      include:
        'libraries.tag.tag_set,libraries.source_plate.wells.requests,libraries.request.tube,tube',
    })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      const {
        library_pools,
        requests,
        wells,
        plates = [],
        tag_sets: [tag_set] = [{}],
        tubes = [],
      } = groupIncludedByResource(included)
      // Get the pool tube and remove it from tubes list
      const poolTube = tubes.splice(
        tubes.indexOf((tube) => tube.id == data.relationships.tube.data.id),
        1,
      )[0]
      commit('populatePoolAttributes', data)
      commit('populateLibraries', library_pools)
      commit('populateRequests', requests)
      commit('populateWells', wells)
      commit('populatePlates', plates)
      commit('populateTubes', tubes)
      commit('selectTagSet', tag_set)
      commit('populatePoolTube', poolTube)

      tubes.forEach(({ id }) => commit('selectTube', { id, selected: true }))
      plates.forEach(({ id }) => commit('selectPlate', { id, selected: true }))
    }

    return { success, errors }
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
    commit('updateLibrary', library)
    if (autoTag) {
      const request = state.resources.requests[library.pacbio_request_id]
      if (request.well) {
        autoTagPlate({ state, commit }, { library })
      } else {
        autoTagTube({ state, commit, getters }, { library })
      }
    }
  },
  /**
   * Given a record extracted from a csv file, will update the corresponding library
   * Each library is identified by the key 'source' which consists of a string identifying
   * the source plate barcode and its well. eg. DN814597W-A10
   * @param state the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  updateLibraryFromCsvRecord: (
    { state: { resources, libraries }, commit, getters },
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

    requestIds.forEach((pacbio_request_id) => {
      if (!libraries[`_${pacbio_request_id}`]) {
        // We're adding a library
        csvLogger(commit, info, 'info')(`Added ${source} to pool`)
      }
      commit('updateLibrary', { pacbio_request_id, ...tagAttributes, ...attributes })
    })
  },

  /**
   * Sets the plate data in the store
   * @param rootState the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @param filter the filter applied to the plate search
   */
  findPacbioPlate: async ({ commit, rootState }, filter) => {
    // Here we want to make sure the filter exists
    // If it doesn't exist the request will return all plates
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a plate barcode'],
      }
    }

    const request = rootState.api.traction.pacbio.plates
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
  findPacbioTube: async ({ commit, rootState }, filter) => {
    // Here we want to make sure the filter exists
    // If it doesn't exist the request will return all tubes
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a tube barcode'],
      }
    }

    const request = rootState.api.traction.pacbio.tubes
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
}
