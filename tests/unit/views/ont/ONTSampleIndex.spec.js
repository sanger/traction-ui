import ONTSampleIndex from '@/views/ont/ONTSampleIndex'
import { mount, localVue, store, Data } from '@support/testHelper'
import { vi } from 'vitest'
import flushPromises from 'flush-promises'

const buildWrapper = () =>
  mount(ONTSampleIndex, {
    localVue,
    store,
  })

it('displays each of the requests', async () => {
  const get = vi.spyOn(store.state.api.traction.ont.requests, 'get')
  get.mockResolvedValue(Data.TractionOntRequests)
  const expectedRequests = Data.TractionOntRequests.data.data.length
  const wrapper = buildWrapper()
  await flushPromises()
  expect(wrapper.findAll('li').length).toEqual(expectedRequests)
})
