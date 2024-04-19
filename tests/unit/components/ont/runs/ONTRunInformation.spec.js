import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import { mount, router, Data, createTestingPinia } from '@support/testHelper'
import { beforeEach, describe, it } from 'vitest'
import Response from '@/api/v1/Response'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'
import { useOntRunsStore } from '@/stores/ontRuns'

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the ontRuns store.
 * rootState - initial state of the ontRoot store.
 * props - props to pass to component.
 */
function mountWithStore({ state = {}, rootState = {} } = {}, props = {}) {
  const wrapperObj = mount(ONTRunInformation, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            ontRuns: { ...state },
            ontRoot: { resources: { ...rootState } },
          },
          stubActions: false,
        }),
      ],
    },
    router,
    props,
  })
  const storeObj = useOntRunsStore()
  return { wrapperObj, storeObj }
}

describe('ONTRunInformation.vue', () => {
  let wrapper, ontRunInfomation, mockInstruments, mockRun, store

  beforeEach(() => {
    mockInstruments = new Response(Data.OntInstruments).deserialize.instruments
    mockRun = {
      id: 'new',
      instrument_name: '',
      state: '',
      flowcell_attributes: [],
    }
    const { wrapperObj, storeObj } = mountWithStore({
      state: { currentRun: mockRun },
      rootState: { instruments: mockInstruments },
    })

    wrapper = wrapperObj
    store = storeObj
    ontRunInfomation = wrapper.vm
  })

  describe('Instrument selection', () => {
    it('will always show', () => {
      expect(wrapper.find('#instrument-selection').exists()).toBeTruthy()
    })
  })

  describe('State selection', () => {
    it('will always show', () => {
      expect(wrapper.find('#state-selection').exists()).toBeTruthy()
    })
  })

  describe('#data', () => {
    it('must have statesList data', () => {
      expect(ontRunInfomation.statesList).toEqual([
        'Pending',
        'Completed',
        'User Terminated',
        'Instrument Crashed',
        'Restart',
      ])
    })
  })

  describe('#mapGetters', () => {
    it('must have currentRun', () => {
      expect(ontRunInfomation.currentRun).toEqual(mockRun)
    })
    it('must have instruments', () => {
      const expected = mockInstruments.map((i) => {
        const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
        return {
          ...i,
          ...instrumentConfig,
        }
      })
      expect(ontRunInfomation.instruments).toEqual(expected)
    })
  })
  describe('#mapState', () => {
    it('#mapState', () => {
      expect(ontRunInfomation.instrumentName).toEqual('')
      expect(ontRunInfomation.state).toEqual('')
    })
  })
  describe('#instrumentOptions', () => {
    it('must format instrumentOptions', () => {
      const options = mockInstruments.map((instrument) => ({
        value: instrument.name,
        text: instrument.name,
      }))
      const expected = [
        { value: null, text: 'Please select an instrument', disabled: true },
        ...options,
      ]
      expect(ontRunInfomation.instrumentOptions).toEqual(expected)
    })
  })

  describe('#stateOptions', () => {
    it('must format stateOptions', () => {
      const options = ontRunInfomation.statesList.map((state) => ({
        value: state.replace(/\s+/g, '_').toLowerCase(),
        text: state,
      }))
      const expected = [{ value: null, text: 'Please select a state', disabled: true }, ...options]
      expect(ontRunInfomation.stateOptions).toEqual(expected)
    })
  })

  describe('#newRecord', () => {
    it('returns false when currentRun is a new record', () => {
      expect(ontRunInfomation.newRecord).toEqual(true)
    })
    it('returns false when currentRun is not a new record', () => {
      store.setCurrentRun({
        id: '1',
        instrument_name: '',
        state: '',
        flowcell_attributes: [],
      })
      expect(ontRunInfomation.newRecord).toEqual(false)
    })
  })

  describe('#formatState', () => {
    it('converts a string to lowercase with underscores', () => {
      expect(ontRunInfomation.formatState('Test String Here')).toEqual('test_string_here')
    })
  })

  describe('#mapMutations', () => {
    it('#setInstrumentName', () => {
      ontRunInfomation.setInstrumentName('gridion')
      expect(ontRunInfomation.instrumentName).toEqual('gridion')
    })
    it('#setState', () => {
      ontRunInfomation.setState('started')
      expect(ontRunInfomation.state).toEqual('started')
    })
  })
})
