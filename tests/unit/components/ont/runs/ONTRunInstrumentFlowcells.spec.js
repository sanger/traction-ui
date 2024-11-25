import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells'
import { mount, router, createTestingPinia } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'
import { useOntRunsStore } from '@/stores/ontRuns'
import OntInstrumentFactory from '@tests/factories/OntInstrumentFactory.js'

const ontInstrumentFactory = OntInstrumentFactory()
/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which include
 * state - initial state of the ontRuns store.
 * rootState - initial state of the ontRoot store.
 */
function mountWithStore({ state = {}, rootState = {} } = {}) {
  const wrapperObj = mount(ONTRunInstrumentFlowcells, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            ontRuns: { ...state },
            ontRoot: { resources: { ...rootState } },
          },
          stubActions: false,
          plugins: [],
        }),
      ],
      stubs: {
        ONTFlowcell: true,
      },
    },
    router,
  })
  const storeObj = useOntRunsStore()
  return { wrapperObj, storeObj }
}

describe('ONTRunInstrumentFlowcells', () => {
  let wrapper, ontRunInstrumentFlowcell, mockInstruments, mockRun

  beforeEach(() => {
    mockInstruments = ontInstrumentFactory.storeData.instruments
    mockRun = {
      id: 'new',
      instrument_name: 'PC24B148',
      state: 'pending',
      flowcell_attributes: [],
    }
    const { wrapperObj } = mountWithStore({
      state: { currentRun: mockRun },
      rootState: { instruments: mockInstruments },
    })

    wrapper = wrapperObj
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
