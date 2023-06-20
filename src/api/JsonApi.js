import Vue from 'vue'

/**
 * Extract the attributes from a JSON API resource object, merge them with the id
 * and type attributes
 * @param {String} id The id of the jsonapi resource
 * @param {String} type The type of the jsonapi resource
 * @param {Object} attributes The attributes object of a JSON API resource
 */
const extractAttributes = ({ id, type, attributes }) => ({ id, type, ...attributes })

const mapRelationships = (relationships = {}) => {
  return Object.keys(relationships).reduce((result, name) => {
    if (relationships[name].data) {
      result[name] = relationships[name].data
    }
    return result
  }, {})
}

/**
 * Groups resources by their resource type
 * @param {Array} included Array of JSON API resources
 */
const groupIncludedByResource = (included) => {
  return included.reduce((group, resource) => {
    if (group[resource.type] === undefined) {
      group[resource.type] = []
    }
    group[resource.type].push(resource)
    return group
  }, {})
}

/**
 * Groups resources by their resource type
 * @param {Object} relationships Object of JSON API resources
 * @returns {Object} each key will be the relationships grouped by type with an array of ids
 */
const extractRelationshipsAndGroupById = (relationships = {}) => {
  return Object.keys(relationships).reduce((result, type) => {
    const data = relationships[type].data
    if (data instanceof Array) {
      // We have multiple entries
      result[type] = data.map(({ id }) => id)
    } else {
      // Add the id data is present, otherwise add the value of data itself
      // this may be null (No relation) or undefined (relationship not loaded)
      result[type] = data ? data.id : data
    }
    return result
  }, {})
}

/**
 * TODO: This will need to be extended to extract relationships?
 * Groups resources by their resource type
 * @param {Array} data Array of JSON API data
 * @returns {Object} keys will be the id of the data
 */
const dataToObjectById = ({ data = [], includeRelationships = false }) => {
  return data.reduce((result, { id, type, attributes, relationships }) => {
    return {
      [id]: {
        // we still keep the id as it will be needed
        id,
        // the type can be useful for components
        type,
        ...attributes,
        // we might not want to use the relationships
        ...(includeRelationships ? extractRelationshipsAndGroupById(relationships) : {}),
      },
      ...result,
    }
  }, {})
}

/**
 * Useful for grouping resources by a position
 * Merge this with dataToObjectById to prevent duplication
 * @param {Array} data Array of JSON API data
 * @returns {Object} keys will be the position for the data. This usually will be wells
 */
const dataToObjectByPosition = ({ data = [], includeRelationships = false }) => {
  return data.reduce((result, { id, type, attributes: { position, ...rest }, relationships }) => {
    return {
      [position]: {
        // we still keep the id as it will be needed
        id,
        // the type can be useful for components
        type,
        position,
        ...rest,
        // we might not want to use the relationships
        ...(includeRelationships ? extractRelationshipsAndGroupById(relationships) : {}),
      },
      ...result,
    }
  }, {})
}

// const dataToIdByPosition = ({ data = [] }) => {
//   return data.reduce((result, { id, type, attributes: { position, ...rest }, relationships }) => {
//     return {
//       [position]: id,
//       ...result,
//     }
//   }, {})
// }

const extractRelationship = (relationship, included, includeStore = {}) => {
  if (Array.isArray(relationship)) {
    return relationship.map((item) => deserializeIncluded(item, included, includeStore))
  } else {
    return deserializeIncluded(relationship, included, includeStore)
  }
}

const findIncluded = (relationship, included) => {
  return (
    included.find((item) => item.id === relationship.id && item.type === relationship.type) || {
      attributes: {},
    }
  )
}

const deserializeIncluded = (relationship, included, includeStore = {}) => {
  const cacheKey = `${relationship.type}:${relationship.id}`

  if (includeStore[cacheKey]) {
    return includeStore[cacheKey]
  }

  const { attributes, relationships } = findIncluded(relationship, included)

  const serialized = { ...relationship, ...attributes }
  // We add the object to the store before extracting relationships, as otherwise
  // circular relationships will attempt to find the as yet uncached object and
  // we'll end up in a loop. Instead they point to the as yet incomplete object,
  // which will later be mutated to a full representation as we unroll the stack.
  includeStore[cacheKey] = serialized
  return Object.assign(serialized, extractRelationships(relationships, included, includeStore))
}

const extractRelationships = (relationships, included, includeStore = {}) => {
  if (relationships === undefined || included === undefined) return {}
  const mapped = mapRelationships(relationships)
  return Object.keys(mapped).reduce((result, name) => {
    result[name] = extractRelationship(mapped[name], included, includeStore)
    return result
  }, {})
}

const extractPlateData = (plates, wells) => {
  return plates.map((plate) => {
    // Get the wells for the given plate
    const wellIds = plate.relationships.wells.data.map((w) => w.id)
    const plateWells = wells.filter((well) => wellIds.includes(well.id))

    // Format the well data, to include pool ids
    // const wellsData = dataToIdByPosition({ data: plateWells })
    const wellsData = dataToObjectByPosition({ data: plateWells, includeRelationships: true })

    return {
      id: plate.id,
      ...plate.attributes,
      wells: wellsData,
    }
  })
}

const extractResourceObject = (data, included, includeStore = {}) => {
  return Object.assign(
    extractAttributes(data),
    extractRelationships(data.relationships, included, includeStore),
  )
}

/*
  Deserialize a json-api object to bring included relationships, ids and types inline.
  @param response: {data: Object, included: Object} the object to deserialize
*/
const deserialize = ({ data, included }, includeStore = {}) => {
  if (Array.isArray(data)) {
    return data.reduce((result, item) => {
      const resourceObject = extractResourceObject(item, included, includeStore)
      const type = resourceObject.type
      if (Array.isArray(result[type])) {
        result[type].push(resourceObject)
      } else {
        result[type] = [resourceObject]
      }
      return result
    }, {})
  } else {
    const resourceObject = extractResourceObject(data, included, includeStore)
    return { [resourceObject.type]: [resourceObject] }
  }
}

const matchesAllAttributes =
  (filters) =>
  ({ attributes }) =>
    Object.entries(filters).every(([key, value]) => attributes[key] === value)

/**
 * Filters the given array of JSON-API objects to those matching the provided attributes
 * @param {Array} data Array of JSON API data
 * @param {Object} attributes The attributes and their values to match
 * @returns {Array} Array of the extracted attribute
 */
const filterByAttribute = (data, filters) => data.filter(matchesAllAttributes(filters))

/**
 * Extracts the given attribute from all JSON-API objects in the array and
 * returnthem as an array
 * @param {Array} data Array of JSON API data
 * @param {String} attribute The attribute to extract
 * @returns {Array} Array of the extracted attribute
 */
const mapAttribute = (data, attribute) => data.map(({ attributes }) => attributes[attribute])

/**
 * Helper function to store json api resource objects in the store.
 * TODO: Move this to populateBy to prevent duplication
 * @param {string} resource name of the resource to populate in the store
 * @param {bool} includeRelationships indicates if related resource ids should
 * be extracted and included in the resulting object.
 * @return {Function} A mutation function for populating the resource
 */
const populateById =
  (
    resource,
    { includeRelationships = false, populateResources = true } = {},
    replaceData = false,
  ) =>
  (state, data) => {
    // if resources then add to state.resources
    const result = populateResources ? state.resources : state

    // Store the current data so we dont overwrite it unless specifed to do so
    const before = replaceData ? {} : result[resource]
    Vue.set(result, resource, {
      ...before,
      ...dataToObjectById({ data, includeRelationships }),
    })
  }

/**
 * Helper function to store json api resource objects in the store.
 *
 * @param {string} resource name of the resource to populate in the store
 * @param {bool} includeRelationships indicates if related resource ids should
 * be extracted and included in the resulting object.
 * @return {Function} A mutation function for populating the resource
 */
const populateBy =
  (
    resource,
    fn,
    { includeRelationships = false, populateResources = true } = {},
    replaceData = false,
  ) =>
  (state, data) => {
    // if resources then add to state.resources
    const result = populateResources ? state.resources : state

    // Store the current data so we dont overwrite it unless specifed to do so
    const before = replaceData ? {} : result[resource]
    Vue.set(result, resource, {
      ...before,
      ...fn({ data, includeRelationships }),
    })
  }

export {
  extractAttributes,
  mapRelationships,
  groupIncludedByResource,
  extractRelationship,
  findIncluded,
  deserializeIncluded,
  extractRelationships,
  extractResourceObject,
  deserialize,
  dataToObjectById,
  extractRelationshipsAndGroupById,
  mapAttribute,
  filterByAttribute,
  populateById,
  dataToObjectByPosition,
  populateBy,
  extractPlateData,
}

export default deserialize
