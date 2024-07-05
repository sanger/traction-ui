import getters from '@/store/traction/pacbio/plates/getters'
import PacbioPlatesRequestFactory from '@tests/factories/PacbioPlatesRequestFactory'

const pacbioPlatesRequestFactory = PacbioPlatesRequestFactory()

describe('getters', () => {
  it('"plates" returns "state.plates"', () => {
    const state = {
      plates: pacbioPlatesRequestFactory.storeData,
    }
    expect(getters.plates(state)).toStrictEqual(Object.values(pacbioPlatesRequestFactory.storeData))
  })
})
