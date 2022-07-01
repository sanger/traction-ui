import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/pacbio/plates/getters'

let plates

describe('getters', () => {
  beforeEach(() => {
    plates = new Response(Data.PacbioPlates).deserialize.plates
  })

  it('"plates" returns "state.plates"', () => {
    const state = {
      plates: plates,
    }
    expect(getters.plates(state)).toBe(plates)
  })
})
