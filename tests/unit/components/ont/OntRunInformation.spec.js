import * as OntRun from '@/api/OntRun'
import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'

describe('ONTRunInformation', () => {
  let wrapper, runInfo, run, instruments

  beforeEach(() => {
    instruments = [
      {
        id: '1',
        type: 'instruments',
        name: 'GXB02004',
        instrument_type: 'GridION',
        max_number_of_flowcells: 5,
      },
      {
        id: '2',
        type: 'instruments',
        name: 'PC24B148',
        instrument_type: 'PromethION',
        max_number_of_flowcells: 24,
      },
    ]
    run = OntRun.build()
    store.commit('traction/ont/run/setCurrentRun', run)
    store.commit('traction/ont/run/setInstruments', instruments)

    wrapper = mount(ONTRunInformation, { localVue, store })
    runInfo = wrapper.vm
  })

  describe('#data', () => {
    it('must have statesList data', () => {
      expect(runInfo.statesList).toEqual(['pending', 'started', 'completed', 'cancelled'])
    })
  })
  describe('#computed', () => {
    it('#mapGetters', () => {
      expect(runInfo.currentRun).toBeDefined()
      expect(runInfo.currentRun.id).toEqual('new')
      expect(runInfo.currentRun.instrument_name).toEqual('')
      expect(runInfo.currentRun.state).toEqual('')
      expect(runInfo.instruments).toEqual(instruments)
    })
    it('#mapState', () => {
      expect(runInfo.currentRun).toBeDefined()
      expect(runInfo.instrumentName).toBeDefined()
      expect(runInfo.instrumentName).toEqual('')
      expect(runInfo.state).toBeDefined()
      expect(runInfo.state).toEqual('')
    })
    it('must have instrumentOptions data', () => {
      expect(runInfo.instrumentOptions).toEqual([
        {
          text: 'Please select an instrument',
          value: null,
          disabled: true,
        },
        {
          text: 'GXB02004',
          value: 'GXB02004',
        },
        {
          text: 'PC24B148',
          value: 'PC24B148',
        },
      ])
    })
    it('must have stateOptions data', () => {
      expect(runInfo.stateOptions).toEqual([
        {
          text: 'Please select a state',
          value: null,
          disabled: true,
        },
        {
          text: 'Pending',
          value: 'pending',
        },
        {
          text: 'Started',
          value: 'started',
        },
        {
          text: 'Completed',
          value: 'completed',
        },
        {
          text: 'Cancelled',
          value: 'cancelled',
        },
      ])
    })
  })

  describe('#methods', () => {
    it('#capitalise', () => {
      expect(runInfo.capitalise('astring')).toEqual('Astring')
    })

    describe('#mapMutations', () => {
      it('#setInstrumentName', () => {
        runInfo.setInstrumentName('gridion')
        expect(runInfo.instrumentName).toEqual('gridion')
      })
      it('#setState', () => {
        runInfo.setState('started')
        expect(runInfo.state).toEqual('started')
      })
    })
  })
})
