import * as OntRun from '@/api/OntRun'
import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'

describe('ONTRunInformation', () => {
  let wrapper, runInfo, run

  beforeEach(() => {
    run = OntRun.build()
    store.commit('traction/ont/runs/setCurrentRun', run)

    wrapper = mount(ONTRunInformation, { localVue, store })
    runInfo = wrapper.vm
  })

  describe('#data', () => {
    it('must have statesList data', () => {
      expect(runInfo.statesList).toEqual(['pending', 'started', 'completed', 'cancelled'])
    })
    it('must have instrumentTypes data', () => {
      expect(runInfo.instrumentTypes).toEqual(['minion', 'gridion', 'promethion'])
    })
  })
  describe('#computed', () => {
    it('#mapGetters', () => {
      expect(runInfo.currentRun).toBeDefined()
      expect(runInfo.currentRun.id).toEqual('new')
      expect(runInfo.currentRun.instrument_name).toEqual('')
      expect(runInfo.currentRun.state).toEqual('')
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
          text: 'Minion',
          value: 'minion',
        },
        {
          text: 'Gridion',
          value: 'gridion',
        },
        {
          text: 'Promethion',
          value: 'promethion',
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
