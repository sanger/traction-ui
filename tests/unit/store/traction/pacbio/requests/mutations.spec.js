import mutations from '@/store/traction/pacbio/requests/mutations'
import { dataToObjectById } from '@/api/JsonApi'
import PacbioRequestsFactory from '@tests/factories/PacbioRequestsFactory.js'

const pacbioRequestsFactory = PacbioRequestsFactory()

describe('mutations', () => {
  it('"setRequests" sets "state.requests" to the given requests', () => {
    const requests = pacbioRequestsFactory.content.data
    const state = {
      requests: {},
    }
    mutations.setRequests(state, requests)
    expect(state.requests).toEqual(
      dataToObjectById({ data: requests, includeRelationships: false }),
    )
  })

  it('"updateRequest" updates "state.requests" to the include the updated request', () => {
    const requests = pacbioRequestsFactory.content.data
    const state = {
      requests: dataToObjectById({ data: requests, includeRelationships: false }),
    }
    const updatedRequest = {
      id: '40',
      type: 'requests',
      attributes: {
        library_type: 'updated lib type',
        estimate_of_gb_required: 3,
        number_of_smrt_cells: 5,
        cost_code: null,
        external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
        sample_name: 'sample_DN814327C_A1',
        barcode: null,
        sample_species: 'update species',
        created_at: '2021/06/03 06:59',
        source_identifier: 'DN814327C:A1',
      },
    }
    const expectedRequests = [...requests]
    expectedRequests[0] = updatedRequest

    mutations.updateRequest(state, updatedRequest)

    expect(state.requests).toEqual(
      dataToObjectById({ data: expectedRequests, includeRelationships: false }),
    )
  })
})
