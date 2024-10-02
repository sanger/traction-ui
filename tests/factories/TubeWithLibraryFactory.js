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
        id: '21',
        type: 'tubes',
        links: {
          self: 'http://localhost:3000/v1/saphyr/tubes/21',
        },
        attributes: {
          barcode: 'TRAC-2-21',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3000/v1/saphyr/tubes/21/relationships/materials',
              related: 'http://localhost:3000/v1/saphyr/tubes/21/materials',
            },
            data: [
              {
                type: 'container_materials',
                id: '21',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '21',
        type: 'container_materials',
        attributes: {
          state: 'pending',
          enzyme_name: 'Nb.BsrDI',
          deactivated_at: null,
          barcode: 'TRAC-2-21',
          created_at: '2020/05/04 13:26',
          sample_name: 'Sample1',
          material_type: 'library',
          material_id: '1',
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
      requests: requests['21'],
    }
  }
  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default SaphyrRequestsFactory
