import Vue from 'vue'
import { populateById } from '@/api/JsonApi'
import { newLibrary } from '@/store/traction/pacbio/poolCreate/pool.js'

export default {
  selectPlate: (state, { id, selected = true }) => {
    if (selected) {
      Vue.set(state.selected.plates, `${id}`, { id: id, selected: true })
    } else {
      Vue.delete(state.selected.plates, `${id}`)
    }
  },
  selectRequest: ({ libraries }, { id, selected = true }) => {
    if (selected) {
      Vue.set(libraries, `_${id}`, newLibrary({ ont_request_id: id }))
    } else {
      Vue.delete(libraries, `_${id}`)
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
  populatePlates: populateById('plates', { includeRelationships: true }),
  populateWells: populateById('wells', { includeRelationships: true }),
  setRequests: populateById('requests', { includeRelationships: true }, true),
  populateRequests: populateById('requests', { includeRelationships: true }),
  populateTagSets: populateById('tagSets', { includeRelationships: true }),
  populateTags: populateById('tags'),
}
