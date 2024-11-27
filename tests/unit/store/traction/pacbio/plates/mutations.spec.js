import mutations from '@/store/traction/pacbio/plates/mutations'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory'

const pacbioPlateFactory = PacbioPlateFactory()

describe('mutations', () => {
  it('"setPlates" sets "state.plates" to the given plates', () => {
    const state = {
      plates: {},
    }
    mutations.setPlates(state, pacbioPlateFactory.content.data)
    expect(state.plates).toEqual(pacbioPlateFactory.storeData.resources.plates)
  })
})
