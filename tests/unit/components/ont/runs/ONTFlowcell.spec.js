import ONTFlowCell from '@/components/ont/runs/ONTFlowCell'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'

describe('ONTFlowCell', () => {
  let wrapper, ontFlowCell, props

  beforeEach(() => {
    props = {
      position: 1,
    }

    // create a flowcell in the store and set its pool
    store.commit('traction/ont/runs/setFlowcellId', { $event: 'FC1', position: 1 })
    store.commit('traction/ont/runs/setPoolId', { $event: 'Pool1', position: 1 })

    wrapper = mount(ONTFlowCell, {
      localVue,
      propsData: props,
      store,
    })

    ontFlowCell = wrapper.vm
  })

  describe('props', () => {
    it('must have a position', () => {
      expect(ontFlowCell.position).toEqual(props.position)
    })
  })

  describe('#computed', () => {
    it('#mapState', () => {
      expect(ontFlowCell.flowcell).toBeDefined()
      expect(ontFlowCell.flowcell).toEqual({
        flowcell_id: 'FC1',
        ont_pool_id: 'Pool1',
        position: 1,
      })
      expect(ontFlowCell.flowcellId).toBeDefined()
      expect(ontFlowCell.flowcellId).toEqual('FC1')
      expect(ontFlowCell.poolId).toBeDefined()
      expect(ontFlowCell.poolId).toEqual('Pool1')
      expect(ontFlowCell.flowcell_bg_colour).toBeDefined()
      expect(ontFlowCell.flowcell_bg_colour).toEqual('fc_ready')
    })
  })

  describe('#methods', () => {
    describe('#mapMutations', () => {
      it('#setFlowcellId', () => {
        ontFlowCell.setFlowcellId('FC2')
        expect(ontFlowCell.flowcellId).toEqual('FC2')
      })

      it('#setPoolId', () => {
        ontFlowCell.setPoolId('Pool2')
        expect(ontFlowCell.poolId).toEqual('Pool2')
      })
    })
  })
})
