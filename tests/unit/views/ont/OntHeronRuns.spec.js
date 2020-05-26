import OntHeronRuns from '@/views/ont/OntHeronRuns'
import { mount, localVue } from '../../testHelper'

describe('OntHeronRuns.vue', () => {
  let wrapper, runs, runsData

  beforeEach(() => {
    runsData = [
      { id: 1, createdAt: '2020-05-13 11:00:00 UTC' },
      { id: 2, createdAt: '2020-05-10 10:00:00 UTC' },
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
    let expected = ['experimentName', 'library_names', 'updatedAt', 'actions']
    expect(runs.fields.map(i => i.key)).toEqual(expect.arrayContaining(expected))
  })

  it('will have a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will have a table with runs', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(runsData.length)
  })

  describe('new run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.find('#newRun').text()).toEqual('New Run')
    })

    it('will redirect to the run when newRun is clicked', async () => {
      runs.redirectToRun = jest.fn()
      let button = wrapper.find('#newRun')
      button.trigger('click')
      expect(runs.redirectToRun).toBeCalled()
    })
  })

  describe('Edit run button', () => {
    it('contains a edit run button', () => {
      expect(wrapper.find('#editRun-1').text()).toEqual('Edit')
    })

    it('will redirect to the run when newRun is clicked', async () => {
      runs.redirectToRun = jest.fn()
      let button = wrapper.find('#editRun-1')
      button.trigger('click')
      expect(runs.redirectToRun).toBeCalledWith(1)
    })
  })

})