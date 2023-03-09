/**
 * Generates an object describing a new library for population `store.libraries`
 * @param {Object} attributes any attributes of the object to pre-populate
 * @example newLibrary({pacbio_request_id: '1'})
 */

export default () => {
  return {
    // Resources returned by the server, each key represents a resource type.
    // resource types are indexed by their id.
    resources: {
      // The SMRT Link version store.
      smrtLinkVersions: {},
    },
    // Run: The current run being edited or created
    run: {},

    // Wells: The wells that belong to the run
    wells: {},

    //Pools: The pools that belong to the wells or the pool selected for a new run
    pools: {},

    //Tubes: The tubes for each pool or the tubes selected for a new run
    tubes: {},

    //Libraries: The libraries for the currently selected pools
    libraries: {},

    //Requests: The requests for the libraries for the currenly selected pools
    requests: {},

    //Tags: The tags for the currently selected libraries
    tags: {},

    //Run Type: The type of run either new or existing
    runType: {},
  }
}
