import Response from '@/api/Response'
import { Data } from '../../../../testHelper'
import getters from '@/store/traction/pacbio/requests/getters'

let requests

describe('getters', () => {
    beforeEach(() => {
        requests = new Response(Data.TractionPacbioSamples).deserialize.requests
    })

    it('"requests" returns "state.requests"', () => {
        const state = {
            requests: requests
        }
        expect(getters.requests(state)).toBe(requests)
    })
})