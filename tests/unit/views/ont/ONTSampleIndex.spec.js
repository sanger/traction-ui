import ONTSampleIndex from '@/views/ont/ONTSampleIndex.vue'
import { mount, store, Data, flushPromises } from '@support/testHelper'
import { vi } from 'vitest'

describe('OntSampleIndex', () => {
  let wrapper

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.v1.traction.ont.requests, 'get')
    get.mockReturnValue(Data.TractionOntRequests)

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
      const expectedRequests = Data.TractionOntRequests.data.data.length
      expect(wrapper.findAll('tr').length).toEqual(expectedRequests + 1)
    })
  })
})
