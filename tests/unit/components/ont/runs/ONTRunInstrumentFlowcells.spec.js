import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells'
import { mount, store, router, Data } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'
import Response from '@/api/Response'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

describe('ONTRunInstrumentFlowcells', () => {
  let wrapper, ontRunInstrumentFlowcell, mockInstruments, mockRun

  beforeEach(() => {
    mockInstruments = new Response(Data.OntInstruments).deserialize.instruments

    const rawInstruments = new Response(Data.OntInstruments)._body.data
    store.commit('traction/ont/setInstruments', rawInstruments)

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

      it('must have instruments', () => {
        const expected = mockInstruments.map((i) => {
          const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
          return {
            ...i,
            ...instrumentConfig,
          }
        })
        expect(ontRunInstrumentFlowcell.instruments).toEqual(expected)
      })

      it('must have instrumentByName', () => {
        const expected = mockInstruments.find((i) => i.name == 'PC24B148')
        expect(ontRunInstrumentFlowcell.instrument).toEqual(expected)
      })
    })
  })

  describe('#methods', () => {
    it('#calculatePosition', () => {
      const rowIndex = 2
      const colIndex = 3
      // NB. positions are numbered in column order (e.g. PromethIon col 1 is positions 1-8, col 2 is 9-16, col 3 is 17-24)
      expect(ontRunInstrumentFlowcell.calculatePosition(rowIndex, colIndex)).toEqual(18)
    })

    it('#calculateCoordinate for PromethION', () => {
      const rowIndex = 2
      const colIndex = 3
      expect(ontRunInstrumentFlowcell.calculateCoordinate(rowIndex, colIndex)).toEqual('3B')
    })
  })
})
