import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { wellFor, wellToIndex } from './wellHelpers'
import { validate, valid, payload } from './pool'

const autoTagPlate = ({ state, commit }, { library }) => {
  const initialWell = wellFor(state, library)
  const initialIndex = wellToIndex(initialWell)
  const tags = state.resources.tagSets[state.selected.tagSet.id].tags
  const initialTagIndex = tags.indexOf(library.tag_id)
  const plate = initialWell.plate

  Object.values(state.libraries).forEach(({ ont_request_id }) => {
    const otherWell = wellFor(state, { ont_request_id })

    if (otherWell?.plate !== plate) return

    const offset = wellToIndex(otherWell) - initialIndex

    if (offset < 1) return

    const newTag = (initialTagIndex + offset) % tags.length
    commit('updateLibrary', { ont_request_id, tag_id: tags[newTag] })
  })
}

export default {
  /**
   * Sets the pool data in the store
   * @param state the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @param id the id of the pool
   */
  setPoolData: async ({ commit, rootState }, id) => {
    if (isNaN(id)) {
      commit('clearPoolData')
    }
    // We want to populate libraries if id exists
  },
  findOntPlate: async ({ commit, rootState }, filter) => {
    // Here we want to make sure the filter exists
    // If it doesn't exist the request will return all plates
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a plate barcode'],
      }
    }

    const request = rootState.api.traction.ont.plates
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

  fetchOntRequests: async ({ commit, rootState }, filter) => {
    const request = rootState.api.traction.ont.requests
    const promise = request.get({ filter: filter })
    const response = await handleResponse(promise)

    let { success, data: { data } = {}, errors = [] } = response

    if (success) {
      commit('setRequests', data)
    }

    return { success, errors }
  },

  fetchOntTagSets: async ({ commit, rootState }) => {
    const request = rootState.api.traction.ont.tag_sets
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

  /*
   * Creates a pool from the libraries
   */
  createPool: async ({ rootState, state: { libraries, pool } }) => {
    validate({ libraries })
    if (!valid({ libraries })) return { success: false, errors: 'The pool is invalid' }
    const request = rootState.api.traction.ont.pools
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
    const request = rootState.api.traction.ont.pools
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

    requestIds.forEach((ont_request_id) => {
      if (!libraries[`_${ont_request_id}`]) {
        // We're adding a library
        csvLogger(commit, info, 'info')(`Added ${source} to pool`)
      }
      commit('updateLibrary', { ont_request_id, ...tagAttributes, ...attributes })
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
    commit('updateLibrary', library)
    if (autoTag) {
      const request = state.resources.requests[library.ont_request_id]
      autoTagPlate({ state, commit }, { library })
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
}
