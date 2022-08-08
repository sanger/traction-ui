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
    // Imported from the original implementation. Used by PMB V1.
    // Strong suspicion we're not used
    labelTemplateId: import.meta.env.VITE_ONT_LABEL_TEMPLATE_ID,
  }
}
