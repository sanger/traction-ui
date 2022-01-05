import OntHeronRun from '@/views/ont/OntHeronRun'
import { localVue, mount, store } from 'testHelper'

describe('OntHeronRun.vue', () => {
  let wrapper, run, mutate, query, props

  beforeEach(() => {
    mutate = jest.fn()
    mutate.mockResolvedValue({ flowcells: [] })

    query = jest.fn()
    props = { id: 'new' }

    wrapper = mount(OntHeronRun, {
      localVue,
      store,
      propsData: props,
      stubs: {
        ONTSVG: true,
        OntFlowcell: true,
        OntRunLibrariesList: true,
      },
      mocks: {
        $apollo: {
          mutate: mutate,
          query: query,
        },
      },
    })

    run = wrapper.vm
  })

  describe('components', () => {
    it('has a OntFlowcell component', () => {
      expect(wrapper.findComponent({ ref: 'ontFlowcell' })).toBeTruthy()
    })

    it('has a ONTSVG component', () => {
      expect(wrapper.findComponent({ ref: 'ontSvg' })).toBeTruthy()
    })

    it('has a OntRunLibrariesList component', () => {
      expect(wrapper.findComponent({ ref: 'ontRunLibrariesList' })).toBeTruthy()
    })
  })

  describe('ONT Flowcells', () => {
    it('has the correct number of flowcells', () => {
      let ellipses = wrapper.findAllComponents({ ref: 'ontFlowcell' })
      expect(ellipses.length).toEqual(5)
    })
  })

  describe('props', () => {
    it('must have a id', () => {
      expect(run.id).toEqual('new')
    })
  })

  describe('#Current action button', () => {
    beforeEach(() => {
      run.runAction = jest.fn()
      run.redirectToRuns = jest.fn()
    })

    describe('Create button', () => {
      it('will only show if the record is new', () => {
        expect(wrapper.find('#create-button').text()).toEqual('Create Run')
      })

      it('calls runAction on click', () => {
        let button = wrapper.find('#create-button')
        button.trigger('click')
        expect(run.runAction).toBeCalled()
      })
    })

    describe('Update button', () => {
      beforeEach(() => {
        wrapper.setProps({ id: 1 })
      })

      it('will only show if the record is existing', () => {
        expect(wrapper.find('#update-button').text()).toEqual('Update Run')
      })

      it('calls runAction on click', () => {
        let button = wrapper.find('#update-button')
        button.trigger('click')
        expect(run.runAction).toBeCalled()
      })
    })
  })

  describe('#Cancel button', () => {
    beforeEach(() => {
      run.redirectToRuns = jest.fn()
    })
    describe('Cancel button', () => {
      it('exists', () => {
        expect(wrapper.find('#cancel-button').text()).toEqual('Cancel')
      })

      it('calls runAction on click', () => {
        let button = wrapper.find('#cancel-button')
        button.trigger('click')
        expect(run.redirectToRuns).toBeCalled()
      })
    })
  })

  describe('#runAction', () => {
    beforeEach(() => {
      run.runActionVariables = jest.fn()
      run.showAlert = jest.fn()
    })

    it('redirects on success', async () => {
      run.redirectToRun = jest.fn()

      let mockResponse = { data: { createOntRun: { run: { id: 1 }, errors: [] } } }

      const request = Promise.resolve(mockResponse)
      mutate.mockReturnValue(request)

      await run.runAction()

      expect(mutate).toBeCalled()
      expect(run.redirectToRun).toBeCalledWith(1)
      expect(run.showAlert).toBeCalledWith('Successfully created run with id: 1', 'success')
    })

    it('shows an alert on failure', async () => {
      let mockResponse = { data: { createOntRun: { run: {}, errors: ['this is an error'] } } }

      const request = Promise.resolve(mockResponse)
      mutate.mockReturnValue(request)

      await run.runAction()

      expect(mutate).toBeCalled()
      expect(run.showAlert).toBeCalledWith('Failure: this is an error', 'danger')
    })
  })

  describe('#runActionVariables', () => {
    beforeEach(() => {
      let flowcells = [
        { position: 1, library: { name: 'TRAC-1-1' } },
        { position: 2, library: { name: '' } },
        { position: 3, library: { name: 'TRAC-1-2' } },
        { position: 4, library: { name: '' } },
        { position: 5, library: { name: '' } },
      ]
      wrapper.setData({ flowcellsData: flowcells })
    })

    describe('when it is a newRecord', () => {
      it('returns the expected variables', () => {
        let expected = {
          flowcells: [
            { position: 1, libraryName: 'TRAC-1-1' },
            { position: 3, libraryName: 'TRAC-1-2' },
          ],
        }
        expect(run.runActionVariables()).toEqual(expected)
      })
    })

    describe('when it is not a newRecord', () => {
      it('returns the expected variables', async () => {
        await wrapper.setProps({ id: 1 })

        let expected = {
          id: 1,
          flowcells: [
            { position: 1, libraryName: 'TRAC-1-1' },
            { position: 3, libraryName: 'TRAC-1-2' },
          ],
        }
        expect(run.runActionVariables()).toEqual(expected)
      })
    })
  })

  describe('#buildRun', () => {
    beforeEach(() => {
      run.setRun = jest.fn()
    })

    describe('when it is a newRecord', () => {
      it('calls setRun', () => {
        run.buildRun()
        expect(run.setRun).toBeCalledWith('', [])
      })
    })

    describe('when it is not a newRecord', () => {
      it('calls getRun and setRun', async () => {
        await wrapper.setProps({ id: 1 })

        let returnedRun = { id: 1, flowcells: [{ position: 1, library: { name: 'aName' } }] }
        let mockResponse = { data: { ontRun: returnedRun } }

        const request = Promise.resolve(mockResponse)
        query.mockReturnValue(request)

        await run.buildRun()
        expect(run.setRun).toBeCalledWith(returnedRun.id, returnedRun.flowcells)
      })
    })
  })

  describe('#setRun', () => {
    it('calls the mutation and updates flowcellData', async () => {
      let updatedName = 'newName'
      let position = 2
      let setRun = { flowcells: [{ position: position, library: { name: updatedName } }] }
      let mockResponse = { data: { setRun } }

      const request = Promise.resolve(mockResponse)
      mutate.mockReturnValue(request)

      await run.setRun('', [{ position: position, library: { name: updatedName } }])
      expect(mutate).toBeCalled()
      expect(run.flowcellsData[position - 1].library.name).toEqual(updatedName)
    })

    it('shows an error when the mutation fails', async () => {
      run.showAlert = jest.fn()

      const promise = Promise.reject('It failed')
      mutate.mockReturnValue(promise)

      await run.setRun('', [])
      await expect(mutate).toBeCalled()
      expect(run.showAlert).toBeCalledWith('Failure to build run: It failed', 'danger')
    })
  })
})
