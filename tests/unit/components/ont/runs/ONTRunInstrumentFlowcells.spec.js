import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout.json'
import { useOntRunCreateStore } from '@/stores/ontRunCreate.js'
import OntInstrumentFactory from '@tests/factories/OntInstrumentFactory.js'
import { mountWithStore } from '../../../../support/testHelper.js'

const ontInstrumentFactory = OntInstrumentFactory()

describe('ONTRunInstrumentFlowcells', () => {
  let wrapper, ontRunInstrumentFlowcell, mockInstruments, mockRun

  beforeEach(() => {
    mockInstruments = ontInstrumentFactory.storeData.instruments
    mockRun = {
      id: 'new',
      instrument_name: 'PC24B148',
      state: 'pending',
      rebasecalling_process: '6mA all-context',
      flowcell_attributes: [],
    }
    ;({ wrapper } = mountWithStore(ONTRunInstrumentFlowcells, {
      initialState: {
        ontRunCreate: { currentRun: mockRun },
        ontRuns: { resources: { instruments: mockInstruments } },
      },
      stubs: {
        ONTFlowcell: true,
      },
      createStore: () => useOntRunCreateStore(),
    }))
    ontRunInstrumentFlowcell = wrapper.vm
  })

  describe('components', () => {
    it('has an ONTFlowcell component', () => {
      expect(wrapper.findComponent({ name: 'ONTFlowcell' }).exists()).toBe(true)
    })
  })

  describe('#computed', () => {
    it('must have currentRun', () => {
      expect(ontRunInstrumentFlowcell.currentRun).toEqual(mockRun)
    })

    it('must have instruments', () => {
      const expected = ontInstrumentFactory.storeData.instrumentsArray.map((i) => {
        const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
        return {
          ...i,
          ...instrumentConfig,
        }
      })
      expect(ontRunInstrumentFlowcell.instruments).toEqual(expected)
    })

    it('must have instrumentByName', () => {
      const expected = ontInstrumentFactory.storeData.instrumentsArray
        .map((i) => {
          const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
          return {
            ...i,
            ...instrumentConfig,
          }
        })
        .find((i) => i.name === mockRun.instrument_name)
      expect(ontRunInstrumentFlowcell.instrument).toEqual(expected)
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
