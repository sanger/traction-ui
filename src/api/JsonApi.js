const extractAttributes = (data) => {
  return { id: data.id, ...data.attributes }
}

const extractRelationships = (data) => {
  return Object.keys(data.relationships).map(relationship => data.relationships[relationship].data)
}

const extractIncludedData = (relationships, included) => {
  return relationships.map(relationship => {
    if (Array.isArray(relationship)) {
      return extractIncludedData(relationship, included)
    } else {
      let found = included.find(item => item.id === relationship.id)
      return found !== undefined ? extractAttributes(found) : found
    }
  }).filter(item => item !== undefined)
}

const findRelationship = (id, relationships) => {
  return relationships.find(relationship => {
    if (Array.isArray(relationship)) {
      return findRelationship(id, relationship)
    } else {
      return relationship.id === id
    }
  })
}

const findRelationshipType = (id, relationships) => {
  let relationship = findRelationship(id, relationships) 
  if (relationship === undefined) return
  return Array.isArray(relationship) ? relationship[0].type : relationship.type
}

const reduceIncludedData = (relationships, extracted) => {
  return extracted.reduce((result, currentValue) => {
    let type = findRelationshipType( Array.isArray(currentValue) ? currentValue[0].id : currentValue.id, relationships)
    result[type] = currentValue
    return result
  }, {})
}

const extractResourceObject = (data, included) => {
  let attributes = extractAttributes(data)
  let relationships = extractRelationships(data)
  let includedData = reduceIncludedData(relationships, extractIncludedData(relationships, included))
  return { ...attributes, ...includedData}
}

export { 
  extractAttributes, 
  extractRelationships, 
  extractIncludedData,
  findRelationship,
  findRelationshipType,
  reduceIncludedData,
  extractResourceObject
}