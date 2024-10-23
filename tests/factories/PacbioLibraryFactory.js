import BaseFactory from './BaseFactory.js'
import { groupIncludedByResource, dataToObjectById } from '../../src/api/JsonApi.js'

/**
 * @function createStoreData
 * @param {Object} data - The JSON API response data object.
 * @returns {Object} An object with the libraries, tubes, tags, and requests data.
 * @description A function that creates an object with the libraries, tubes, tags, and requests data.
 */
const createStoreData = ({ data, included }) => {
  const { tubes, tags, requests } = groupIncludedByResource(included)
  const libraries = dataToObjectById({ data, includeRelationships: true })

  return {
    libraries,
    tubes: dataToObjectById({ data: tubes }),
    tags: dataToObjectById({ data: tags }),
    requests: dataToObjectById({ data: requests }),
  }
}

/**
 * @function createLibrariesArray
 * @param {Object} storeData - libraries, tubes, tags, requests
 * @returns {Array} An array of libraries with sample_name, barcode, and group_id.
 * @description A function that creates an array of libraries with sample_name, barcode, and group_id.
 * This is verbatim repeating what is in the store, but it is useful to have a function that
 * does this for testing purposes. It can be used for refactoring and eventually removing the function
 */
const createLibrariesArray = ({ libraries, tubes, tags, requests }) => {
  return Object.values(libraries).map((library) => {
    const { request, tag, ...attributes } = library
    const { sample_name } = requests[request]
    const { barcode } = tubes[library.tube]
    const { group_id } = tags[tag]

    return {
      ...attributes,
      sample_name,
      barcode,
      tag_group_id: group_id,
      tag_id: tag,
    }
  })
}

/*
 * Factory for creating a pacbio library
 * @returns a base factory object with the libraries data
 */
const PacbioLibraryFactory = (relationships = true) => {
  const data = {
    data: [
      {
        id: '1',
        type: 'libraries',
        attributes: {
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '09/23/2019 11:18',
          source_identifier: 'DN1:A1',
        },
        relationships: {
          request: {
            data: {
              type: 'requests',
              id: '1',
            },
          },
          tag: {
            data: {
              type: 'tags',
              id: '3',
            },
          },
          tube: {
            data: {
              type: 'tubes',
              id: '4',
            },
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'requests',
        attributes: {
          sample_name: '4616STDY7535900',
        },
      },
      {
        id: '4',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-721',
        },
      },
      {
        id: '3',
        type: 'tags',
        attributes: {
          group_id: '1234',
        },
      },
    ],
  }

  if (relationships) {
    const storeData = createStoreData(data)
    const librariesArray = createLibrariesArray(storeData)
    return { ...BaseFactory(data), storeData, librariesArray }
  } else {
    const dataWithoutRelationships = data.data.map(({ id, type, attributes }) => ({
      id,
      type,
      attributes,
    }))
    const foundData = { data: dataWithoutRelationships, included: [] }
    const storeData = createStoreData(foundData)
    return { ...BaseFactory(foundData), storeData }
  }
}

export default PacbioLibraryFactory
