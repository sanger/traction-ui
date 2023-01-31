import ONTRun from '@/views/ont/ONTRun'
import { localVue, mount, store, router } from '@support/testHelper'
import { beforeEach, describe, it } from 'vitest'

describe('ONTRun.vue', () => {
  let wrapper, ontRun, stubs

  beforeEach(() => {
    stubs = {
      DataFetcher: true,
      ONTRunInstrumentFlowcells: true,
      ONTRunInformation: true,
    }

    wrapper = mount(ONTRun, {
      store,
      router,
      localVue,
      stubs: stubs,
      propsData: { id: 'new' },
    })
    ontRun = wrapper.vm
    ontRun.showAlert = vi.fn()
  })

  describe('Back button', () => {
    it('will always show', () => {
      expect(wrapper.find('#backToRunsButton').exists()).toBeTruthy()
      wrapper.find('#backToRunsButton').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/ont/runs')
    })
  })

  describe('Reset button', () => {
    it('will show if the record is new', () => {
      expect(wrapper.find('#resetButton').exists()).toBeTruthy()
    })
  })

  describe('ONTRunInformation', () => {
    it('dispays the run infomation', () => {
      expect(wrapper.findComponent({ ref: 'ONTRunInformation' })).toBeTruthy()
    })
  })

  describe('ONTRunInstrumentFlowcells', () => {
    it('dispays the flowcells', () => {
      expect(wrapper.findComponent({ ref: 'ONTRunInstrumentFlowcells' })).toBeTruthy()
    })
  })

  describe('#props', () => {
    it('has the required props', () => {
      expect(ontRun.id).toEqual('new')
    })
  })

  describe('#newRecord', () => {
    it('returns true when run is a new record', () => {
      expect(ontRun.newRecord).toEqual(true)
    })
    it('returns false when currentRun is not a new record', () => {
      wrapper = mount(ONTRun, {
        store,
        router,
        localVue,
        stubs: stubs,
        propsData: { id: '1' },
      })
      ontRun = wrapper.vm
      expect(ontRun.newRecord).toEqual(false)
    })
  })

  describe('#createRun', () => {
    beforeEach(() => {
      ontRun.createRun = vi.fn()
      ontRun.redirectToRuns = vi.fn()
    })

    it('contains a create new run button', () => {
      expect(wrapper.find('#create')).toBeTruthy()
      expect(wrapper.find('#create').element.disabled).toBe(true)
      expect(wrapper.find('#create').text()).toBe('Create')
    })

    it('currentAction returns create', () => {
      expect(ontRun.currentAction).toEqual({
        id: 'create',
        theme: 'create',
        label: 'Create',
        method: 'createRun',
      })
    })

    it('successful', async () => {
      ontRun.createRun.mockReturnValue({ success: true })

      await ontRun.runAction()
      expect(ontRun.createRun).toBeCalled()
      expect(ontRun.redirectToRuns).toBeCalled()
    })

    it('unsuccessful', async () => {
      // return whole response object
      ontRun.createRun.mockReturnValue({ errors: 'this is an error' })

      await ontRun.runAction()
      expect(ontRun.createRun).toBeCalled()
      expect(ontRun.showAlert).toBeCalledWith(
        'Failed to create run in Traction: this is an error',
        'danger',
        'run-validation-message',
      )
      expect(ontRun.redirectToRuns).not.toBeCalled()
    })
  })

  describe('#updateRun', () => {
    beforeEach(() => {
      wrapper = mount(ONTRun, {
        store,
        router,
        localVue,
        stubs: stubs,
        propsData: { id: '1' },
      })
      ontRun = wrapper.vm

      ontRun.updateRun = vi.fn()
      ontRun.redirectToRuns = vi.fn()
      ontRun.showAlert = vi.fn()
    })
    it('contains a update new run button', () => {
      expect(wrapper.find('#update')).toBeTruthy()
      expect(wrapper.find('#update').text()).toBe('Update')
    })

    it('currentAction returns update', () => {
      expect(ontRun.currentAction).toEqual({
        id: 'update',
        theme: 'update',
        label: 'Update',
        method: 'updateRun',
      })
    })

    it('successful', async () => {
      ontRun.updateRun.mockReturnValue({ success: true })

      await ontRun.runAction()
      expect(ontRun.updateRun).toBeCalled()
      expect(ontRun.redirectToRuns).toBeCalled()
    })

    it('unsuccessful', async () => {
      ontRun.updateRun.mockReturnValue({ errors: 'this is an error' })

      await ontRun.runAction()
      expect(ontRun.updateRun).toBeCalled()
      expect(ontRun.showAlert).toBeCalledWith(
        'Failed to update run in Traction: this is an error',
        'danger',
        'run-validation-message',
      )
      expect(ontRun.redirectToRuns).not.toBeCalled()
    })
  })

  describe('#provider', () => {
    describe('when it is a new run', () => {
      beforeEach(() => {
        ontRun.fetchOntPools = vi.fn()
        ontRun.newRun = vi.fn()
        ontRun.setInstruments = vi.fn()
      })

      it('calls fetchOntPools successfully', async () => {
        await ontRun.provider()
        expect(ontRun.fetchOntPools).toBeCalled()
        expect(ontRun.newRun).toBeCalled()
        expect(ontRun.setInstruments).toBeCalled()
      })
    })

    describe('when it is an existing run', () => {
      beforeEach(() => {
        wrapper = mount(ONTRun, {
          store,
          router,
          localVue,
          stubs: stubs,
          propsData: { id: '1' },
        })
        ontRun = wrapper.vm

        ontRun.fetchOntPools = vi.fn()
        ontRun.setInstruments = vi.fn(() => Promise.resolve())
        ontRun.fetchRun = vi.fn()
      })

      it('calls fetchOntPools successfully', async () => {
        await ontRun.provider()
        expect(ontRun.fetchOntPools).toBeCalled()
        expect(ontRun.fetchRun).toBeCalledWith(1)
        expect(ontRun.setInstruments).toBeCalled()
      })
    })
  })
})
