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
      // The main plate store. Represents the authoritative source of plate
      // information. Plates are indexed by id.
      plates: {},
      /**
       * The main source of well information. Wells are indexed by id.
       * Populated by the wells included in the request for plates.
       * @example {"id":"1","type":"wells","position":"A1","requests":["1"]}
       */
      wells: {},
      // The main source of request information. Requests are indexed by id.
      // Populated by the requests included in the request for plates.
      requests: {},
      // The main source of tagSet information. tagSets are indexed by id.
      tagSets: {},
      // The main source of tagSet information. tagSets are indexed by id.
      // Populated by the tags from a tag set
      tags: {},
      //
    },
    // Selected collects together user input in the front end, such as
    // selected plates and libraries.
    selected: {
      // Object reflecting the id of the selected tag set and a selected
      // attribute.
      // eg { id: '1' }
      tagSet: {},
      // Object representing all selected plates. Selected plates are indexed by
      // id. Each plate is represented by an object with an id and a selected
      // attribute { id: 'plate_id', selected: true }
      plates: {},
    },
    // Libraries. Indexed by an internally generated id.
    libraries: {},
  }
}
