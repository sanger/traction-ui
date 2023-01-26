/**
 * Generates an object describing a new library for population `store.libraries`
 * @param {Object} attributes any attributes of the object to pre-populate
 * @example newLibrary({pacbio_request_id: '1'})
 */

const state = {
  pools: {},
  tubes: {},
  libraries: {},
  requests: {},
  tags: {},
}

export default () => {
  return {
    // Resources returned by the server, each key represents a resource type.
    // resource types are indexed by their id.
    resources: {
      // The SMRT Link version store.
      smrtLinkVersions: {},
    },
    ...state,
  }
}
