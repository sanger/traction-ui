import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/pacbio/runs/getters'
import { expect, it } from 'vitest'

let runs, run

describe('getters', () => {
  beforeEach(() => {
    runs = new Response(Data.PacbioRuns).deserialize.runs
    run = new Response(Data.PacbioRun).deserialize.run
  })

  it('"run" returns the given run from "state.runs"', () => {
    const state = {
      runs: runs,
    }
    const actual = getters.run(state)(runs[0].id)
    expect(actual).toEqual(runs[0])
  })

  it('"poolBarcodes" returns barcodes from currentRun when editing runs', () => {
    const state = { run: run }
    const barcodes = getters.poolBarcodes(state)
    expect(barcodes).toEqual(run.barcode)
  })

  it('"poolBarcodes" returns nothing when creating runs', () => {
    
  })
})
