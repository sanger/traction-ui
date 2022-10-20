import { populateById } from '@/api/JsonApi'

// Mutations handle synchronous update of state.
export default {
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} smrtLinkVersions The SmrtLinkVersions to populate the store
   */
  populateSmrtLinkVersions: populateById('smrtLinkVersions'),
}
