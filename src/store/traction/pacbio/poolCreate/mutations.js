import { dataToObjectById, populateById } from '@/api/JsonApi'
import { newLibrary } from '@/store/traction/pacbio/poolCreate/pool.js'
import defaultState from './state'

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
      state.selected.plates[`${id}`] = { id: id, selected: true }
    } else {
      delete state.selected.plates[`${id}`]
    }
  },
  /**
   * Flags tube with `id` as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the tube
   * @param {Boolean} selected Whether the tube is selected (defaults to true)
   */
  selectTube: (state, { id, selected = true }) => {
    if (selected) {
      state.selected.tubes[`${id}`] = { id: id, selected: true }
    } else {
      delete state.selected.tubes[`${id}`]
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
      libraries[`_${id}`] = newLibrary({ pacbio_request_id: id })
    } else {
      delete libraries[`_${id}`]
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
   * @param {Array.{}} tubes The tube resources to populate the store
   */
  populateTubes: populateById('tubes', { includeRelationships: true }),
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
  populateRequests: populateById('requests', { includeRelationships: true }),
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
  /**
   * Populated the result with the response
   * @param {Object} state The VueXState object
   * @param {Object} Response A response object
   **/
  populateLibraries: ({ libraries }, data) => {
    const newLibraries = dataToObjectById({ data, includeRelationships: true })
    Object.values(newLibraries).forEach((library) => {
      const key = `_${library.request}`
      libraries[key] = newLibrary({
        ...library,
        pacbio_request_id: library.request,
        tag_id: library.tag,
      })
    })
  },
  populatePoolAttributes: (store, { id, attributes }) => {
    // Nothing
    store.pool = {
      id,
      ...attributes,
    }
  },
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Object.{}} tube The tube resource to populate the store
   */
  populateTube: (store, { id, attributes }) => {
    store.tube = {
      id,
      ...attributes,
    }
  },
  /**
   * Updates the library with the corresponding data
   * @param {Object} state The VueXState object
   * @param {Object.{}} library The library data to update
   */
  updateLibrary: ({ libraries }, library) => {
    const key = `_${library.pacbio_request_id}`
    libraries[key] = Object.assign({}, libraries[key], library)
  },
  // This method clears the editable data in the pool/new page
  // We keep the resources though
  clearPoolData: (state) => {
    const new_state = defaultState()
    Object.assign(state, new_state, { resources: state.resources })
  },
}
