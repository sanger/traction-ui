import Response from '@/api/Response'
import { Data } from '../../../testHelper'
import getters from '@/store/sequencescape/plates/getters'

let sequencescapePlates

describe('getters', () => {
    beforeEach(() => {
      sequencescapePlates = new Response(Data.sequencescapePlates).deserialize.plates
    })

    it('"sequencescapePlates" returns "state.sequencescapePlates"', () => {
        const state = {
          sequencescapePlates: sequencescapePlates
        }
        expect(getters.sequencescapePlates(state)).toBe(sequencescapePlates)
    })
})