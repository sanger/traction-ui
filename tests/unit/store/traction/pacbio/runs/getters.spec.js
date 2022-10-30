import getters from '@/store/traction/pacbio/runs/getters'
import storeRuns from '@tests/data/StoreRuns'
import defaultState from '@/store/traction/pacbio/runs/state'

describe('getters.js', () => {
  const { smrtLinkVersionList, run, runs } = getters

  const state = defaultState()
  state.runs = storeRuns

  it('"run" returns the given run from "state.runs"', () => {
    const actual = run(state)(Object.keys(storeRuns)[0])
    expect(actual).toEqual(Object.values(storeRuns)[0])
  })

  it('"runs" returns runs from "state.runs"', () => {
    const actual = runs(state)
    expect(actual).toEqual(Object.values(storeRuns))
  })

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
