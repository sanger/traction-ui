import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/pacbio/runs/getters'
import storeRuns from '@tests/data/StoreRuns'

const state = { runs: storeRuns }

describe('getters', () => {
  it('"run" returns the given run from "state.runs"', () => {
    const actual = getters.run(state)(Object.keys(storeRuns)[0])
    expect(actual).toEqual(Object.values(storeRuns)[0])
  })

  it('"runs" returns runs from "state.runs"', () => {
    const actual = getters.runs(state)
    expect(actual).toEqual(Object.values(storeRuns))
  })
})
