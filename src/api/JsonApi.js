const extractAttributes = (data) => {
  return { id: data.id, type: data.type, ...data.attributes }
}

const mapRelationships = (relationships) => {
  if (relationships === undefined) return {}
  return Object.keys(relationships).reduce((result, name) => {
    result[name] = relationships[name].data
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

const findIncluded = (id, included) => {
  return included.find(item => item.id === id) || { attributes: {} }
}

const spreadIncluded = (relationship, included) => {
  let data = findIncluded(relationship.id, included)
  return Object.assign({ ...relationship, ...data.attributes }, extractRelationships(data.relationships, included))
}

const extractRelationships = (relationships, included) => {
  if (relationships === undefined) return {}
  let mapped = mapRelationships(relationships)
  return Object.keys(mapped).reduce((result, name) => {
    result[name] = extractRelationship(mapped[name], included)
    return result
  }, {})
}

const extractResourceObject = (data, included) => {
  return Object.assign(extractAttributes(data), extractRelationships(data.relationships, included))
}

export { 
  extractAttributes, 
  mapRelationships,
  extractRelationship,
  findIncluded,
  spreadIncluded,
  extractRelationships,
  extractResourceObject
}