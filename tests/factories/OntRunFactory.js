import BaseFactory from './BaseFactory.js'
/**
 * Factory for creating ONT run data.
 *
 * @returns {Object} An object containing the base factory data, find data, and store data.
 */
const OntRunFactory = () => {
  const data = {
    data: {
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
    included: [
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
  }

  return {
    ...BaseFactory(data),
  }
}

export default OntRunFactory
