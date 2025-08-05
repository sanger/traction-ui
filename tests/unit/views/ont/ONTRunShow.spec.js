import ONTRunShow from '@/views/ont/ONTRunShow.vue'
import { flushPromises, mountWithStore } from '@support/testHelper.js'
import { beforeEach, describe, it } from 'vitest'
import { useOntRunCreateStore } from '@/stores/ontRunCreate.js'
import OntRunFactory from '@tests/factories/OntRunFactory.js'
import OntInstrumentFactory from '@tests/factories/OntInstrumentFactory.js'

const ontRunFactoryForSingleRun = OntRunFactory({ count: 1 })
const ontInstrumentFactory = OntInstrumentFactory()

const mountComponent = (props) => {
  const plugins = [
    ({ store }) => {
      if (store.$id === 'root') {
        ;((store.api.traction.ont.instruments.get = vi
          .fn()
          .mockReturnValue(ontInstrumentFactory.responses.fetch)),
          (store.api.traction.ont.runs.find = vi.fn(
            () => ontRunFactoryForSingleRun.responses.fetch,
          )))
      }
    },
  ]
  const { wrapper, store } = mountWithStore(ONTRunShow, {
    plugins,
    props,
    createStore: () => useOntRunCreateStore(),
  })
  return { wrapper, store }
}

describe('ONTRun.vue', () => {
  let wrapper, ontRun

  describe('new record', () => {
    beforeEach(async () => {
      ;({ wrapper } = mountComponent({ id: 'new' }))
      await flushPromises()
      ontRun = wrapper.vm
    })

    it('will have a back button', () => {
      expect(wrapper.find('#backToRunsButton').exists()).toBeTruthy()
    })

    it('will have a reset button', () => {
      expect(wrapper.find('#resetButton').exists()).toBeTruthy()
    })

    it('will have a create button', () => {
      expect(wrapper.find('#create').exists()).toBeTruthy()
      expect(wrapper.find('#create').element.disabled).toBe(true)
    })
  })

  describe('#updateRun', () => {
    beforeEach(async () => {
      ;({ wrapper } = mountComponent({ id: '1' }))
      await flushPromises()
      ontRun = wrapper.vm
    })

    it('contains a update run button', () => {
      expect(wrapper.find('#update')).toBeTruthy()
    })
  })

  // move to e2e tests
  describe.skip('#runValid', () => {
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
