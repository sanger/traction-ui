import Response from '@/api/Response'
import { Data } from '../../../testHelper'
import getters from '@/store/sequencescape/plates/getters'

let plates

describe('getters', () => {
    beforeEach(() => {
      plates = new Response(Data.sequencescapePlates).deserialize.plates
    })

    it('"sequencescapePlates" returns "state.sequencescapePlates"', () => {
        const state = {
          plates: plates
        }
        expect(getters.plates(state)).toBe(plates)
    })
})