import OntHeronRun from '@/views/ont/OntHeronRun'
import OntRunLibrariesList from '@/components/ont/OntRunLibrariesList'
import ONTSVG from '@/components/svg/ONTSVG'
import OntFlowcell from '@/components/ont/OntFlowcell'
import Alert from '@/components/Alert'
import { localVue, mount } from '../../testHelper'

describe('OntHeronRun.vue', () => {
  let wrapper, run, mutate

  beforeEach(() => {
    mutate = jest.fn()

    wrapper = mount(OntHeronRun, {
      localVue,
      stubs: {
        ONTSVG: true,
        OntFlowcell: true
      },
      mocks: {
        $apollo: {
          mutate: mutate
        }
      },
      data() {
        return {
          run: {}
        }
      },
      methods: {
        setRun() { return }
      },
      propsData: { id: 'new' }
    })

    run = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntHeronRun')
  })

  describe('components', () => {
    it('has a OntFlowcell component', () => {
      expect(wrapper.contains(OntFlowcell)).toBe(true)
    })

    it('has a ONTSVG component', () => {
      expect(wrapper.contains(ONTSVG)).toBe(true)
    })

    it('has a OntRunLibrariesList component', () => {
      expect(wrapper.contains(OntRunLibrariesList)).toBe(true)
    })

    it('has a Alert component', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  describe('ONT Flowcells', () => {
    it('has the correct number of flowcells', () => {
      let ellipses = wrapper.findAll(OntFlowcell)
      expect(ellipses.length).toEqual(5)
    })
  })

  describe('#createRun', () => {
    let button

    beforeEach(() => {
      button = wrapper.find('#create-run')

      let flowcells = [
        {
          position: 1,
          library: {
            name: 'TRAC-1-1'
          }
        }
      ]
      wrapper.setData({ run: { flowcells: flowcells } })

      run.showAlert = jest.fn()
    })

    it('has a create button', () => {
      expect(button.text()).toEqual('Create Run')
    })

    it('redirects on success', async () => {
      run.redirectToRuns = jest.fn()

      let mockResponse = { data: { createCovidRun: { run: { id: 1 }, errors: [] } } }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      await button.trigger('click')

      expect(mutate).toBeCalled()
      expect(run.redirectToRuns).toBeCalled()

    })

    it('shows an alert on failure', async () => {
      let mockResponse = { data: { createCovidRun: { run: {}, errors: ['this is an error'] } } }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      await button.trigger('click')

      expect(mutate).toBeCalled()
      expect(run.showAlert).toBeCalledWith('Failure: this is an error', 'danger')
    })
  })

  describe('#buildFlowcells', () => {
    it('build the flowcells for a new run', () => {
      expect(run.buildFlowcells().length).toEqual(5)
    })
  })

  describe('#buildRun', () => {
    it.skip('calls the mutation to build a new run', () => {
      run.buildNewRun
      expect(mutate).toBeCalled()
    })
  })

})