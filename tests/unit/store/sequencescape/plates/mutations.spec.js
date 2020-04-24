import Response from '@/api/Response'
import { Data } from '../../../testHelper'
import mutations from '@/store/sequencescape/plates/mutations'

let plates

describe('mutations', () => {
    beforeEach(() => {
        plates = new Response(Data.SequencescapePlates).deserialize.requests
    })

    it('"setPlates" sets "state.plates" to the given plates', () => {
        const state = {
            plates: []
        }
        mutations.setPlates(state, plates)
        expect(state.plates).toEqual(plates)
    })

})

