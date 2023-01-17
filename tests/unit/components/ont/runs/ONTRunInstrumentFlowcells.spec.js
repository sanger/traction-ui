import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells'
import { localVue, mount, store, router, Data } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'
import Response from '@/api/Response'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

describe('ONTRunInstrumentFlowcells', () => {
  let wrapper, ontRunInstrumentFlowcell, mockInstruments, mockRun

  beforeEach(() => {
    // create a flowcell in the store and set its pool
    // store.commit('traction/ont/runs/setFlowcellId', { $event: 'FC1', position: 1 })
    // store.commit('traction/ont/runs/setPoolId', { $event: 'Pool1', position: 1 })

    // TODO: add one or more ONTFlowcell?

    mockInstruments = new Response(Data.OntInstruments).deserialize.instruments
    store.commit('traction/ont/runs/setInstruments', mockInstruments)

    mockRun = {
      id: 'new',
      instrument_name: 'GXB02004',
      state: 'pending',
      flowcell_attributes: [],
    }
    store.commit('traction/ont/runs/setCurrentRun', mockRun)

    wrapper = mount(ONTRunInstrumentFlowcells, {
      store,
      router,
      localVue,
    })

    ontRunInstrumentFlowcell = wrapper.vm
  })

  describe('#computed', () => {
    it('#mapGetters', () => {

      it('must have currentRun', () => {
        expect(ontRunInstrumentFlowcell.currentRun).toEqual(mockRun)
      })

      it('must have instrumentFlowcellLayout', () => {
        expect(ontRunInstrumentFlowcell.instrumentFlowcellLayout).toEqual(InstrumentFlowcellLayout)
      })
      it('must have instruments', () => {
        expect(ontRunInstrumentFlowcell.instruments).toEqual(mockInstruments)
      })
    })

    // expect(ontRunInstrumentFlowcell.getInstrumentLayout()).toEqual('')
    // expect(ontRunInstrumentFlowcell.numOfRows()).toEqual(1)
    // expect(ontRunInstrumentFlowcell.numOfColumns()).toEqual(5)

    it('#mapState', () => {
      expect(ontRunInstrumentFlowcell.getInstrumentLayout).toBeDefined()
      // expect(ontRunInstrumentFlowcell.getInstrumentLayout).toEqual('FC1')
      expect(ontRunInstrumentFlowcell.numOfRows).toBeDefined()
      // expect(ontRunInstrumentFlowcell.numOfRows).toEqual('Pool1')
      expect(ontRunInstrumentFlowcell.numOfColumns).toBeDefined()
      // expect(ontRunInstrumentFlowcell.numOfColumns).toEqual('fc_ready')
    })
  })

  // describe('#methods', () => {
  //   it('#calculatePosition', () => {
  //     // TODO: set something?
  //     expect(ontRunInstrumentFlowcell.calculatePosition(rowIndex, colIndex)).toEqual(?)
  //   }
  // })
})
