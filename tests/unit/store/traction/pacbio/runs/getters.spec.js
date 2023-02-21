import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/pacbio/runs/getters'
import { describe, expect, it } from 'vitest'

describe('getters', () => {
  let runs, run

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

  describe('poolBarcodes', () => {
    it('returns barcodes when editing a run with a single pool', () => {
      const currentRun = {
        id: '1',
        plate: {
          wells: [
            {
              pools: [
                {
                  tube: {
                    barcode: 'TRAC-1-1',
                  },
                },
              ],
            },
          ],
        },
      }

      const state = { currentRun }
      const barcodes = getters.poolBarcodes(state)
      expect(barcodes).toEqual('TRAC-1-1')
    })

    it('returns barcodes when editing a run with multiple pools', () => {
      const currentRun = {
        id: '1',
        plate: {
          wells: [
            {
              pools: [
                {
                  tube: {
                    barcode: 'TRAC-1-1',
                  },
                },
                {
                  tube: {
                    barcode: 'TRAC-1-2',
                  },
                },
              ],
            },
          ],
        },
      }
      const state = { currentRun }
      const barcodes = getters.poolBarcodes(state)
      expect(barcodes).toEqual('TRAC-1-1,TRAC-1-2')
    })

    it('doesnt return a barcode when creating a run', () => {
      // TODO awaiting refactoring
      
      // const currentRun = {
      //   id: 'new',
      //   plate: {
      //     wells: [],
      //   },
      // }
      // const state = currentRun
      // const barcodes = getters.poolBarcodes(state)
      // expect(barcodes).toEqual(null)
    })
  })
})
