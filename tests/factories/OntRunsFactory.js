import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from '../../src/api/JsonApi.js'
/**
 * Factory for creating ONT runs data.
 *
 * @returns {Object} An object containing the base factory data, find data, and store data.
 */
const OntRunsFactory = () => {
  const findRun = {
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
      flowcells: {
        links: {
          self: 'http://127.0.0.1:3100/v1/ont/runs/1/relationships/flowcells',
          related: 'http://127.0.0.1:3100/v1/ont/runs/1/flowcells',
        },
      },
    },
  }
  const data = {
    data: [
      { ...findRun },
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
    meta: {
      page_count: 1,
    },
  }

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
      validRun: {
        id: 1,
        instrument_name: 'GXB02004',
        state: 'pending',
        flowcell_attributes: [{ tube_barcode: 'TRAC-A-1' }],
      },
      newRun: {
        id: 'new',
        instrument_name: null,
        state: null,
        flowcell_attributes: [],
      },
      findRun: {
        flowcell_attributes: [],
        id: '1',
        state: 'pending',
        instrument_name: 'GXB02004',
      },
    }
  }

  return {
    ...BaseFactory(data),
    findData: BaseFactory({ data: { ...findRun } }),
    storeData: createStoreData(data),
  }
}

export default OntRunsFactory
