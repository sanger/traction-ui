/**
 * In order to ensure we set up consistent expectations in our unit tests, we
 * are setting up shared 'contracts'.
 * There's a bit of a mix of derived values and being explicit here.
 * TODO: This should be removed when we move to factories.
 */

import { Data } from '@support/testHelper'

const populateRequestsParameters = Data.TractionOntRequests.data.data
const storeData = {
  102: {
    id: '102',
    type: 'requests',
    library_type: 'ONT_GridIon',
    data_type: 'basecalls',
    cost_code: 'S10000',
    external_study_id: '50ad20f6-2722-434e-b42b-83cec34147f7',
    number_of_flowcells: 1,
    created_at: '2022/07/26 15:01',
  },
  103: {
    id: '103',
    type: 'requests',
    library_type: 'ONT_GridIon',
    data_type: 'basecalls',
    cost_code: 'S10001',
    external_study_id: '170ef408-bb98-4617-95cd-b65ba6882843',
    number_of_flowcells: 1,
    created_at: '2022/07/26 15:01',
  },
  104: {
    id: '104',
    type: 'requests',
    library_type: 'ONT_GridIon',
    data_type: 'basecalls',
    cost_code: 'S10002',
    external_study_id: '494adee4-cdea-4cf3-927e-ccb3d269cd9a',
    number_of_flowcells: 1,
    created_at: '2022/07/26 15:01',
  },
  105: {
    id: '105',
    type: 'requests',
    library_type: 'ONT_GridIon',
    data_type: 'basecalls',
    cost_code: 'S10003',
    external_study_id: '3a87ab1f-7a4b-4028-a4f7-250418c3c0fc',
    number_of_flowcells: 1,
    created_at: '2022/07/26 15:01',
  },
  106: {
    id: '106',
    type: 'requests',
    library_type: 'ONT_GridIon',
    data_type: 'basecalls',
    cost_code: 'S10004',
    external_study_id: '4dcef3a6-1bf7-40b5-a899-1568dbf58dca',
    number_of_flowcells: 1,
    created_at: '2022/07/26 15:01',
  },
}

export default {
  requests: {
    populateRequestsParameters,
    storeData,
    getterRequestReturn: Object.values(storeData),
  },
}
