import Vue from 'vue'
import { populateById, dataToObjectById } from '@/api/JsonApi'
import { newLibrary } from './pool'
import defaultState from './state'

export default {
  /**
   * Selects of deselects a plate based on the params
   * @param state The Vuex state
   * @param id The id of the plate to select
   * @param selected Defaults to true, selects or deselects the plate
   */
  selectPlate: (state, { id, selected = true }) => {
    if (selected) {
      Vue.set(state.selected.plates, `${id}`, { id: id, selected: true })
    } else {
      Vue.delete(state.selected.plates, `${id}`)
    }
  },
  /**
   * Selects of deselects a tube based on the params
   * @param state The Vuex state
   * @param id The id of the tube to select
   * @param selected Defaults to true, selects or deselects the tube
   */
  selectTube: (state, { id, selected = true }) => {
    if (selected) {
      Vue.set(state.selected.tubes, `${id}`, { id: id, selected: true })
    } else {
      Vue.delete(state.selected.tubes, `${id}`)
    }
  },
  /**
   * Given a request id it creates or deletes a pooling library
   * @param state The Vuex state
   * @param id The id of the tube to select
   * @param selected Defaults to true, selects or deselects the tube
   */
  selectRequest: (state, { id, selected = true }) => {
    if (selected) {
      Vue.set(state.pooling.libraries, `${id}`, newLibrary({ ont_request_id: id }))
    } else {
      Vue.delete(state.pooling.libraries, `${id}`)
    }
  },
  /**
   * Flags tagSet with `id` as selected.
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the plate
   */
  selectTagSet: (state, { id }) => {
    state.selected.tagSet = { id }
  },
  /**
   * Clears the data on the pool/new page
   * @param {Object} state The Vuex state object
   */
  clearPoolData: (state) => {
    const new_state = defaultState()
    Object.assign(state, new_state, { resources: state.resources })
  },
  /**
   * Updates the library with the corresponding data
   * @param {Object} state The VueXState object
   * @param {Object.{}} library The library data to update
   */
  updatePoolingLibrary: (state, library) => {
    Vue.set(
      state.pooling.libraries,
      `${library.ont_request_id}`,
      Object.assign({}, state.pooling.libraries[library.ont_request_id], library),
    )
  },
  /**
   * Populated the result with the response
   * @param {Object} state The VueXState object
   * @param {Object} Response A response object
   **/
  populatePoolingLibraries: (state, data) => {
    const newLibraries = dataToObjectById({ data, includeRelationships: true })
    Object.values(newLibraries).forEach((library) => {
      Vue.set(
        state.pooling.libraries,
        `${library.request}`,
        newLibrary({ ...library, ont_request_id: library.request, tag_id: library.tag }),
      )
    })
  },
  /**
   * Populates the pooling pool
   * @param {Object} state The VueXState object
   * @param id The pool id]
   * @param attributes the pool attributes
   **/
  populatePoolAttributes: (state, { id, attributes }) => {
    state.pooling.pool = {
      id,
      ...attributes,
    }
  },
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Object.{}} tube The tube resource to populate the store
   */
  populatePoolingTube: (state, { id, attributes }) => {
    state.pooling.tube = {
      id,
      ...attributes,
    }
  },
  // populatePools `includeRelationships: false` doesn't seem to work
  populatePools: populateById('pools', { includeRelationships: true }),
  setPools: populateById('pools', { includeRelationships: true }, true),
  populateLibraries: populateById('libraries', { includeRelationships: true }),
  populatePlates: populateById('plates', { includeRelationships: true }),
  populateTubes: populateById('tubes', { includeRelationships: true }),
  populateWells: populateById('wells', { includeRelationships: true }),
  setRequests: populateById('requests', { includeRelationships: true }, true),
  populateRequests: populateById('requests', { includeRelationships: true }),
  populateTagSets: populateById('tagSets', { includeRelationships: true }),
  populateTags: populateById('tags'),
}
