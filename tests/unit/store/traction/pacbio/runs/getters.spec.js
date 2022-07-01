import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/pacbio/runs/getters'

let runs

describe('getters', () => {
  beforeEach(() => {
    runs = new Response(Data.PacbioRuns).deserialize.runs
  })

  it('"run" returns the given run from "state.runs"', () => {
    const state = {
      runs: runs,
    }
    const actual = getters.run(state)(runs[0].id)
    expect(actual).toEqual(runs[0])
  })
})
