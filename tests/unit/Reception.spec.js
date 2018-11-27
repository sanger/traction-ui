import Store from '@/store.js'
import Reception from '@/views/Reception'
import SampleList from '@/components/SampleList'
import Samples from '../data/samples'
import flushPromises from 'flush-promises'
import axios from 'axios'
import { mount, localVue } from './testHelper'
import { shallowMount } from '@vue/test-utils'

jest.mock('axios')

describe('Reception.vue', () => {

  let wrapper, reception, response, samples, $store

  beforeEach(() => {
    samples = Samples
    $store = Store
    $store.commit('clear')
    response = { data: { data: { attributes: samples } } }
    axios.get.mockResolvedValue(response)

    wrapper = mount(Reception, { mocks: { $store }, localVue })
    reception = wrapper.vm
  })

  it('will have some samples',  async() => {
    await flushPromises()
    expect($store.state.samples.length).toEqual(samples.requests.length)
    expect(reception.samples.length).toEqual(samples.requests.length)
  })

  it('will have a sample list', async () => {
    await flushPromises()
    expect(wrapper.contains(SampleList)).toBe(true)
  })

  it('#getSelectedSamples()', async () => {
    await flushPromises()
    $store.commit('selectSample', samples.requests[0])
    $store.commit('selectSample', samples.requests[3])
    let selectedSample = [samples.requests[0], samples.requests[3]]
    expect(reception.getSelectedSamples()).toEqual(selectedSample)
  })

  describe('#postSelectedSamples', () => {

    it('resolved', async () => {
      await flushPromises()
      let response = { data: { status: 201} }
      axios.post.mockResolvedValue(response)
      wrapper.find('button').trigger('click')
      await flushPromises()
      expect(reception.postSelectedSamplesResponse).toEqual(response.data)
    })

    it('rejected', async () => {
      await flushPromises()
      let response = { data: { status: 422} }
      axios.post.mockRejectedValue(response)
      wrapper.find('button').trigger('click')
      await flushPromises()
      expect(reception.postSelectedSamplesResponse).toEqual(response.data)

    })
  })

})
