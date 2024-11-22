import BaseFactory from './BaseFactory.js'
import { dataToObjectById, find } from '../../src/api/JsonApi.js'

/**
 * Creates store data from the provided data.
 *
 * @param {Object} data - The data to be processed.
 * @returns {Object} An object containing the runs, runsArray, validRun, newRun, and findRun.
 */
const createStoreData = (data) => {
  const runs = dataToObjectById({
    data: data.data,
    includeRelationships: true,
  })
  return {
    runs,
    runsArray: Object.values(runs),
  }
}

/**
 *
 * @param {Object} data
 * @param {String | null} findBy - 'libraries' | 'pools'
 * @returns {Object} - { ...BaseFactory, storeData }
 * if the findBy is libraries or pools find a single record by libraries or pools
 * otherwise return the data as is.
 * This is a bit messy but it will do for now.
 */
const getData = (data, findBy, count) => {
  let countVal = findBy ? 1 : count
  const index =
    findBy === 'flowcells' ? data.data.findIndex((item) => item.relationships.flowcells?.data) : 0

  if (index !== null) {
    // we need to includeAll as the requests for pools are in the libraries and I think
    // pulled out as used_by in the aliquots
    const foundData = find({ data, start: index, count: countVal, get: true, includeAll: true })
    return { ...BaseFactory(foundData), storeData: createStoreData(foundData), formattedOntRun }
  } else {
    return { ...BaseFactory(data), storeData: createStoreData(data), formattedOntRun }
  }
}

const formattedOntRun = (instruments, pools, fetchResponse) => {
  const { data, included = [] } = fetchResponse
  const instrument_name = instruments.find(
    (i) => i.id == data[0].attributes.ont_instrument_id,
  )?.name

  return {
    id: data[0].id,
    instrument_name: instrument_name,
    state: data[0].attributes.state,
    flowcell_attributes: included.map((fc) => {
      const tube_barcode = pools.find((p) => p.id == fc.attributes.ont_pool_id)?.tube_barcode
      return {
        flowcell_id: fc.attributes.flowcell_id,
        ont_pool_id: fc.attributes.ont_pool_id,
        position: fc.attributes.position,
        tube_barcode: tube_barcode,
      }
    }),
  }
}

/**
 * Factory for creating ONT runs data.
 *
 * @returns {Object} An object containing the base factory data, find data, and store data.
 */

const OntRunFactory = ({ count = undefined, findBy = null } = {}) => {
  const data = {
    data: [
      {
        id: '1',
        type: 'runs',
        links: {
          self: 'http://127.0.0.1:3100/v1/ont/runs/1',
        },
        attributes: {
          experiment_name: 'ONTRUN-1',
          state: 'pending',
          created_at: '2023-01-11T15:45:25.034Z',
          ont_instrument_id: 1,
        },
        relationships: {
          instrument: {
            links: {
              self: 'http://127.0.0.1:3100/v1/ont/runs/1/relationships/instrument',
              related: 'http://127.0.0.1:3100/v1/ont/runs/1/instrument',
            },
            data: {
              type: 'instruments',
              id: '1',
            },
          },
        },
      },
      {
        id: '2',
        type: 'runs',
        links: {
          self: 'http://127.0.0.1:3100/v1/ont/runs/2',
        },
        attributes: {
          experiment_name: 'ONTRUN-2',
          state: 'started',
          created_at: '2023-01-11T15:51:13.691Z',
          ont_instrument_id: 2,
        },
        relationships: {
          instrument: {
            links: {
              self: 'http://127.0.0.1:3100/v1/ont/runs/2/relationships/instrument',
              related: 'http://127.0.0.1:3100/v1/ont/runs/2/instrument',
            },
            data: {
              type: 'instruments',
              id: '1',
            },
          },
          flowcells: {
            links: {
              self: 'http://127.0.0.1:3100/v1/ont/runs/2/relationships/flowcells',
              related: 'http://127.0.0.1:3100/v1/ont/runs/2/flowcells',
            },
            data: {
              type: 'flowcells',
              id: '3',
            },
          },
        },
      },
    ],
    included: [
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
          ont_pool_id: 1,
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
          ont_pool_id: 2,
        },
      },
      {
        id: '3',
        type: 'flowcells',
        attributes: {
          position: 1,
          flowcell_id: 'ABC1234',
          ont_pool_id: 7,
        },
      },
    ],
    meta: {
      page_count: 1,
    },
  }

  return getData(data, findBy, count)
}

export default OntRunFactory
