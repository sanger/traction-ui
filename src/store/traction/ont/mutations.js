import Vue from 'vue'
import { populateById, dataToObjectById } from '@/api/JsonApi'
import { newLibrary } from './pool'
import defaultState from './state'

export default {
  selectPlate: (state, { id, selected = true }) => {
    if (selected) {
      Vue.set(state.selected.plates, `${id}`, { id: id, selected: true })
    } else {
      Vue.delete(state.selected.plates, `${id}`)
    }
  },
   selectTube: (state, { id, selected = true }) => {
    if (selected) {
      Vue.set(state.selected.tubes, `${id}`, { id: id, selected: true })
    } else {
      Vue.delete(state.selected.tubes, `${id}`)
    }
  },
  selectRequest: (state, { id, selected = true }) => {
    if (selected) {
      Vue.set(state.pooling.libraries, `_${id}`, newLibrary({ ont_request_id: id }))
    } else {
      Vue.delete(state.pooling.libraries, `_${id}`)
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
    const key = `_${library.ont_request_id}`
    Vue.set(state.pooling.libraries, key, Object.assign({}, state.pooling.libraries[key], library))
  },
  /**
   * Populated the result with the response
   * @param {Object} state The VueXState object
   * @param {Object} Response A response object
   **/
  populatePoolingLibraries: (state, data) => {
    const newLibraries = dataToObjectById({ data, includeRelationships: true })
    Object.values(newLibraries).forEach((library) => {
      const key = `_${library.request}`
      Vue.set(
        state.pooling.libraries,
        key,
        newLibrary({ ...library, ont_request_id: library.request, tag_id: library.tag }),
      )
    })
  },
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
  populatePlates: populateById('plates', { includeRelationships: true }),
  populateTubes: populateById('tubes', { includeRelationships: true }),
  populateWells: populateById('wells', { includeRelationships: true }),
  setRequests: populateById('requests', { includeRelationships: true }, true),
  populateRequests: populateById('requests', { includeRelationships: true }),
  populateTagSets: populateById('tagSets', { includeRelationships: true }),
  populateTags: populateById('tags'),
}
