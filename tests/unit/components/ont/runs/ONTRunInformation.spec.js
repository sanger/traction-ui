import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import { localVue, mount, store, router, Data } from '@support/testHelper'
import { beforeEach, describe, it } from 'vitest'
import Response from '@/api/Response'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

describe('ONTRunInformation.vue', () => {
  let wrapper, ontRunInfomation, mockInstruments, mockRun

  beforeEach(() => {
    mockInstruments = new Response(Data.OntInstruments).deserialize.instruments

    const rawInstruments = new Response(Data.OntInstruments)._body.data
    store.commit('traction/ont/setInstruments', rawInstruments)

    mockRun = {
      id: 'new',
      instrument_name: '',
      state: '',
      flowcell_attributes: [],
    }
    store.commit('traction/ont/runs/setCurrentRun', mockRun)

    wrapper = mount(ONTRunInformation, {
      store,
      router,
      localVue,
    })
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
      store.commit('traction/ont/runs/setCurrentRun', {
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
