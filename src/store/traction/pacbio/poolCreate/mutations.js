import { dataToObjectById } from '@/api/JsonApi'
import Vue from 'vue'
import { newLibrary } from '@/store/traction/pacbio/poolCreate/state.js'

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

  /**
   * Update an existing library in its store
   * @param {Object} state The VueXState object
   * This method will check each library to ensure that:
   *  * required fields are present
   *  * tags are unique
   **/
  validateLibraries: ({ libraries }) => {
    const requiredFields = [
      'tag_id',
      'template_prep_kit_box_barcode',
      'concentration',
      'volume',
      'fragment_size',
    ]

    for (const [key, library] of Object.entries(libraries)) {
      console.log
      const errors = {}
      requiredFields.forEach((field) => {
        if (!library[field]) {
          errors[field] = 'must be present'
        }
      })

      if (Object.entries(libraries).some(([k, e]) => e.tag_id === library.tag_id && k !== key)) {
        errors['tag_id'] = 'duplicated'
      }

      Vue.set(libraries, key, { ...library, errors })
    }
  },
}
