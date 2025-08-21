import BaseFactory from './BaseFactory.js'
import { extractAttributes } from './../../src/api/JsonApi.js'
import { groupByAttribute } from './../../src/stores/utilities/root.js'

const DataTypeFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'data_types',
        links: { self: 'http://localhost:3100/v1/data_types/1' },
        attributes: {
          name: 'basecalls',
          pipeline: 'ont',
          created_at: '2024-11-19T10:09:21.350Z',
          updated_at: '2024-11-19T10:09:21.350Z',
        },
      },
      {
        id: '2',
        type: 'data_types',
        links: { self: 'http://localhost:3100/v1/data_types/2' },
        attributes: {
          name: 'basecalls and raw data',
          pipeline: 'ont',
          created_at: '2024-11-19T10:09:21.352Z',
          updated_at: '2024-11-19T10:09:21.352Z',
        },
      },
    ],
    meta: { page_count: null },
  }

  return {
    ...BaseFactory(data),
    storeData: groupByAttribute({ data: data.data, key: 'pipeline', fn: extractAttributes }),
  }
}

export default DataTypeFactory
