import mutations from '@/store/traction/pacbio/plates/mutations'
import PacbioPlatesRequestFactory from '@tests/factories/PacbioPlatesRequestFactory'

const pacbioPlatesRequestFactory = PacbioPlatesRequestFactory()

describe('mutations', () => {
  it('"setPlates" sets "state.plates" to the given plates', () => {
    const state = {
      plates: {},
    }
    mutations.setPlates(state, pacbioPlatesRequestFactory.content.data)
    expect(state.plates).toEqual(pacbioPlatesRequestFactory.storeData.plates)
  })
})
