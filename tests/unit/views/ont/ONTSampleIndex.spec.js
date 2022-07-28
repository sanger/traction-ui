import ONTSampleIndex from '@/views/ont/ONTSampleIndex'
import { mount, localVue, store, Data } from '@support/testHelper'

const buildWrapper = () =>
  mount(ONTSampleIndex, {
    localVue,
    store,
  })

it('displays each of the requests', () => {
  const expectedRequests = Data.TractionOntRequests.data.data.length
  const wrapper = buildWrapper()
  expect(wrapper.findAll('li').length).toEqual(expectedRequests)
})
