import mutations from '@/store/traction/pacbio/runCreate/mutations'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import { Data } from '@support/testHelper'
import { dataToObjectById } from '@/api/JsonApi'

describe('mutations.js', () => {
  const {
   populateSmrtLinkVersions
  } = mutations

  describe('populateSmrtLinkVersions', () => {
    it('updates the state', () => {
      // mock state
      const smrtLinkVersions = Data.TractionPacbioSmrtLinkVersions.data.data
      const state = defaultState()
      // apply mutation
      populateSmrtLinkVersions(state, smrtLinkVersions)
      // assert result
      console.log(state.resources.smrtLinkVersions)
      expect(state.resources.smrtLinkVersions).toEqual(
        dataToObjectById({ data: smrtLinkVersions }),
      )
    })
  })
})
