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
const SaphyrLibraryFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-11',
          sample_name: 'Sample1',
          enzyme_name: 'Nb.BbvCI',
          created_at: '08/14/2019 10:05',
          deactivated_at: '08/19/2019 02:12',
        },
      },
      {
        id: '2',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-12',
          sample_name: 'Sample2',
          enzyme_name: 'Nb.BsmI',
          created_at: '08/14/2019 10:05',
          deactivated_at: null,
        },
      },
      {
        id: '3',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-13',
          sample_name: 'Sample3',
          enzyme_name: 'Nb.BsrDI',
          created_at: '08/14/2019 10:05',
          deactivated_at: null,
        },
      },
      {
        id: '4',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-14',
          sample_name: 'Sample4',
          enzyme_name: 'Nt.BspQI',
          created_at: '08/14/2019 10:05',
          deactivated_at: null,
        },
      },
      {
        id: '5',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-15',
          sample_name: 'Sample5',
          enzyme_name: 'Nb.BssSI',
          created_at: '08/14/2019 10:05',
          deactivated_at: null,
        },
      },
      {
        id: '6',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-16',
          sample_name: 'Sample1',
          enzyme_name: 'DLE-1',
          created_at: '08/14/2019 10:05',
          deactivated_at: null,
        },
      },
      {
        id: '7',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-17',
          sample_name: 'Sample1',
          enzyme_name: 'Nb.BsmI',
          created_at: '08/14/2019 10:19',
          deactivated_at: null,
        },
      },
      {
        id: '8',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-18',
          sample_name: 'Sample1',
          enzyme_name: 'Nb.BbvCI',
          created_at: '08/14/2019 10:42',
          deactivated_at: null,
        },
      },
      {
        id: '9',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-19',
          sample_name: 'Sample1',
          enzyme_name: 'Nb.BsmI',
          created_at: '08/14/2019 01:31',
          deactivated_at: null,
        },
      },
      {
        id: '10',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-20',
          sample_name: 'Sample2',
          enzyme_name: 'Nb.BssSI',
          created_at: '08/14/2019 01:31',
          deactivated_at: null,
        },
      },
      {
        id: '11',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-21',
          sample_name: 'Sample3',
          enzyme_name: 'Nb.BssSI',
          created_at: '08/14/2019 01:32',
          deactivated_at: null,
        },
      },
      {
        id: '12',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-22',
          sample_name: 'Sample1',
          enzyme_name: 'Nb.BbvCI',
          created_at: '08/20/2019 02:18',
          deactivated_at: null,
        },
      },
      {
        id: '13',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-23',
          sample_name: 'Sample1',
          enzyme_name: 'Nb.BbvCI',
          created_at: '08/20/2019 02:26',
          deactivated_at: null,
        },
      },
      {
        id: '14',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-24',
          sample_name: 'Sample3',
          enzyme_name: 'Nb.BbvCI',
          created_at: '08/20/2019 02:26',
          deactivated_at: null,
        },
      },
      {
        id: '15',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-25',
          sample_name: 'Sample5',
          enzyme_name: 'Nb.BsrDI',
          created_at: '08/20/2019 02:28',
          deactivated_at: null,
        },
      },
      {
        id: '16',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-26',
          sample_name: 'Sample4',
          enzyme_name: 'Nb.BsmI',
          created_at: '08/20/2019 02:31',
          deactivated_at: null,
        },
      },
      {
        id: '17',
        type: 'libraries',
        attributes: {
          state: 'pending',
          barcode: 'TRAC-27',
          sample_name: 'Sample1',
          enzyme_name: 'Nb.BbvCI',
          created_at: '08/22/2019 09:52',
          deactivated_at: null,
        },
      },
    ],
  }
  return {
    ...BaseFactory(data),
    storeData: createStoreData({ ...data }),
  }
}

export default SaphyrLibraryFactory
