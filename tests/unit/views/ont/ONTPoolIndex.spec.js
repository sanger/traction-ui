import ONTPoolIndex from '@/views/ONT/ONTPoolIndex.vue'
import { mount, localVue, store, Data } from '@support/testHelper'
import { vi } from 'vitest'
import flushPromises from 'flush-promises'

const buildWrapper = () =>
  mount(ONTPoolIndex, {
    localVue,
    store,
  })

it('displays each of the requests', async () => {
  const get = vi.spyOn(store.state.api.traction.ont.pools, 'get')
  get.mockResolvedValue(Data.TractionOntPools)
  const expectedRequests = Data.TractionOntRequests.data.data.length
  const wrapper = buildWrapper()
  await flushPromises()
  expect(wrapper.findAll('li').length).toEqual(expectedRequests)
})
