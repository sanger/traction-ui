import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from '../../src/api/JsonApi.js'

/*
 * Factory for creating a list of requests for Saphyr piupeline
 * @returns a base factory object with the requests data
 */
const SaphyrRequestFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'requests',
        attributes: {
          external_study_id: '1',
          sample_name: 'Sample1',
          barcode: 'TRAC-1',
          sample_species: 'Species1',
          created_at: '08/14/2019 10:04',
        },
      },
      {
        id: '2',
        type: 'requests',
        attributes: {
          external_study_id: '2',
          sample_name: 'Sample2',
          barcode: 'TRAC-2',
          sample_species: 'Species2',
          created_at: '08/14/2019 10:04',
        },
      },
      {
        id: '3',
        type: 'requests',
        attributes: {
          external_study_id: '3',
          sample_name: 'Sample3',
          barcode: 'TRAC-3',
          sample_species: 'Species3',
          created_at: '08/14/2019 10:04',
        },
      },
      {
        id: '4',
        type: 'requests',
        attributes: {
          external_study_id: '4',
          sample_name: 'Sample4',
          barcode: 'TRAC-4',
          sample_species: 'Species4',
          created_at: '08/14/2019 10:04',
        },
      },
      {
        id: '5',
        type: 'requests',
        attributes: {
          external_study_id: '5',
          sample_name: 'Sample5',
          barcode: 'TRAC-5',
          sample_species: 'Species5',
          created_at: '08/14/2019 10:04',
        },
      },
      {
        id: '6',
        type: 'requests',
        attributes: {
          external_study_id: '1',
          sample_name: 'Sample1',
          barcode: 'TRAC-6',
          sample_species: 'Species1',
          created_at: '08/14/2019 10:05',
        },
      },
      {
        id: '7',
        type: 'requests',
        attributes: {
          external_study_id: '2',
          sample_name: 'Sample2',
          barcode: 'TRAC-7',
          sample_species: 'Species2',
          created_at: '08/14/2019 10:05',
        },
      },
      {
        id: '8',
        type: 'requests',
        attributes: {
          external_study_id: '3',
          sample_name: 'Sample3',
          barcode: 'TRAC-8',
          sample_species: 'Species3',
          created_at: '08/14/2019 10:05',
        },
      },
      {
        id: '9',
        type: 'requests',
        attributes: {
          external_study_id: '4',
          sample_name: 'Sample4',
          barcode: 'TRAC-9',
          sample_species: 'Species4',
          created_at: '08/14/2019 10:05',
        },
      },
      {
        id: '10',
        type: 'requests',
        attributes: {
          external_study_id: '5',
          sample_name: 'Sample5',
          barcode: 'TRAC-10',
          sample_species: 'Species5',
          created_at: '08/14/2019 10:05',
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
      requests,
    }
  }
  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default SaphyrRequestFactory
