import getters from '@/store/traction/pacbio/runCreate/getters'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import { Data } from '@support/testHelper'

describe('getters.js', () => {
  const state = defaultState()
  const {
    smrtLinkVersionList,
  } = getters

  

  describe('smrtLinkVersionList', () => {
    it('returns a list of smrt link version resources', () => {
      const expected = [
        {
          id: '1',
          version: 'v1',
          default: true,
        },
        {
          id: '2',
          version: 'v2',
          default: false,
        },
      ]
      state.resources.smrtLinkVersions = expected
      expect(smrtLinkVersionList(state)).toEqual(expected)
    })
  })
})
