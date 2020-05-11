import OntHeronRuns from '@/views/ont/OntHeronRuns'
import { mount, localVue } from '../../testHelper'

describe('OntHeronRuns.vue', () => {
  let wrapper, runs, runsData

  beforeEach(() => {
    runsData = [
      { id: 1, instrumentName: 'GridION', state: 'pending', deactivatedAt: '' },
      { id: 2, instrumentName: 'GridION', state: 'pending', deactivatedAt: '' },
    ]

    wrapper = mount(OntHeronRuns, {
      localVue,
      data() {
        return {
          runs: runsData
        }
      }
    })
    runs = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntHeronRuns')
  })

  it('will have fields', () => {
    let expected = ['id', 'instrumentName', 'state', 'deactivatedAt']
    expect(runs.fields).toEqual(expected)
  })

  it('will have a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will have a table with runs', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(runsData.length)
  })

})