import ONTRun from '@/views/ont/ONTRun'
import { mount, store, router, flushPromises, createTestingPinia } from '@support/testHelper'
import { beforeEach, describe, it } from 'vitest'
import { useOntRunsStore } from '@/stores/ontRuns'
import OntRunFactory from '@tests/factories/OntRunFactory.js'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'

const ontRunFactory = OntRunFactory()
const ontPoolFactory = OntPoolFactory()
const ontRunFactoryForSingleRun = OntRunFactory({ count: 1 })

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * props - props to pass to the component
 */
function mountWithStore(props) {
  vi.spyOn(store.state.api.traction.ont.pools, 'get').mockResolvedValue(
    ontPoolFactory.responses.fetch,
  )
  const wrapperObj = mount(ONTRun, {
    global: {
      plugins: [
        createTestingPinia({
          stubActions: false,
          plugins: [
            ({ store }) => {
              if (store.$id === 'root') {
                store.api.traction.ont.instruments.get = vi
                  .fn()
                  .mockReturnValue(ontRunFactory.responses.fetch)
              }
            },
          ],
        }),
      ],
    },
    stubs: {
      DataFetcher: true,
      ONTRunInstrumentFlowcells: true,
      ONTRunInformation: true,
    },
    props,
    store,
    router,
  })
  const storeObj = useOntRunsStore()
  return { wrapperObj, storeObj }
}

describe('ONTRun.vue', () => {
  let wrapper, ontRun

  beforeEach(async () => {
    const { wrapperObj } = mountWithStore({ id: 'new' })
    wrapper = wrapperObj
    ontRun = wrapper.vm
    ontRun.showAlert = vi.fn()
    await flushPromises()
  })

  describe('Back button', () => {
    it('will always show', async () => {
      expect(wrapper.find('#backToRunsButton').exists()).toBeTruthy()
      wrapper.find('#backToRunsButton').trigger('click')
      await flushPromises()
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
      const { wrapperObj } = mountWithStore({ id: '1' })
      wrapper = wrapperObj
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
    beforeEach(async () => {
      const { wrapperObj } = mountWithStore({ id: '1' })
      wrapper = wrapperObj
      ontRun = wrapper.vm
      ontRun.fetchRun = vi.fn(() => ontRunFactoryForSingleRun.responses.fetch)
      ontRun.updateRun = vi.fn()
      ontRun.redirectToRuns = vi.fn()
      ontRun.showAlert = vi.fn()
      await flushPromises()
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
        ontRun.newRun = vi.fn()
        ontRun.setInstruments = vi.fn()
      })

      it('calls sets required data successfully', async () => {
        await ontRun.provider()
        expect(ontRun.newRun).toBeCalled()
        expect(ontRun.setInstruments).toBeCalled()
      })
    })

    describe('when it is an existing run', () => {
      beforeEach(() => {
        const { wrapperObj } = mountWithStore({ id: '1' })
        wrapper = wrapperObj
        ontRun = wrapper.vm

        ontRun.setInstruments = vi.fn(() => Promise.resolve())
        ontRun.fetchRun = vi.fn()
      })

      it('calls sets required data successfully', async () => {
        await ontRun.provider()
        expect(ontRun.fetchRun).toBeCalledWith(1)
        expect(ontRun.setInstruments).toBeCalled()
      })
    })
  })

  describe('#runValid', () => {
    it('returns true when all fields are valid', () => {
      ontRun.currentRun.instrument_name = '1'
      ontRun.currentRun.state = 'active'
      ontRun.currentRun.rebasecalling_process = 'None'
      ontRun.currentRun.flowcell_attributes = [
        { position: '1', flowcell_id: 'ABC1234', tube_barcode: '123', errors: {} },
        // Empty flowcells are fine
        { position: '2', flowcell_id: '', tube_barcode: '', errors: {} },
      ]
      expect(ontRun.runValid).toEqual(true)
    })

    it('returns false when there are invalid fields', () => {
      ontRun.currentRun.instrument_name = '1'
      ontRun.currentRun.state = undefined
      ontRun.currentRun.flowcell_attributes = [
        { position: '1', flowcell_id: 'ABC1234', tube_barcode: '123', errors: {} },
      ]
      expect(ontRun.runValid).toBeFalsy()
    })

    it('returns false when there is a flowcell with a missing value', () => {
      ontRun.currentRun.instrument_name = '1'
      ontRun.currentRun.state = undefined
      ontRun.currentRun.flowcell_attributes = [
        // Valid flowcell
        { position: '1', flowcell_id: 'ABC1234', tube_barcode: '123', errors: {} },
        // Invalid flowcell
        { position: '1', flowcell_id: '', tube_barcode: '123', errors: {} },
      ]
      expect(ontRun.runValid).toBeFalsy()
    })

    it('returns false when there is a flowcell with an error', () => {
      ontRun.currentRun.instrument_name = '1'
      ontRun.currentRun.state = undefined
      ontRun.currentRun.flowcell_attributes = [
        // Valid flowcell
        { position: '1', flowcell_id: 'ABC1234', tube_barcode: '123', errors: {} },
        // Invalid flowcell
        {
          position: '1',
          flowcell_id: 'ABC12355',
          tube_barcode: '123',
          errors: { tube_barcode: 'Enter a valid Pool barcode' },
        },
      ]
      expect(ontRun.runValid).toBeFalsy()
    })
  })
})
