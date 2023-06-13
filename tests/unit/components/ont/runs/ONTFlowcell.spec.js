import ONTFlowcell from '@/components/ont/runs/ONTFlowcell'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'

describe('ONTFlowcell', () => {
  let wrapper, ontFlowcell, props

  beforeEach(() => {
    props = {
      position: 1,
      coordinate: 'A1',
    }

    // Create a flowcell in the store and set its tube barcode
    store.commit('traction/ont/runs/setFlowcellId', { $event: 'ABC123', position: 1 })
    store.commit('traction/ont/runs/setPoolTubeBarcode', { barcode: 'TRAC-1-A', position: 1 })

    wrapper = mount(ONTFlowcell, {
      localVue,
      propsData: props,
      store,
    })

    ontFlowcell = wrapper.vm
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
          'Enter at valid Flowcell ID (3 letters then at least 3 numbers)',
        )
      })

      it('does not error if FlowcellId is valid', async () => {
        const flowcellIdInput = wrapper.find('#flowcell-id-1')
        await flowcellIdInput.setValue('ABC123')
        expect(ontFlowcell.flowcellIdValidationError).toBe('')
      })
    })

    it('#mapState', () => {
      expect(ontFlowcell.flowcellId).toBeDefined()
      expect(ontFlowcell.flowcellId).toEqual('ABC123')
      expect(ontFlowcell.poolTubeBarcode).toBeDefined()
      expect(ontFlowcell.poolTubeBarcode).toEqual('TRAC-1-A')
      expect(ontFlowcell.flowcell_bg_colour).toBeDefined()
      expect(ontFlowcell.flowcell_bg_colour).toEqual('border border-3 border-success')
    })
  })

  describe('#methods', () => {
    describe('#mapMutations', () => {
      it('#setFlowcellId', () => {
        ontFlowcell.setFlowcellId({ $event: 'FC2', position: 1 })
        expect(ontFlowcell.flowcellId).toEqual('FC2')
      })

      it('#setPoolTubeBarcode', () => {
        ontFlowcell.setPoolTubeBarcode({ barcode: 'TRAC-1-B', position: 1 })
        expect(ontFlowcell.poolTubeBarcode).toEqual('TRAC-1-B')
      })
    })

    describe('formatter', () => {
      it('formats the string', () => {
        expect(ontFlowcell.formatter(' a StriNG    ')).toEqual('A STRING')
      })
    })
  })
})
