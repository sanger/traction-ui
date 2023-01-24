import { populateById } from '@/api/JsonApi'

export default {

  /**
   * Remove specific resource given the store resource location and resource id
   * @param {Object} state The VueXState object
   * @param {String} resource The name of the resource from the store
   * @param {Object.{}} resourceId The resource id to remove from the store
   */
  removeResource: (state, { resource, id }) => {
    delete state.resources[resource][id]
  },
  setRuns: populateById('runs', { includeRelationships: true }, true),
  populateInstruments: populateById('instruments', { includeRelationships: true }),
}
