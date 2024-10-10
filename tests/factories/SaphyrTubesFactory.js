import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from '@/api/JsonApi.js'

const createStoreData = (data) => {
  const mappedData = dataToObjectById({ data: data.data, includeRelationships: true })
  return { data: mappedData, dataArray: Object.values(mappedData) }
}

/**
 * Factory for creating a Saphyr Pipeline Run
 * @returns a base factory object with the run data
 * store data object is for simulating the stored data in tests
 */
const SaphyrTubesFactory = (type) => {
  let data = { data: [] }
  if (type === 'request') {
    data = {
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
  } else if (type === 'library') {
    data = {
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
  }

  return {
    ...BaseFactory(data),
    storeData: createStoreData({ ...data }),
  }
}

export default SaphyrTubesFactory
