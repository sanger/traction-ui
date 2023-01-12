import ONTRun from '@/views/ont/ONTRun'
import { localVue, mount, store, router } from '@support/testHelper'
import { beforeEach, describe, it } from 'vitest'

describe('ONTRun.vue', () => {
  let wrapper, ontRun

  beforeEach(() => {
    wrapper = mount(ONTRun, {
      store,
      router,
      localVue,
      stubs: {
        ONTRunInstrumentFlowcells: true,
        ONTAddPools: true,
        ONTRunInformation: true,
      },
      propsData: { id: 'new' },
    })
    ontRun = wrapper.vm
  })

  describe('ONTRunInformation', () => {
    it('dispays the run infomation', () => {
      expect(wrapper.findComponent({ ref: 'ONTRunInformation' })).toBeTruthy()
    })
  })

  describe('ONTAddPools', () => {
    it('dispays the pools', () => {
      expect(wrapper.findComponent({ ref: 'ONTAddPools' })).toBeTruthy()
    })
  })

  describe('ONTRunInstrumentFlowcells', () => {
    it('dispays the flowcells', () => {
      expect(wrapper.findComponent({ ref: 'ONTRunInstrumentFlowcells' })).toBeTruthy()
    })
  })

  describe('Back button', () => {
    it('will always show', () => {
      expect(wrapper.find('#backToRunsButton').exists()).toBeTruthy()
      wrapper.find('#backToRunsButton').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/ont/runs')
    })
  })

  describe('#create', () => {
    beforeEach(() => {
      ontRun.showAlert = vi.fn()
      ontRun.createRun = vi.fn()
      ontRun.redirectToRuns = vi.fn()
    })

    it('will show the create button', () => {
      expect(wrapper.find('#create').exists()).toBeTruthy()
    })

    it('calls createRun', async () => {
      ontRun.createRun.mockReturnValue([])

      await ontRun.runAction()
      expect(ontRun.createRun).toBeCalled()
    })

    it('successful', async () => {
      ontRun.createRun.mockReturnValue([])

      await ontRun.runAction()
      expect(ontRun.createRun).toBeCalled()
      expect(ontRun.redirectToRuns).toBeCalled()
    })

    it('unsuccessful', async () => {
      // return whole response object
      ontRun.createRun.mockReturnValue(['this is an error'])

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
})
