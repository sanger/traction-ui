import { dataToObjectById } from '@/api/JsonApi'
import Vue from 'vue'
import { newLibrary } from '@/store/traction/pacbio/poolCreate/pool.js'

const populateById = (resource, { includeRelationships = false } = {}) => (state, data) => {
  Vue.set(state.resources, resource, dataToObjectById({ data, includeRelationships }))
}

// Mutations handle synchronous update of state.
export default {
  /**
   * Flags plate with `id` as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the plate
   * @param {Boolean} selected Whether the plate is selected (defaults to true)
   */
  selectPlate: (state, { id, selected = true }) => {
    if (selected) {
      Vue.set(state.selected.plates, `_${id}`, { id: id, selected: true })
    } else {
      Vue.delete(state.selected.plates, `_${id}`)
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
   * Flags request with `id` as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the request
   * @param {Boolean} selected Set to false to de-select the request. [Optional] true by default
   */
  selectRequest: ({ libraries }, { id, selected = true }) => {
    if (selected) {
      Vue.set(libraries, `_${id}`, newLibrary({ pacbio_request_id: id }))
    } else {
      Vue.delete(libraries, `_${id}`)
    }
  },

  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} plates The plate resources to populate the store
   */
  populatePlates: populateById('plates', { includeRelationships: true }),
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} wells The well resources to populate the store
   */
  populateWells: populateById('wells', { includeRelationships: true }),
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} requests The request resources to populate the store
   */
  populateRequests: populateById('requests'),
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} tagSets The tagSet resources to populate the store
   */
  populateTagSets: populateById('tagSets', { includeRelationships: true }),
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} tags The tag resources to populate the store
   */
  populateTags: populateById('tags'),
}
