import OntHeronRuns from '@/views/ont/OntHeronRuns'
import OntHeronRun from '@/views/ont/OntHeronRun'
import { mount, localVue, VueRouter } from '../../testHelper'

describe('OntHeronRuns.vue', () => {
  let wrapper, runs, runsData, router

  beforeEach(() => {
    runsData = [
      { id: 1, instrumentName: 'GridION', state: 'pending', deactivatedAt: '' },
      { id: 2, instrumentName: 'GridION', state: 'pending', deactivatedAt: '' },
    ]

    router = new VueRouter({
      routes: [{
        path: '/ont/runs/new',
        name: 'OntHeronRun',
        component: OntHeronRun,
      }]
    })

    wrapper = mount(OntHeronRuns, {
      localVue,
      router,
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

  describe('new run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.contains('button')).toBe(true)
    })

    it('will redirect to the run when newRun is clicked', async () => {
      let button = wrapper.find('#newRun')
      button.trigger('click')
      expect(runs.$route.path).toEqual('/ont/run/new')
    })
  })

})