import BaseFactory from './BaseFactory.js'
import { groupIncludedByResource, find } from './../../src/api/JsonApi'

const createStoreData = (included) => {
  const { requests } = groupIncludedByResource(included)
  return { requests }
}

const OntTubeFactory = ({ all = true, first = null } = {}) => {
  const data = {
    data: [
      {
        id: '1',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/1',
        },
        attributes: {
          barcode: 'GEN-1668092750-3',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/1/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/1/pools',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/1/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/1/requests',
            },
            data: [
              {
                type: 'requests',
                id: '191',
              },
            ],
          },
        },
      },
      {
        id: '2',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/2',
        },
        attributes: {
          barcode: 'GEN-1668092750-4',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/2/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/2/pools',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/2/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/2/requests',
            },
            data: [
              {
                type: 'requests',
                id: '192',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '192',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/192',
        },
        attributes: {
          library_type: 'ONT_PromethIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10191',
          external_study_id: 'a7b7ec2c-bf5e-4ce8-96da-d7fecdfcd3dd',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-192',
          source_identifier: 'GEN-1668092750-4',
          created_at: '2022/11/10 15:05',
        },
      },
      {
        id: '191',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/191',
        },
        attributes: {
          library_type: 'ONT_PromethIon',
          data_type: 'basecalls',
          cost_code: 'S10190',
          external_study_id: 'ae4e17b4-d2b5-4754-897b-f89410deaf38',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-191',
          source_identifier: 'GEN-1668092750-3',
          created_at: '2022/11/10 15:05',
        },
      },
    ],
  }

  // if first is completed find the data otherwise return all data
  const foundData = all ? data : find({ data, all, first, get: true })

  return { ...BaseFactory(foundData), storeData: createStoreData(foundData.included) }
}

export default OntTubeFactory
