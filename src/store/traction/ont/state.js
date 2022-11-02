/**
 * Generates an object describing the shared ONT resources for use in the vuex
 * store
 */

export default () => {
  return {
    // Resources returned by the server, each key represents a resource type.
    // resource types are indexed by their id.
    resources: {
      requests: {},
      samples: {},
    },
  }
}
