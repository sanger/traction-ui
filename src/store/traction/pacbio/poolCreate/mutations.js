import { dataToObjectById } from '@/api/JsonApi'
import Vue from 'vue'

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
      Vue.set(state.selected.plates, id, state.resources.plates[id])
    } else {
      Vue.delete(state.selected.plates, id)
    }
  },
  /**
   * Flags plates in the array as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {Array.<{id: String, selected: Boolean}>} plates An array of plate id objects to be selected
   * @param {Boolean} selected Whether the plate is selected (defaults to true)
   */
  // TODO: add mutation
  // eslint-disable-next-line no-unused-vars
  selectPlates: (state, plates) => {},
  /**
   * Flags tagSet with `id` as selected.
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the plate
   */
  selectTagSet: (state, { id }) => {
    state.selected.tagSet = state.resources.tagSets[id]
  },
  /**
   * Flags request with `id` as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the plate
   */
  // TODO: add mutation
  // eslint-disable-next-line no-unused-vars
  selectRequest: (state, { id }) => {},
  /**
   * Flags requests in the Array as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {Array.<{id: String, selected: Boolean}>} requests An array of plate id objects to be selected
   * @param {Boolean} selected Whether the plate is selected (defaults to true)
   */
  // TODO: add mutation
  // eslint-disable-next-line no-unused-vars
  selectRequests: (state, requests) => {},

  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} plates The plate resources to populate the store
   */
  populatePlates: (state, plates) => {
    state.resources.plates = dataToObjectById({ data: plates, includeRelationships: true })
  },
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} wells The well resources to populate the store
   */
  populateWells: (state, wells) => {
    state.resources.wells = dataToObjectById({ data: wells, includeRelationships: true })
  },
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} requests The request resources to populate the store
   */
  populateRequests: (state, requests) => {
    state.resources.requests = dataToObjectById({ data: requests, includeRelationships: false })
  },
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} tagSets The tagSet resources to populate the store
   */
  populateTagSets: (state, tagSets) => {
    state.resources.tagSets = dataToObjectById({ data: tagSets, includeRelationships: true })
  },
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} tags The tag resources to populate the store
   */
  populateTags: (state, tags) => {
    state.resources.tags = dataToObjectById({ data: tags, includeRelationships: false })
  },
}
