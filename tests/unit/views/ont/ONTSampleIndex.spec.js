import ONTSampleIndex from '@/views/ont/ONTSampleIndex.vue'
import { mount, store, Data, flushPromises } from '@support/testHelper'
import { vi } from 'vitest'

describe('OntSampleIndex', () => {
  it('displays each of the requests', async () => {
    const get = vi.spyOn(store.state.api.traction.ont.requests, 'get')
    get.mockResolvedValue(Data.TractionOntRequests)
    const expectedRequests = Data.TractionOntRequests.data.data.length
    const wrapper = mount(ONTSampleIndex, {
      store,
    })
    await flushPromises()
    expect(wrapper.findAll('tr').length).toEqual(expectedRequests + 1)
  })
})
