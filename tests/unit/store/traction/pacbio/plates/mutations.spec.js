import mutations from '@/store/traction/pacbio/plates/mutations'
import { dataToObjectById } from '@/api/JsonApi'
import PacbioPlatesRequestFactory from '@tests/factories/PacbioPlatesRequestFactory'

const pacbioPlatesRequestFactory = PacbioPlatesRequestFactory()

describe('mutations', () => {
  it('"setPlates" sets "state.plates" to the given plates', () => {
    const state = {
      plates: {},
    }
    mutations.setPlates(state, pacbioPlatesRequestFactory.storeData)
    expect(state.plates).toEqual(
      dataToObjectById({ data: pacbioPlatesRequestFactory.storeData, includeRelationships: true }),
    )
  })
})
