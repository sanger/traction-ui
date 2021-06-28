// TODO: This needs a refactor with some documentation
const extractAttributes = (data) => {
  return { id: data.id, type: data.type, ...data.attributes }
}

const mapRelationships = (relationships) => {
  if (relationships === undefined) return {}
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
    if (group[resource.type] === undefined) { group[resource.type] = [] }
    group[resource.type].push(resource)
    return group
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
}

export default deserialize
