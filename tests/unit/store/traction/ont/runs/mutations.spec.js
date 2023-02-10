import Mutations from '@/store/traction/ont/runs/mutations'
import { expect, describe } from 'vitest'

describe('mutations', () => {
  let state

  beforeEach(() => {
    state = {
      runs: [],
      currentRun: {
        id: 'new',
        instrument_name: '',
        state: '',
        flowcell_attributes: [],
      },
    }
  })

  describe('mutate', () => {
    it('can mutate the state, e.g setCurrentRun', () => {
      const currentRun = {
        id: '1',
        instrument_name: '',
        state: 'pending',
        flowcell_attributes: [],
      }
      Mutations.setCurrentRun(state, currentRun)
      expect(state.currentRun).toEqual(currentRun)
    })
  })
  describe('mutateRun', () => {
    it('can mutate the currentRun state, e.g setCurrentRun', () => {
      const instrumentName = 'Bob'
      Mutations.setInstrumentName(state, instrumentName)
      expect(state.currentRun.instrument_name).toEqual(instrumentName)
    })

    it('can mutate the currentRun state, e.g setState', () => {
      const runState = 'Pending'
      Mutations.setState(state, runState)
      expect(state.currentRun.state).toEqual(runState)
    })
  })

  describe('setFlowcellId', () => {
    it('creates a flowcell object if one does not exist already for the position', () => {
      const obj = { $event: 'flowcell1', position: '1' }
      Mutations.setFlowcellId(state, obj)
      expect(state.currentRun.flowcell_attributes.length).toEqual(1)
      expect(state.currentRun.flowcell_attributes[0]).toEqual({
        flowcell_id: 'flowcell1',
        position: '1',
      })
    })

    it('updates the flowcell object is one exists for the position', () => {
      Mutations.setFlowcellId(state, { $event: 'flowcell1', position: '1' })
      const obj = { $event: 'flowcell1updated', position: '1' }
      Mutations.setFlowcellId(state, obj)
      expect(state.currentRun.flowcell_attributes.length).toEqual(1)
      expect(state.currentRun.flowcell_attributes[0]).toEqual({
        flowcell_id: 'flowcell1updated',
        position: '1',
      })
    })
  })

  describe('setPoolTubeBarcode', () => {
    it('creates a flowcell object if one does not exist already for the position', () => {
      const obj = { barcode: 'TRAC-A-1', position: '1' }
      Mutations.setPoolTubeBarcode(state, obj)
      expect(state.currentRun.flowcell_attributes.length).toEqual(1)
      expect(state.currentRun.flowcell_attributes[0]).toEqual({
        tube_barcode: 'TRAC-A-1',
        position: '1',
      })
    })

    it('updates the flowcell object is one exists for the position', () => {
      Mutations.setPoolTubeBarcode(state, { barcode: 'TRAC-A-1', position: '1' })
      const obj = { barcode: 'TRAC-A-2', position: '1' }
      Mutations.setPoolTubeBarcode(state, obj)
      expect(state.currentRun.flowcell_attributes.length).toEqual(1)
      expect(state.currentRun.flowcell_attributes[0]).toEqual({
        tube_barcode: 'TRAC-A-2',
        position: '1',
      })
    })
  })
})
