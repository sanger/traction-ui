import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from '../../src/api/JsonApi.js'
/*
 * Factory for creating a instruments
 * @returns a base factory object with the instruments data
 */
const OntInstrumentsFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'instruments',
        links: {
          self: 'http://127.0.0.1:3100/v1/ont/instruments/1',
        },
        attributes: {
          name: 'GXB02004',
          instrument_type: 'GridION',
          max_number_of_flowcells: 5,
        },
      },
      {
        id: '2',
        type: 'instruments',
        links: {
          self: 'http://127.0.0.1:3100/v1/ont/instruments/2',
        },
        attributes: {
          name: 'PC24B148',
          instrument_type: 'PromethION',
          max_number_of_flowcells: 24,
        },
      },
    ],
  }

  const createStoreData = (data) => {
    const instruments = dataToObjectById({
      data: data.data,
      includeRelationships: false,
    })
    return {
      instruments,
    }
  }

  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default OntInstrumentsFactory
