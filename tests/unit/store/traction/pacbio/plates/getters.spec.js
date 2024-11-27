import getters from '@/store/traction/pacbio/plates/getters'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory'

const pacbioPlateFactory = PacbioPlateFactory()

describe('getters', () => {
  it('"plates" returns "state.plates"', () => {
    const state = {
      plates: pacbioPlateFactory.storeData.resources.plates,
    }
    expect(getters.plates(state)).toStrictEqual(
      Object.values(pacbioPlateFactory.storeData.resources.plates),
    )
  })
})
