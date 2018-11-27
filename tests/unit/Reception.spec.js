import Store from '@/store.js'
import Reception from '@/views/Reception'
import SampleList from '@/components/SampleList'
import Samples from '../data/samples'
import flushPromises from 'flush-promises'
import axios from 'axios'
import { mount, localVue } from './testHelper'

jest.mock('axios')

describe('Reception.vue', () => {

  let wrapper, reception, response, samples, $store

  beforeEach(() => {
    samples = Samples
    $store = Store
    $store.commit('clear')
    response = { data: { data: { attributes: samples } } }
    axios.get.mockResolvedValue(response)
  })

  it('will have some samples',  async() => {
    wrapper = mount(Reception, { mocks: { $store }, localVue })
    reception = wrapper.vm
    await flushPromises()
    expect($store.state.samples.length).toEqual(samples.requests.length)
    expect(reception.samples.length).toEqual(samples.requests.length)
  })

  it('will have a sample list', async () => {
    wrapper = mount(Reception, { mocks: { $store }, localVue })
    reception = wrapper.vm
    await flushPromises()
    expect(wrapper.contains(SampleList)).toBe(true)
  })

  it('will get a list of selected samples on importSamples()', async () => {
    wrapper = mount(Reception, { mocks: { $store }, localVue })
    reception = wrapper.vm
    await flushPromises()
    $store.commit('selectSample', samples.requests[0])
    $store.commit('selectSample', samples.requests[3])
    let selectedSampleNames = [samples.requests[0].name, samples.requests[3].name]
    expect(reception.importSamples()).toEqual(selectedSampleNames)
  })
})
