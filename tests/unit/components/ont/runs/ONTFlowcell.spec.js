import ONTFlowcell from '@/components/ont/runs/ONTFlowcell'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'

describe('ONTFlowcell', () => {
  let wrapper, ontFlowcell, props

  beforeEach(() => {
    props = {
      position: 1,
    }

    // create a flowcell in the store and set its pool
    store.commit('traction/ont/runs/setFlowcellId', { $event: 'FC1', position: 1 })
    store.commit('traction/ont/runs/setPoolId', { $event: 'Pool1', position: 1 })

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
        ont_pool_id: 'Pool1',
        position: 1,
      })
      expect(ontFlowcell.flowcellId).toBeDefined()
      expect(ontFlowcell.flowcellId).toEqual('FC1')
      expect(ontFlowcell.poolId).toBeDefined()
      expect(ontFlowcell.poolId).toEqual('Pool1')
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

      it('#setPoolId', () => {
        ontFlowcell.setPoolId({ $event: 'Pool2', position: 1 })
        expect(ontFlowcell.poolId).toEqual('Pool2')
      })
    })
  })
})
