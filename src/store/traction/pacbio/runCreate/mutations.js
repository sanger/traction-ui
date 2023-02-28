import { populateById } from '@/api/JsonApi'

// Mutations handle synchronous update of state.
export default {
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} smrtLinkVersions The SmrtLinkVersions to populate the store
   */
  populateSmrtLinkVersions: populateById('smrtLinkVersions'),

  /**
   * Populated via API calls from the actions
   * @param {Object} state The VueXState object
   * @param {Object} smrtLinkVersions The current run to populate the store
   */
  populateRun: (store, { id, attributes }) => {
    store.run = {
      id,
      ...attributes,
    }
  },

  /**
   * Populated via API calls from the actions
   * @param {Object} state The VueXState object
   * @param {Object} smrtLinkVersions The wells for the current run
   */
  populateWells: populateById('wells', { includeRelationships: true, populateResources: false }),

  /**
   * Populated via API calls from the actions
   * @param {Object} state The VueXState object
   * @param {Object} smrtLinkVersions The pools for the wells for the current run
   */
  populatePools: populateById('pools', { includeRelationships: true, populateResources: false }),
}
