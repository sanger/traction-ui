import Response from '@/api/Response'
import { Data } from '../../../../testHelper'
import mutations from '@/store/traction/pacbio/requests/mutations'

let requests

describe('mutations', () => {
    beforeEach(() => {
        requests = new Response(Data.TractionPacbioSamples).deserialize.requests
    })

    it('"setRequests" sets "state.requests" to the given requests', () => {
        const state = {
            requests: []
        }
        mutations.setRequests(state, requests)
        expect(state.requests).toEqual(requests)
    })

    it('"setLibraryType" sets the requests "library_type" to the given libraryType', () => {
        const state = {
            requests: requests
        }
        mutations.setLibraryType(state, { requestId: requests[0].id, libraryType: 'type' })
        expect(state.requests[0].library_type).toEqual('type')
    })

    it('"setEstimateOfGBRequired" sets the requests "estimate_of_gb_required" to the given estimateOfGBRequired', () => {
        const state = {
            requests: requests
        }
        mutations.setEstimateOfGBRequired(state, { requestId: requests[0].id, estimateOfGBRequired: '123' })
        expect(state.requests[0].estimate_of_gb_required).toEqual('123')
    })

    it('"setNumberOfSMRTCells" sets the requests "number_of_smrt_cells" to the given numberOfSMRTCells', () => {
        const state = {
            requests: requests
        }
        mutations.setNumberOfSMRTCells(state, { requestId: requests[0].id, numberOfSMRTCells: '123' })
        expect(state.requests[0].number_of_smrt_cells).toEqual('123')
    })

    it('"setCostCode" sets the requests "cost_code" to the given costCode', () => {
        const state = {
            requests: requests
        }
        mutations.setCostCode(state, { requestId: requests[0].id, costCode: 'ABC123' })
        expect(state.requests[0].cost_code).toEqual('ABC123')
    })

})

