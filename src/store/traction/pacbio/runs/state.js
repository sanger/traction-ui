export default () => {
  return {
    runs: {},
    currentRun: {},

    // Resources returned by the server, each key represents a resource type.
    // resource types are indexed by their id.
    resources: {
      // The SMRT Link version store.
      smrtLinkVersions: {},
    },
  }
}
