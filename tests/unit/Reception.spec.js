import Store from '@/store.js'
import Reception from '@/views/Reception'
import SampleList from '@/components/SampleList'
import Alert from '@/components/Alert'
import flushPromises from 'flush-promises'
import axios from 'axios'
import { mount, localVue } from './testHelper'

jest.mock('axios')

describe('Reception.vue', () => {

  let wrapper, reception, response, samples, $store

  beforeEach(() => {
    samples = {
      "requests": [
        { "id": 1, "attributes": { "name": "DN11111", "species": "cat" }},
        { "id": 2, "attributes": { "name": "DN11112", "species": "cat" }},
        { "id": 3, "attributes": { "name": "DN11113", "species": "dog" }},
        { "id": 4, "attributes": { "name": "DN11114", "species": "dog" }},
        { "id": 5, "attributes": { "name": "DN11115", "species": "cat" }}
      ]
    }
    $store = Store
    $store.commit('clear')
    response = { data: { data: samples.requests } }
    axios.get.mockResolvedValue(response)

    wrapper = mount(Reception, { mocks: { $store }, localVue })
    reception = wrapper.vm
  })

  it('will have a sample list', async () => {
    await flushPromises()
    expect(wrapper.contains(SampleList)).toBe(true)
  })

  it('#getSamples()',  async() => {
    await flushPromises()
    expect($store.state.samples.length).toEqual(samples.requests.length)
    expect(reception.samples.length).toEqual(samples.requests.length)
  })

  it('#buildSamplesFromResponseHelper()', async () => {
    await flushPromises()
    let data = samples.requests
    let buildSamples = [{"id": 1, "name": "DN11111", "species": "cat"},
      {"id": 2, "name": "DN11112", "species": "cat"},
      {"id": 3, "name": "DN11113", "species": "dog"},
      {"id": 4, "name": "DN11114", "species": "dog"},
      {"id": 5, "name": "DN11115", "species": "cat"}
    ]
    expect(reception.buildSamplesFromResponseHelper(data)).toEqual(buildSamples)
  })

  describe('#postSelectedSamples', () => {
    const headers = {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }

    it('resolved', async () => {
      await flushPromises()
      let response = { data: { status: 201} }
      axios.post.mockResolvedValue(response)
      wrapper.find('#exportSamplesButton').trigger('click')
      await flushPromises()

      expect(axios.post).toBeCalledWith(
        `${process.env.VUE_APP_TRACTION_API}/v1/samples`,
        { data: { attributes: { samples: reception.getSelectedSamples() }}},
        { headers: headers }
      )
    })

    it('rejected', async () => {
      await flushPromises()
      let response = { response: { data: { errors: [{ status: 422}]} } }
      axios.post.mockRejectedValue(response)
      wrapper.find('#exportSamplesButton').trigger('click')
      await flushPromises()
      expect(axios.post).toBeCalledWith(
        `${process.env.VUE_APP_TRACTION_API}/v1/samples`,
        { data: { attributes: { samples: reception.getSelectedSamples() }}},
        { headers: headers }
      )
    })
  })
// posting status back to sequencescape once sample has been imported into traction
  describe('#updateSampleStatusInSS', () => {
    const headers = {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }

    it('resolved', async () => {
      await flushPromises()
      let response = { data: { status: 200} }
      axios.patch.mockResolvedValue(response)
      reception.updateSampleStatusInSS()
      await flushPromises()
      expect(axios.patch).toBeCalledWith(
        `${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`,
        { data: { attributes: { requests: reception.updateStatusJson() }}},
        { headers: headers }
      )
      expect(wrapper.find('#showAlert').text()).toContain('200')
    })

    it('rejected', async () => {
      await flushPromises()
      let response = { response: { data: { errors: [{ status: 422}]} } }
      axios.patch.mockRejectedValue(response)
      reception.updateSampleStatusInSS()
      await flushPromises()
      expect(axios.patch).toBeCalledWith(
        `${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`,
        { data: { attributes: { requests: reception.updateStatusJson() }}},
        { headers: headers }
      )
      expect(wrapper.find('#showAlert').text()).toContain('422')
    })
  })

  it('#getSelectedSamples()', async () => {
    await flushPromises()
    $store.commit('selectSample', samples.requests[0])
    $store.commit('selectSample', samples.requests[3])
    let selectedSample = [samples.requests[0], samples.requests[3]]
    expect(reception.getSelectedSamples().length).toEqual(selectedSample.length)
  })

  it('#updateStatusJson', async () => {
    await flushPromises()
    $store.commit('selectSample', samples.requests[0])
    $store.commit('selectSample', samples.requests[3])
    await flushPromises()
    expect(reception.updateStatusJson()).toEqual([{id: samples.requests[0].id, state: 'started'}, {id: samples.requests[3].id, state: 'started'}])
  })

  describe('alert', () => {
    it('has a hidden alert', async () => {
      await flushPromises()
      expect(wrapper.contains('.showAlert')).toBe(false)
    })

    it('shows a successful alert on resolved', async () => {
      await flushPromises()
      let response = { data: { status: 201} }
      axios.post.mockResolvedValue(response)
      wrapper.find('#exportSamplesButton').trigger('click')
      await flushPromises()
      expect(wrapper.contains(Alert)).toBe(true)
      expect(wrapper.find('#showAlert').text()).toContain('201')
      expect(wrapper.contains('.alert-success')).toBe(true)
    })

    it('shows a danger alert on rejected', async () => {
      await flushPromises()
      let response = { response: { data: { errors: [{ status: 422}]} } }
      axios.post.mockRejectedValue(response)
      wrapper.find('#exportSamplesButton').trigger('click')
      await flushPromises()
      expect(wrapper.contains(Alert)).toBe(true)
      expect(wrapper.find('#showAlert').text()).toContain('422')
      expect(wrapper.contains('.alert-danger')).toBe(true)
    })
  })

})
