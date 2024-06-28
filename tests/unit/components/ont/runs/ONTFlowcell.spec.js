import ONTFlowcell from '@/components/ont/runs/ONTFlowcell'
import { mount, createTestingPinia } from '@support/testHelper'
import { describe, expect } from 'vitest'
import { useOntRunsStore } from '@/stores/ontRuns'

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * props - props to pass to the component
 */
function mountWithStore(props = {}) {
  const wrapperObj = mount(ONTFlowcell, {
    global: {
      plugins: [
        createTestingPinia({
          stubActions: false,
          plugins: [],
        }),
      ],
    },
    props,
  })
  const storeObj = useOntRunsStore()
  return { wrapperObj, storeObj }
}

describe('ONTFlowcell', () => {
  let wrapper, ontFlowcell, props, store

  beforeEach(() => {
    props = {
      position: 1,
      coordinate: 'A1',
    }
    const { wrapperObj, storeObj } = mountWithStore(props)
    store = storeObj
    wrapper = wrapperObj
    ontFlowcell = wrapperObj.vm

    store.setFlowcellId({ $event: 'ABC123', position: 1 })
    store.setPoolTubeBarcode({ barcode: 'TRAC-1-A', position: 1 })
  })

  describe('props', () => {
    it('must have a position', () => {
      expect(ontFlowcell.position).toEqual(props.position)
    })
    it('must have a coordinate', () => {
      expect(ontFlowcell.coordinate).toEqual(props.coordinate)
    })
  })

  describe('#computed', () => {
    describe('flowcellIdValidation', () => {
      it('errors if FlowcellId is not valid', async () => {
        const flowcellIdInput = wrapper.find('#flowcell-id-1')
        await flowcellIdInput.setValue('some value')
        expect(ontFlowcell.flowcellIdValidationError).toBe(
          'Enter a valid Flowcell ID (3 letters then at least 3 numbers)',
        )
      })

      it('does not error if FlowcellId is valid', async () => {
        const flowcellIdInput = wrapper.find('#flowcell-id-1')
        await flowcellIdInput.setValue('ABC123')
        expect(ontFlowcell.flowcellIdValidationError).toBe('')
      })
    })

    it('#mapState', async () => {
      ontFlowcell.flowCellValidationState = {
        statusBarcode: 'Valid',
        statusId: 'Valid',
        errorBarcode: '',
        errorId: '',
        state: 'Success',
      }
      expect(ontFlowcell.flowcellId).toBeDefined()
      expect(ontFlowcell.flowcellId).toEqual('ABC123')
      expect(ontFlowcell.poolTubeBarcode).toBeDefined()
      expect(ontFlowcell.poolTubeBarcode).toEqual('TRAC-1-A')
      expect(ontFlowcell.flowcell_bg_colour).toBeDefined()
      expect(ontFlowcell.flowcell_bg_colour).toEqual('border border-3 border-success')
    })
  })

  describe('#methods', () => {
    describe('#mapActions', () => {
      it('#setFlowcellId', () => {
        ontFlowcell.setFlowcellId({ $event: 'FC2', position: 1 })
        expect(ontFlowcell.flowcellId).toEqual('FC2')
      })

      it('#setPoolTubeBarcode', () => {
        ontFlowcell.setPoolTubeBarcode({ barcode: 'TRAC-1-B', position: 1 })
        expect(ontFlowcell.poolTubeBarcode).toEqual('TRAC-1-B')
      })

      it('#setNewFlowCell', () => {
        ontFlowcell.setNewFlowCell(2)
        expect(ontFlowcell.position).toEqual(2)
      })
    })

    describe('formatter', () => {
      it('formats the string', () => {
        expect(ontFlowcell.formatter(' a StriNG    ')).toEqual('A STRING')
      })
    })
  })
})
