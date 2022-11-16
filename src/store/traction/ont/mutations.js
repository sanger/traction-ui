import { populateById } from '@/api/JsonApi'

export default {
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} requests The request resources to populate the store
   */
  populateRequests: populateById('requests', { includeRelationships: true }, true),
}
