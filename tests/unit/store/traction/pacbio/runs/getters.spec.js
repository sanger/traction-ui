import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/pacbio/runs/getters'
import { describe, expect, it } from 'vitest'

describe('getters', () => {
  let runs

  it('"runs" returns the given run from "state.runs"', () => {
    runs = new Response(Data.PacbioRuns).deserialize.runs
    const state = {
      runs: runs,
    }
    const actual = getters.runs(state)
    expect(actual).toEqual(runs)
  })
})
