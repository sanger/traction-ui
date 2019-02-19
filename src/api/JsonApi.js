const extractAttributes = (data) => {
  return { id: data.id, type: data.type, ...data.attributes }
}

const mapRelationships = (relationships) => {
  if (relationships === undefined) return {}
  return Object.keys(relationships).reduce((result, name) => {
    if (Boolean(relationships[name].data)) {
      result[name] = relationships[name].data
    }
    return result
  }, {})
}

const extractRelationship = (relationship, included) => {
  if (Array.isArray(relationship)) {
    return relationship.map(item => spreadIncluded(item, included))
  } else {
    return spreadIncluded(relationship, included)
  }
}

const findIncluded = (relationship, included) => {
  return included.find(item => item.id === relationship.id && item.type === relationship.type) || { attributes: {} }
}

const spreadIncluded = (relationship, included) => {
  const data = findIncluded(relationship, included)
  return Object.assign({ ...relationship, ...data.attributes }, extractRelationships(data.relationships, included))
}

const extractRelationships = (relationships, included) => {
  if (relationships === undefined) return {}
  const mapped = mapRelationships(relationships)
  return Object.keys(mapped).reduce((result, name) => {
    result[name] = extractRelationship(mapped[name], included)
    return result
  }, {})
}

const extractResourceObject = (data, included) => {
  return Object.assign(extractAttributes(data), extractRelationships(data.relationships, included))
}

const deserialize = (response) => {

  const included = response.included

  if (Array.isArray(response.data)) {
    return response.data.reduce((result, item) => {
      const resourceObject = extractResourceObject(item, included)
      const type = resourceObject.type
      if (result.hasOwnProperty(type)) {
        result[type].push(resourceObject)
      } else {
        result[type] = [resourceObject]
      }
      return result
    }, {})
  } else {
    return extractResourceObject(response.data, included)
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
  deserialize
}

export default deserialize