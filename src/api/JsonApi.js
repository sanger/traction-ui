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
    // it could be undefined, it could be null or it could be an object
    // lets just make it all the same
    const data = relationships[type].data
    if (data instanceof Array) {
      result[type] = data.map(({ id }) => id)
    } else {
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
*/
const deserialize = ({ data, included }, includeStore = {}) => {
  if (Array.isArray(data)) {
    return data.reduce((result, item) => {
      const resourceObject = extractResourceObject(item, included, includeStore)
      const type = resourceObject.type
      if (result.hasOwnProperty(type)) {
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
}

export default deserialize
