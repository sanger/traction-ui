import ONTSampleIndex from '@/views/ont/ONTSampleIndex.vue'
import { mountWithStore, flushPromises } from '@support/testHelper.js'
import { vi } from 'vitest'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'
import { useOntRequestsStore } from '@/stores/ontRequests.js'

const ontRequestFactory = OntRequestFactory()

vi.mock('@/composables/useLocationFetcher', () => ({
  default: () => ({
    fetchLocations: vi.fn().mockResolvedValue([]),
  }),
}))

const mountComponent = () => {
  const plugins = [
    ({ store }) => {
      if (store.$id === 'root') {
        store.api.traction.ont.requests.get = vi
          .fn()
          .mockResolvedValue(ontRequestFactory.responses.fetch)
      }
    },
  ]
  const { wrapper } = mountWithStore(ONTSampleIndex, {
    plugins,
    createStore: () => useOntRequestsStore(),
  })

  return wrapper
}

describe('OntSampleIndex', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mountComponent()
    await flushPromises()
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of wrapper.vm.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('displays each of the requests', async () => {
      const expectedRequests = ontRequestFactory.content.data.length
      expect(wrapper.findAll('tr').length).toEqual(expectedRequests + 1)
    })
  })

  describe('editing a request', () => {
    it('should show the request in the edit form', async () => {
      const id = Object.keys(ontRequestFactory.storeData)[0]
      const button = wrapper.find(`[data-action="edit-request-${id}"]`)
      await button.trigger('click')
      expect(wrapper.find('[data-type="ont-request-edit"]').exists()).toBe(true)
    })
  })
})
