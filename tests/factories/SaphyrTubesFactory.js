import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from '../../src/api/JsonApi.js'

/*
 * Factory for creating a list of requests for Saphyr piupeline
 * @returns a base factory object with the requests data
 */
const SaphyrRequestsFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/saphyr/tubes/1',
        },
        attributes: {
          barcode: 'TRAC-1',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/tubes/1/relationships/material',
              related: 'http://localhost:3100/v1/saphyr/tubes/1/material',
            },
            data: [
              {
                type: 'requests',
                id: '1',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'requests',
        attributes: {
          external_study_id: '1',
          sample_name: 'Sample1',
          barcode: 'TRAC-1',
        },
      },
    ],
  }
  const createStoreData = (data) => {
    const requests = dataToObjectById({
      data: data.data,
      includeRelationships: true,
    })
    return {
      requests: requests['1'],
    }
  }
  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default SaphyrRequestsFactory
