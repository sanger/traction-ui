import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells'
import { localVue, mount, store, router, Data } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'
import Response from '@/api/Response'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

describe('ONTRunInstrumentFlowcells', () => {
  let wrapper, ontRunInstrumentFlowcell, mockInstruments, mockRun

  beforeEach(() => {
    mockInstruments = new Response(Data.OntInstruments).deserialize.instruments
    store.commit('traction/ont/runs/setInstruments', mockInstruments)

    mockRun = {
      id: 'new',
      instrument_name: 'PC24B148',
      state: 'pending',
      flowcell_attributes: [],
    }
    store.commit('traction/ont/runs/setCurrentRun', mockRun)

    wrapper = mount(ONTRunInstrumentFlowcells, {
      store,
      router,
      localVue,
      stubs: {
        ONTFlowcell: true,
      },
    })

    ontRunInstrumentFlowcell = wrapper.vm
  })

  describe('components', () => {
    it('has an ONTFlowcell component', () => {
      expect(wrapper.findComponent({ name: 'ONTFlowcell' }).exists()).toBe(true)
    })
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

    it('#getInstrumentLayout', () => {
      expect(ontRunInstrumentFlowcell.getInstrumentLayout).toBeDefined()
      expect(ontRunInstrumentFlowcell.getInstrumentLayout).toEqual({
        columns: 3,
        rows: 8,
        useCoordinates: true,
      })
    })
    it('#numOfRows', () => {
      expect(ontRunInstrumentFlowcell.numOfRows).toBeDefined()
      expect(ontRunInstrumentFlowcell.numOfRows).toEqual(8)
    })
    it('#numOfColumns', () => {
      expect(ontRunInstrumentFlowcell.numOfColumns).toBeDefined()
      expect(ontRunInstrumentFlowcell.numOfColumns).toEqual(3)
    })
    it('#useCoordinates', () => {
      expect(ontRunInstrumentFlowcell.useCoordinates).toBeDefined()
      expect(ontRunInstrumentFlowcell.useCoordinates).toEqual(true)
    })
  })

  describe('#methods', () => {
    it('#calculatePosition', () => {
      let rowIndex = 2
      let colIndex = 3
      // NB. positions are numbered in column order (e.g. PromethIon col 1 is positions 1-8, col 2 is 9-16, col 3 is 17-24)
      expect(ontRunInstrumentFlowcell.calculatePosition(rowIndex, colIndex)).toEqual(18)
    })

    it('#calculateCoordinate for PromethION', () => {
      let rowIndex = 2
      let colIndex = 3
      expect(ontRunInstrumentFlowcell.calculateCoordinate(rowIndex, colIndex)).toEqual('B3')
    })
  })
})
