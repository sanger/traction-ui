import { FlowCellStateEnum, FieldStatusEnum, flowCellType } from '@/stores/utilities/flowCell'
import { describe, expect, it } from 'vitest'
import { store } from '@support/testHelper'
describe('flowCell.js', () => {
  let flowCell
  beforeEach(() => {
    flowCell = flowCellType
  })
  describe('validateFlowCellId', () => {
    it('returns valid if flowcell_id is valid', () => {
      flowCell.flowcell_id = 'ABC123'
      const result = flowCell.validateFlowCellId(flowCell)
      expect(result.status).toEqual(FieldStatusEnum.Valid)
      expect(result.error).toEqual('')
    })
    it('returns invalid if flowcell_id is invalid', () => {
      flowCell.flowcell_id = 'FLO-PRO001234'
      const result = flowCell.validateFlowCellId(flowCell)
      expect(result.status).toEqual(FieldStatusEnum.Invalid)
      expect(result.error).toEqual('Enter a valid Flowcell ID (3 letters then at least 3 numbers)')
    })
    it('returns empty if flowcell_id is empty', () => {
      flowCell.flowcell_id = ''
      const result = flowCell.validateFlowCellId(flowCell)
      expect(result.status).toEqual(FieldStatusEnum.Empty)
      expect(result.error).toEqual('')
    })
  })
  describe('validateBarcode', () => {
    it('returns valid if tube_barcode is valid', async () => {
      const dispatch = vi.fn().mockResolvedValue({ success: true })
      store.dispatch = dispatch
      flowCell.tube_barcode = 'TRAC-123'
      const result = await flowCell.validateBarcode(flowCell)
      expect(dispatch).toHaveBeenCalledWith('traction/ont/pools/validatePoolBarcode', 'TRAC-123')
      expect(result.status).toEqual(FieldStatusEnum.Valid)
      expect(result.error).toEqual('')
    })
    it('returns invalid if tube_barcode is invalid', async () => {
      const dispatch = vi.fn().mockResolvedValue({ success: false })
      store.dispatch = dispatch
      flowCell.tube_barcode = 'TRAC-123'
      const result = await flowCell.validateBarcode(flowCell)
      expect(result.status).toEqual(FieldStatusEnum.Invalid)
      expect(result.error).toEqual('Enter a valid Pool Library barcode')
    })
    it('returns empty if tube_barcode is empty', async () => {
      flowCell.tube_barcode = ''
      const result = await flowCell.validateBarcode(flowCell)
      expect(result.status).toEqual(FieldStatusEnum.Empty)
      expect(result.error).toEqual('')
    })
  })
  describe('validateFlowCell', () => {
    describe('when both fields require validation', () => {
      it('returns success if flowcell_id and tube_barcode are valid', async () => {
        const dispatch = vi.fn().mockResolvedValue({ success: true })
        store.dispatch = dispatch
        flowCell.flowcell_id = 'ABC123'
        flowCell.tube_barcode = 'TRAC-123'
        const result = await flowCell.validateFlowCell(true, true)
        expect(dispatch).toHaveBeenCalledWith('traction/ont/pools/validatePoolBarcode', 'TRAC-123')
        expect(result.statusId).toEqual(FieldStatusEnum.Valid)
        expect(result.errorId).toEqual('')
        expect(result.statusBarcode).toEqual(FieldStatusEnum.Valid)
        expect(result.errorBarcode).toEqual('')
        expect(result.state).toEqual(FlowCellStateEnum.Success)
      })
      it('returns failure if flowcell_id is invalid', async () => {
        flowCell.flowcell_id = 'FLO-PRO001234'
        flowCell.tube_barcode = 'TRAC-123'
        const result = await flowCell.validateFlowCell(true, true)
        expect(result.statusId).toEqual(FieldStatusEnum.Invalid)
        expect(result.statusBarcode).toEqual(FieldStatusEnum.Valid)
        expect(result.errorBarcode).toEqual('')
        expect(result.state).toEqual(FlowCellStateEnum.Failure)
      })
      it('returns failure if tube_barcode is invalid', async () => {
        const dispatch = vi.fn().mockResolvedValue({ success: false })
        store.dispatch = dispatch
        flowCell.flowcell_id = 'ABC123'
        flowCell.tube_barcode = 'TRAC-123'
        const result = await flowCell.validateFlowCell(true, true)
        expect(dispatch).toHaveBeenCalledWith('traction/ont/pools/validatePoolBarcode', 'TRAC-123')
        expect(result.statusId).toEqual(FieldStatusEnum.Valid)
        expect(result.errorId).toEqual('')
        expect(result.statusBarcode).toEqual(FieldStatusEnum.Invalid)
        expect(result.errorBarcode).toEqual('Enter a valid Pool Library barcode')
        expect(result.state).toEqual(FlowCellStateEnum.Failure)
      })
      it('returns empty if flowcell_id and tube_barcode are empty', async () => {
        flowCell.flowcell_id = ''
        flowCell.tube_barcode = ''
        const result = await flowCell.validateFlowCell(true, true)
        expect(result.statusId).toEqual(FieldStatusEnum.Empty)
        expect(result.errorId).toEqual('')
        expect(result.statusBarcode).toEqual(FieldStatusEnum.Empty)
        expect(result.errorBarcode).toEqual('')
        expect(result.state).toEqual(FlowCellStateEnum.None)
      })
      it('returns warning if flowcell_id is valid tube_barcode field is empty', async () => {
        flowCell.flowcell_id = 'ABC123'
        flowCell.tube_barcode = ''
        const result = await flowCell.validateFlowCell(true, true)
        expect(result.statusId).toEqual(FieldStatusEnum.Valid)
        expect(result.errorId).toEqual('')
        expect(result.statusBarcode).toEqual(FieldStatusEnum.Empty)
        expect(result.errorBarcode).toEqual('')
        expect(result.state).toEqual(FlowCellStateEnum.Warning)
      })
      it('returns warning if flowcell_id is empty tube_barcode field is valid', async () => {
        const dispatch = vi.fn().mockResolvedValue({ success: true })
        store.dispatch = dispatch
        flowCell.flowcell_id = ''
        flowCell.tube_barcode = 'TRAC-123'
        const result = await flowCell.validateFlowCell(true, true)
        expect(dispatch).toHaveBeenCalledWith('traction/ont/pools/validatePoolBarcode', 'TRAC-123')
        expect(result.statusId).toEqual(FieldStatusEnum.Empty)
        expect(result.errorId).toEqual('')
        expect(result.statusBarcode).toEqual(FieldStatusEnum.Valid)
        expect(result.errorBarcode).toEqual('')
        expect(result.state).toEqual(FlowCellStateEnum.Warning)
      })
    })
    describe('when one field require validation', () => {
      describe('when only flowcell_id requires validation', () => {
        it('returns warning if flowcell_id is valid', async () => {
          flowCell.flowcell_id = 'ABC123'
          const result = await flowCell.validateFlowCell(true, false)
          expect(result.statusId).toEqual(FieldStatusEnum.Valid)
          expect(result.errorId).toEqual('')
          expect(result.statusBarcode).toEqual(FieldStatusEnum.Empty)
          expect(result.errorBarcode).toEqual('')
          expect(result.state).toEqual(FlowCellStateEnum.Warning)
        })
        it('returns success if flowcell_id is valid and given state object with valid barcode state', async () => {
          flowCell.flowcell_id = 'ABC123'
          const result = await flowCell.validateFlowCell(true, false, {
            errorBarcode: '',
            statusBarcode: FieldStatusEnum.Valid,
          })
          expect(result.statusId).toEqual(FieldStatusEnum.Valid)
          expect(result.errorId).toEqual('')
          expect(result.statusBarcode).toEqual(FieldStatusEnum.Valid)
          expect(result.errorBarcode).toEqual('')
          expect(result.state).toEqual(FlowCellStateEnum.Success)
        })
        it('returns failure if flowcell_id is valid and given state object with invalid valid barcode state', async () => {
          flowCell.flowcell_id = 'ABC123'
          const result = await flowCell.validateFlowCell(true, false, {
            errorBarcode: 'Error',
            statusBarcode: FieldStatusEnum.Invalid,
          })
          expect(result.statusId).toEqual(FieldStatusEnum.Valid)
          expect(result.errorId).toEqual('')
          expect(result.statusBarcode).toEqual(FieldStatusEnum.Invalid)
          expect(result.errorBarcode).toEqual('Error')
          expect(result.state).toEqual(FlowCellStateEnum.Failure)
        })
      })
      describe('when only tube_barcode requires validation', () => {
        it('returns warning if tube_barcode is valid', async () => {
          const dispatch = vi.fn().mockResolvedValue({ success: true })
          store.dispatch = dispatch
          flowCell.tube_barcode = 'TRAC-123'
          const result = await flowCell.validateFlowCell(false, true)
          expect(dispatch).toHaveBeenCalledWith(
            'traction/ont/pools/validatePoolBarcode',
            'TRAC-123',
          )
          expect(result.statusId).toEqual(FieldStatusEnum.Empty)
          expect(result.errorId).toEqual('')
          expect(result.statusBarcode).toEqual(FieldStatusEnum.Valid)
          expect(result.errorBarcode).toEqual('')
          expect(result.state).toEqual(FlowCellStateEnum.Warning)
        })
        it('returns success if tube_barcode is valid and given state object with valid id state', async () => {
          const dispatch = vi.fn().mockResolvedValue({ success: true })
          store.dispatch = dispatch
          flowCell.tube_barcode = 'TRAC-123'
          const result = await flowCell.validateFlowCell(false, true, {
            errorId: '',
            statusId: FieldStatusEnum.Valid,
          })
          expect(dispatch).toHaveBeenCalledWith(
            'traction/ont/pools/validatePoolBarcode',
            'TRAC-123',
          )
          expect(result.statusId).toEqual(FieldStatusEnum.Valid)
          expect(result.errorId).toEqual('')
          expect(result.statusBarcode).toEqual(FieldStatusEnum.Valid)
          expect(result.errorBarcode).toEqual('')
          expect(result.state).toEqual(FlowCellStateEnum.Success)
        })
        it('returns failure if tube_barcode is valid and given state object with invalid  id state', async () => {
          const dispatch = vi.fn().mockResolvedValue({ success: true })
          store.dispatch = dispatch
          flowCell.tube_barcode = 'TRAC-123'
          const result = await flowCell.validateFlowCell(false, true, {
            errorId: 'Error',
            statusId: FieldStatusEnum.Invalid,
          })
          expect(dispatch).toHaveBeenCalledWith(
            'traction/ont/pools/validatePoolBarcode',
            'TRAC-123',
          )
          expect(result.statusId).toEqual(FieldStatusEnum.Invalid)
          expect(result.errorId).toEqual('Error')
          expect(result.statusBarcode).toEqual(FieldStatusEnum.Valid)
          expect(result.errorBarcode).toEqual('')
          expect(result.state).toEqual(FlowCellStateEnum.Failure)
        })
      })
    })
  })
})
