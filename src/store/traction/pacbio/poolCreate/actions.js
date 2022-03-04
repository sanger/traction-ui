import { groupIncludedByResource } from '@/api/JsonApi'
import { validate, payload, valid } from '@/store/traction/pacbio/poolCreate/pool'
import { handleResponse } from '@/api/ResponseHelper'
import { wellFor, wellToIndex } from './wellHelpers'

const sourceRegex = /^(?<barcode>\w+)-(?<wellName>\w[0-9]{1,2})$/
const errorFor = ({ lines, records }, message) => `Library ${records} on line ${lines}: ${message}`
const csvLogger = (commit, info, level) => (message) =>
  commit(
    'traction/addMessage',
    {
      type: level,
      message: errorFor(info, message),
    },
    { root: true },
  )

// Actions handle asynchronous update of state, via mutations.
// see https://vuex.vuejs.org/guide/actions.html
export default {
  /**
   * Retrieves a list of pacbio request from traction-service and populates the store
   * with associated plates, wells and tubes
   * @param rootState the vuex rootState object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchPacbioRequests: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.requests
    const promise = request.get({ include: 'well.plate,tube' })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      const { wells, plates, tubes } = groupIncludedByResource(included)
      commit('populateRequests', data)
      commit('populatePlates', plates)
      commit('populateWells', wells)
      commit('populateTubes', tubes)
    }

    return { success, errors }
  },
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
    for (let id of requests) {
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
    for (let wellId of wells) {
      const { requests = [] } = state.resources.wells[wellId]
      for (let requestId of requests) {
        commit('selectRequest', { id: requestId, selected: false })
      }
    }
  },
  /**
   * When a tube is deselected, we need to also remove all its requests
   */
  deselectTubeAndContents: ({ commit, state }, tubeId) => {
    commit('selectTube', { id: tubeId, selected: false })
    const { requests } = state.resources.tubes[tubeId]

    for (let requestId of requests) {
      commit('selectRequest', { id: requestId, selected: false })
    }
  },
  /**
   * When a tube is deselected, we need to also remove all its requests
   */
  selectTubeAndContents: ({ commit, state }, tubeId) => {
    commit('selectTube', { id: tubeId, selected: true })

    const { requests } = state.resources.tubes[tubeId]

    for (let requestId of requests) {
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
    // TODO: I think this is the best I can do here but it may be an idea to extract this into a method
    // if we have to do it more often
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
      include: 'libraries.tag.tag_set,libraries.source_plate.wells.requests,libraries.request,tube',
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
        tubes: [tube],
      } = groupIncludedByResource(included)
      commit('populatePoolAttributes', data)
      commit('populateLibraries', libraries)
      commit('populateRequests', requests)
      commit('populateWells', wells)
      commit('populatePlates', plates)
      commit('selectTagSet', tag_set)
      commit('populateTube', tube)
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
   *   if tag 2 was applied to A1, then C1 would receive tag 4 regardless of
   *   the state of B1.
   */
  applyTags: ({ state, commit }, { library, autoTag }) => {
    // We always apply the first tag
    commit('updateLibrary', library)
    if (autoTag) {
      const initialWell = wellFor(state, library)
      const initialIndex = wellToIndex(initialWell)
      const tags = state.resources.tagSets[state.selected.tagSet.id].tags
      const initialTagIndex = tags.indexOf(library.tag_id)
      const plate = initialWell.plate

      Object.values(state.libraries).forEach(({ pacbio_request_id }) => {
        const otherWell = wellFor(state, { pacbio_request_id })

        if (otherWell.plate !== plate) return

        const offset = wellToIndex(otherWell) - initialIndex

        if (offset < 1) return

        const newTag = (initialTagIndex + offset) % tags.length
        commit('updateLibrary', { pacbio_request_id, tag_id: tags[newTag] })
      })
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
    {
      state: {
        resources: { plates, wells },
        libraries,
      },
      commit,
      getters,
    },
    { record: { source, tag, ...attributes }, info },
  ) => {
    const error = csvLogger(commit, info, 'danger')
    if (!source) return error('has no source')

    const match = source.match(sourceRegex)

    if (!match) return error(`${source} should be in the format barcode-well. Eg. DN123S-A1`)

    const { barcode, wellName } = match.groups

    const plate = Object.values(plates).find((plate) => plate.barcode == barcode)
    if (!plate) return error(`${barcode} could not be found`)
    // Ensure the plate is registered as selected
    commit('selectPlate', { id: plate.id, selected: true })

    const wellId = plate.wells.find((well_id) => wells[well_id].position == wellName)
    if (!wellId) return error(`A well named ${wellName} could not be found on ${barcode}`)

    const tagAttributes = {}
    if (tag) {
      const matchedTag = getters.selectedTagSet.tags.find(({ group_id }) => group_id === tag)
      if (matchedTag) {
        tagAttributes.tag_id = matchedTag.id
      } else {
        error(`Could not find a tag named ${tag} in selected tag group`)
      }
    }

    wells[wellId].requests.forEach((pacbio_request_id) => {
      if (!libraries[`_${pacbio_request_id}`]) {
        // We're adding a library
        csvLogger(commit, info, 'info')(`Added ${source} to pool`)
      }
      commit('updateLibrary', { pacbio_request_id, ...tagAttributes, ...attributes })
    })
  },
}
