import { flowCellType } from '@/stores/utilities/flowCell.js'
import { describe, expect, it } from 'vitest'
import { useOntRunsStore } from '@/stores/ontRuns.js'
import { createPinia, setActivePinia } from '@support/testHelper.js'

describe('flowCell.js', () => {
  let flowCell

  beforeEach(() => {
    flowCell = flowCellType()
  })

  describe('validateFlowCellId', () => {
    it('returns true if flowcell_id is valid and removes existing errors', () => {
      flowCell.errors.flowcell_id = 'Flowcell is invalid'
      flowCell.flowcell_id = 'ABC123'

      expect(flowCell.validateFlowCellId()).toEqual(true)
      expect(flowCell.errors.flowcell_id).toEqual(undefined)
    })
    it('returns invalid if flowcell_id is invalid and adds an error', () => {
      flowCell.flowcell_id = 'FLO-PRO001234'

      expect(flowCell.validateFlowCellId(flowCell)).toEqual(false)
      expect(flowCell.errors.flowcell_id).toEqual(
        'Enter a valid Flowcell ID (3 letters then at least 3 numbers)',
      )
    })
    it('returns empty if flowcell_id is empty and removes existing errors', () => {
      flowCell.errors.flowcell_id = 'Flowcell is invalid'
      flowCell.flowcell_id = ''

      expect(flowCell.validateFlowCellId()).toEqual(true)
      expect(flowCell.errors.flowcell_id).toEqual(undefined)
    })
  })

  describe('validateBarcode', () => {
    let store

    beforeEach(() => {
      const pinia = createPinia()
      setActivePinia(pinia)
      store = useOntRunsStore()
    })

    it('returns valid if tube_barcode is valid and removes existing errors', () => {
      flowCell.errors.tube_barcode = 'Enter a valid Pool barcode'
      store.pools = { 1: { tube: 1, tube_barcode: 'TRAC-123' } }

      flowCell.tube_barcode = 'TRAC-123'
      expect(flowCell.validateBarcode()).toEqual(true)
      expect(flowCell.errors.tube_barcode).toEqual(undefined)
    })
    it('returns invalid if tube_barcode is invalid and adds an error', () => {
      flowCell.tube_barcode = 'TRAC-123'

      expect(flowCell.validateBarcode()).toEqual(false)
      expect(flowCell.errors.tube_barcode).toEqual('Enter a valid Pool barcode')
    })
    it('returns empty if tube_barcode is empty and removes existing errors', () => {
      flowCell.tube_barcode = ''

      expect(flowCell.validateBarcode(flowCell)).toEqual(true)
      expect(flowCell.errors.tube_barcode).toEqual(undefined)
    })
  })
})
