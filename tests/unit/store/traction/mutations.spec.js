import Response from '@/api/Response'
import { Data } from '../../testHelper'
import mutations from '@/store/traction/mutations'

let tractionTags

describe('mutations', () => {
    beforeEach(() => {
        tractionTags = new Response(Data.TractionTags).deserialize.tractionTags
    })

    it('"setTags" sets "state.tractionTags" to the given tags', () => {
        const state = {
            tractionTags: []
        }
        mutations.setTags(state, tractionTags)
        expect(state.tractionTags).toEqual(tractionTags)
    })
})