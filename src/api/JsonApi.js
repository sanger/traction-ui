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

const extractRelationship = (relationship, included, includeStore = {}) => {
  if (Array.isArray(relationship)) {
    return relationship.map((item) => spreadIncluded(item, included, includeStore))
  } else {
    return spreadIncluded(relationship, included, includeStore)
  }
}

const findIncluded = (relationship, included) => {
  return (
    included.find((item) => item.id === relationship.id && item.type === relationship.type) || {
      attributes: {},
    }
  )
}

const spreadIncluded = (relationship, included, includeStore = {}) => {
  const cacheKey = `${relationship.type}:${relationship.id}`

  if (includeStore[cacheKey]) { return includeStore[cacheKey] }

  const data = findIncluded(relationship, included)
  const serialized = { ...relationship, ...data.attributes }
  includeStore[cacheKey] = serialized
  return includeStore[cacheKey] = Object.assign(
    serialized,
    extractRelationships(data.relationships, included, includeStore),
  )
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
  return Object.assign(extractAttributes(data), extractRelationships(data.relationships, included, includeStore))
}

/*
  Deserialize a json-api object to bring included relationships inline.
  @param response: {data: Object, included: Object} the object to deserialize
*/
const deserialize = (response, includeStore = {}) => {
  const included = response.included

  if (Array.isArray(response.data)) {
    return response.data.reduce((result, item) => {
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
    const resourceObject = extractResourceObject(response.data, included, includeStore)
    return { [resourceObject.type]: [resourceObject] }
  }
}

export {
  extractAttributes,
  mapRelationships,
  extractRelationship,
  findIncluded,
  spreadIncluded,
  extractRelationships,
  extractResourceObject,
  deserialize,
}

export default deserialize
