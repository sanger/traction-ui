import ONTSampleIndex from '@/views/ont/ONTSampleIndex.vue'
import { mount, store, flushPromises } from '@support/testHelper'
import { vi } from 'vitest'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'

const ontRequestFactory = OntRequestFactory()

vi.mock('@/composables/useLocationFetcher', () => ({
  default: () => ({
    fetchLocations: vi.fn().mockResolvedValue([]),
  }),
}))

describe('OntSampleIndex', () => {
  let wrapper

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.ont.requests, 'get')
    get.mockReturnValue(ontRequestFactory.responses.fetch)

    wrapper = mount(ONTSampleIndex, {
      store,
    })
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
})
