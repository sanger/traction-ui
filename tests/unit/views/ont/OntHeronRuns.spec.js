import OntHeronRuns from '@/views/ont/OntHeronRuns'
import { mount, localVue } from '../../testHelper'

describe('OntHeronRuns.vue', () => {
  let wrapper, runs, runsData

  beforeEach(() => {
    runsData = [
      { id: 1, state: 'pending' },
      { id: 2, state: 'pending' },
    ]

    wrapper = mount(OntHeronRuns, {
      localVue,
      data() {
        return {
          runs: runsData
        }
      },
      methods: {
        refetchRuns() { return }
      }
    })
    runs = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntHeronRuns')
  })

  it('will have fields', () => {
    let expected = ['id', 'state', 'createdAt']
    expect(runs.fields.map(i => i.key)).toEqual(expected)
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
      runs.redirectToRun = jest.fn()
      let button = wrapper.find('#newRun')
      button.trigger('click')
      expect(runs.redirectToRun).toBeCalled()
    })
  })

})