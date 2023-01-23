/**
 * Generates an object describing the shared ONT resources for use in the vuex
 * store
 */

export default () => {
  return {
    // Resources returned by the server, each key represents a resource type.
    // resource types are indexed by their id.
    resources: {
      // The main source of run information. runs are indexed by id.
      runs: {},
      // The main source of instrument information. instrument are indexed by id.
      instruments: {},
    },
  }
}
