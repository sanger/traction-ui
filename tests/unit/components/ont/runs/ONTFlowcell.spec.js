import ONTFlowcell from '@/components/ont/runs/ONTFlowcell'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'

describe('ONTFlowcell', () => {
  let wrapper, ontFlowcell, props

  beforeEach(() => {
    props = {
      position: 1,
    }

    // Create a flowcell in the store and set its tube barcode
    store.commit('traction/ont/runs/setFlowcellId', { $event: 'FC1', position: 1 })
    store.commit('traction/ont/runs/setPoolTubeBarcode', { $event: 'TRAC-1-A', position: 1 })

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
  })

  describe('#computed', () => {
    it('#mapState', () => {
      expect(ontFlowcell.flowcell).toBeDefined()
      expect(ontFlowcell.flowcell).toEqual({
        flowcell_id: 'FC1',
        tube_barcode: 'TRAC-1-A',
        position: 1,
      })
      expect(ontFlowcell.flowcellId).toBeDefined()
      expect(ontFlowcell.flowcellId).toEqual('FC1')
      expect(ontFlowcell.poolTubeBarcode).toBeDefined()
      expect(ontFlowcell.poolTubeBarcode).toEqual('TRAC-1-A')
      expect(ontFlowcell.flowcell_bg_colour).toBeDefined()
      expect(ontFlowcell.flowcell_bg_colour).toEqual('fc_ready')
    })
  })

  describe('#methods', () => {
    describe('#mapMutations', () => {
      it('#setFlowcellId', () => {
        ontFlowcell.setFlowcellId({ $event: 'FC2', position: 1 })
        expect(ontFlowcell.flowcellId).toEqual('FC2')
      })

      it('#setPoolTubeBarcode', () => {
        ontFlowcell.setPoolTubeBarcode({ $event: 'TRAC-1-B', position: 1 })
        expect(ontFlowcell.poolTubeBarcode).toEqual('TRAC-1-B')
      })
    })
  })
})
