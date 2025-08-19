import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from './../../src/api/JsonApi.js'

const storeData = (data) => {
  const requests = dataToObjectById(data)
  return {
    resources: requests,
    ids: Object.keys(requests),
  }
}

const OntRequestFactory = () => {
  const data = {
    data: [
      {
        id: '102',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/102',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10000',
          external_study_id: '50ad20f6-2722-434e-b42b-83cec34147f7',
          number_of_flowcells: 1,
          created_at: '2022/07/26 15:01',
          sample_name: 'sample_name_1',
          source_identifier: 'TRAC-1:A1',
          sample_retention_instruction: 'return_to_customer_after_2_years',
        },
      },
      {
        id: '103',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/103',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10001',
          external_study_id: '170ef408-bb98-4617-95cd-b65ba6882843',
          number_of_flowcells: 1,
          created_at: '2022/07/26 15:01',
          sample_name: 'sample_name_2',
          source_identifier: 'TRAC-2:A1',
          sample_retention_instruction: 'return_to_customer_after_2_years',
        },
      },
      {
        id: '104',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/104',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10002',
          external_study_id: '494adee4-cdea-4cf3-927e-ccb3d269cd9a',
          number_of_flowcells: 1,
          created_at: '2022/07/26 15:01',
          sample_name: 'sample_name_3',
          source_identifier: 'TRAC-3:A1',
        },
      },
      {
        id: '105',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/105',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10003',
          external_study_id: '3a87ab1f-7a4b-4028-a4f7-250418c3c0fc',
          number_of_flowcells: 1,
          created_at: '2022/07/26 15:01',
          sample_name: 'sample_name_4',
          source_identifier: 'TRAC-4:A1',
          sample_retention_instruction: 'return_to_customer_after_2_years',
        },
      },
      {
        id: '106',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/106',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10004',
          external_study_id: '4dcef3a6-1bf7-40b5-a899-1568dbf58dca',
          number_of_flowcells: 1,
          created_at: '2022/07/26 15:01',
          sample_name: 'sample_name_5',
          source_identifier: 'TRAC-5:A1',
          sample_retention_instruction: null,
        },
      },
    ],
  }

  return { ...BaseFactory(data), storeData: storeData(data) }
}

export default OntRequestFactory
