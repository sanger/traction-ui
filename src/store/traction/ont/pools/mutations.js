import { populateById, dataToObjectById } from '@/api/JsonApi'
import { newLibrary } from '@/store/traction/ont/pools/pool.js'
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
      state.selected.plates[`${id}`] = { id: id, selected: true }
    } else {
      delete state.selected.plates[`${id}`]
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
      state.selected.tubes[`${id}`] = { id: id, selected: true }
    } else {
      delete state.selected.tubes[`${id}`]
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
      state.pooling.libraries[`${id}`] = newLibrary({ ont_request_id: id })
    } else {
      delete state.pooling.libraries[`${id}`]
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
   * @param {Object} library The library data to update
   */
  updatePoolingLibrary: (state, library) => {
    state.pooling.libraries[`${library.ont_request_id}`] = Object.assign(
      {},
      state.pooling.libraries[library.ont_request_id],
      library,
    )
  },
  /**
   * Populated the result with the response
   * @param {Object} state The VueXState object
   * @param {Object} Response A response object
   * I am wondering why we need to do this. Refactor needed.
   **/
  populatePoolingLibraries: (state, data) => {
    const newLibraries = dataToObjectById({ data, includeRelationships: true })
    Object.values(newLibraries).forEach((library) => {
      state.pooling.libraries[`${library.request}`] = newLibrary({
        ...library,
        ont_request_id: library.request,
        tag_id: library.tag,
      })
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
   * @param {Object} tube The tube resource to populate the store
   */
  populatePoolingTube: (state, { id, attributes }) => {
    state.pooling.tube = {
      id,
      ...attributes,
    }
  },
  setPools: populateById('pools', { includeRelationships: true }, true),
  populateLibraries: populateById('libraries', { includeRelationships: true }),
  populatePlates: populateById('plates', { includeRelationships: true }),
  populateTubes: populateById('tubes', { includeRelationships: true }),
  populateWells: populateById('wells', { includeRelationships: true }),
  setRequests: populateById('requests', { includeRelationships: true }, true),
  populateRequests: populateById('requests', { includeRelationships: true }),
  populateTagSets: populateById('tagSets', { includeRelationships: true }),
  populateTags: populateById('tags'),
  populatePools: populateById('pools', { includeRelationships: true }),

  /**
   * Remove specific resource given the store resource location and resource id
   * @param {Object} state The VueXState object
   * @param {String} resource The name of the resource from the store
   * @param {Object} resourceId The resource id to remove from the store
   */
  removeResource: (state, { resource, id }) => {
    delete state.resources[resource][id]
  },
}
