import Store from '@/store.js'
import Reception from '@/views/Reception'
import SampleList from '@/components/SampleList'
import flushPromises from 'flush-promises'
import axios from 'axios'
import { mount, localVue } from './testHelper'
import { shallowMount } from '@vue/test-utils'

jest.mock('axios')

describe('Reception.vue', () => {

  let wrapper, reception, response, samples, $store

  beforeEach(() => {
    samples = {
      "requests": [
        { "id": 1, "name": "DN11111", "species": "cat" },
        { "id": 2, "name": "DN11112", "species": "cat" },
        { "id": 3, "name": "DN11113", "species": "dog" },
        { "id": 4, "name": "DN11114", "species": "dog" },
        { "id": 5, "name": "DN11115", "species": "cat" }
      ]
    }
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

  it('#updateStatusJson', async () => {
    await flushPromises()
    $store.commit('selectSample', samples.requests[0])
    $store.commit('selectSample', samples.requests[3])
    await flushPromises()
    expect(reception.updateStatusJson()).toEqual([{id: samples.requests[0].id, state: 'started'}, {id: samples.requests[3].id, state: 'started'}])
  })

  describe('#postSelectedSamples', () => {

    it('resolved', async () => {
      await flushPromises()
      let response = { data: { status: 201} }
      axios.post.mockResolvedValue(response)
      wrapper.find('button').trigger('click')
      await flushPromises()
      expect(reception.postSelectedSamplesResponse).toEqual(response.data)
      expect(axios.post).toBeCalledWith(`${process.env.VUE_APP_TRACTION_API}/v1/samples`, { data: { attributes: { samples: reception.getSelectedSamples()}}}, { headers: 
         { 'Content-Type': 'application/vnd.api+json',
                   'Accept': 'application/vnd.api+json'}
        })
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

  describe('posting status back to sequencescape once sample has been imported into traction', () => {

    it('resolved', async () => {
      await flushPromises()
      let response = { data: { status: 200} }
      axios.patch.mockResolvedValue(response)
      reception.updateStatus()
      await flushPromises()
      expect(reception.updateStatusResponse).toEqual(response.data)
      expect(axios.patch).toBeCalledWith(`${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`, { data: { attributes: { requests: reception.updateStatusJson() }}}, { headers: 
         { 'Content-Type': 'application/vnd.api+json',
                   'Accept': 'application/vnd.api+json'}
        })

    })
  })

})
