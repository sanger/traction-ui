import OntHeronRuns from '@/views/ont/OntHeronRuns'
import { localVue, mount } from '../../testHelper'

describe('OntHeronRuns.vue', () => {
  let wrapper, runs, runsData

  beforeEach(() => {
    runsData = [
      {
        id: 1,
        experimentName: 'run1',
        flowcells: [{ library: { name: 'libName1' } }],
        createdAt: '2020-05-13 11:00:00 UTC'
      },
      {
        id: 2,
        experimentName: 'run2',
        flowcells: [{ library: { name: 'libName2' } }],
        createdAt: '2020-05-10 10:00:00 UTC'
      },
      {
        id: 3,
        experimentName: 'run3',
        flowcells: [{ library: { name: 'libName3' } }],
        createdAt: '2020-05-10 10:00:00 UTC'
      }
    ]

    // create the mock of the method before mounting it for testing
    jest.spyOn(OntHeronRuns.methods, 'getRuns').mockImplementation(() => runsData)

    wrapper = mount(OntHeronRuns, {
      localVue,
      mocks: {
        $apollo: {
          queries: {
            runs: {
              refetch: jest.fn()
            }
          }
        }
      },
      data() {
        return {
          runs: runsData
        }
      }
    })
    runs = wrapper.vm
  })

  it('will have fields', () => {
    let expected = ['experimentName', 'libraryNames', 'updatedAt', 'actions']
    expect(runs.fields).toEqual(expected)
  })

  it('will have a table', () => {
    expect(wrapper.find('table').exists()).toBeTruthy()
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
