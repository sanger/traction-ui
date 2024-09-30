// This library needs a review:
// - deserialize needs replacing
// - a lot of the methods can be merged as they are doing similar things

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

/**
 * Useful for grouping resources by a plate_number
 * @param {Array} data Array of JSON API data
 * @returns {Object} keys will be the plate_number for the data. This usually will be wells
 */
const dataToObjectByPlateNumber = ({ data = [], includeRelationships = false }) => {
  return data.reduce(
    (result, { id, type, attributes: { plate_number, ...rest }, relationships }) => {
      return {
        [plate_number]: {
          // we still keep the id as it will be needed
          id,
          // the type can be useful for components
          type,
          plate_number,
          ...rest,
          // we might not want to use the relationships
          ...(includeRelationships ? extractRelationshipsAndGroupById(relationships) : {}),
        },
        ...result,
      }
    },
    {},
  )
}

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

const extractResourceObject = (data, included, includeStore = {}) => {
  return Object.assign(
    extractAttributes(data),
    extractRelationships(data.relationships, included, includeStore),
  )
}

/*
  Deserialize a json-api object to bring included relationships, ids and types inline.
  @param response: {data: Object, included: Object} the object to deserialize
  DEPRECATED: use populate by methods instead
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
    result[resource] = {
      ...before,
      ...dataToObjectById({ data, includeRelationships }),
    }
  }

/**
 * Helper function to store json api resource objects in the store.
 *
 * @param {string} resource name of the resource to populate in the store
 * @param {bool} includeRelationships indicates if related resource ids should
 * be extracted and included in the resulting object.
 * @returns {Function} A mutation function for populating the resource
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
    result[resource] = {
      ...before,
      ...fn({ data, includeRelationships }),
    }
  }

/**
 * Splits the given data into an object keyed by the key of the parent
 * @param {Array} data The data to split
 * @param {Function} fn The function to populate the child data
 * @param {Boolean} includeRelationships indicates if related resource ids should be extracted and included in the resulting object.
 * @param {Array} parent The parent array includes the data, children and key to use for the resulting object
 * @returns {Array}
 */
const splitDataByParent = ({
  data,
  fn,
  includeRelationships = false,
  parent: { parentData, children, key },
}) => {
  return parentData.reduce((result, item) => {
    // Get the child ids for the given parent
    const childIds = item.relationships[children].data.map((child) => child.id)

    // Get the child records which match the child ids and then run the passed function
    const childData = fn({
      data: data.filter((record) => childIds.includes(record.id)),
      includeRelationships,
    })

    // Add the child data to the result keyed by the parent key
    result[item.attributes[key]] = childData
    return result
  }, {})
}

const find = ({ data, first = 1 } = {}) => {
  const foundData = data.data.slice(0, first)

  const included = foundData.map(({ relationships }) => {
    return extractRelationships(relationships, data.included)
  })

  return { data: foundData, included }
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
  splitDataByParent,
  dataToObjectByPlateNumber,
  find,
}

export default deserialize
