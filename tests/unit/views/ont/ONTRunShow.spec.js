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
  let wrapper

  describe('new record', () => {
    beforeEach(async () => {
      ;({ wrapper } = mountComponent({ id: 'new' }))
      await flushPromises()
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
    })

    it('contains a update run button', () => {
      expect(wrapper.find('#update')).toBeTruthy()
    })
  })
})
