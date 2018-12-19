import Store from '@/store.js'
import Reception from '@/views/Reception'
import RequestList from '@/components/RequestList'
import Alert from '@/components/Alert'
import flushPromises from 'flush-promises'
import axios from 'axios'
import { mount, localVue } from './testHelper'

jest.mock('axios')

describe.skip('Reception.vue', () => {

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

  it('will have a request list', async () => {
    await flushPromises()
    expect(wrapper.contains(RequestList)).toBe(true)
  })

  it('#created', async () => {
    await flushPromises()
    expect($store.state.requests.length).toEqual(samples.requests.length)
    expect(axios.get).toBeCalledWith(`/api/v2/requests?filter[state]=pending&filter[request_type]=long_read`, Request.options)
  })

  describe.skip('#postSelectedRequests', () => {
    const headers = {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }

    it('resolved', async () => {
      await flushPromises()
      let response = { data: { status: 201} }
      axios.post.mockResolvedValue(response)
      wrapper.find('#exportRequestsButton').trigger('click')
      await flushPromises()

      expect(axios.post).toBeCalledWith(
        `${process.env.VUE_APP_TRACTION_API}/v1/samples`,
        { data: { attributes: { samples: reception.getSelectedRequests() }}},
        { headers: headers }
      )
    })

    it('rejected', async () => {
      await flushPromises()
      let response = { response: { data: { errors: [{ status: 422}]} } }
      axios.post.mockRejectedValue(response)
      wrapper.find('#exportRequestsButton').trigger('click')
      await flushPromises()

      expect(axios.post).toBeCalledWith(
        `${process.env.VUE_APP_TRACTION_API}/v1/samples`,
        { data: { attributes: { samples: reception.getSelectedRequests() }}},
        { headers: headers }
      )
    })
  })
// posting status back to sequencescape once sample has been imported into traction
  describe.skip('#updateRequestStatusInSS', () => {
    const headers = {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }

    it('resolved', async () => {
      await flushPromises()
      let response = { data: { status: 200} }
      axios.patch.mockResolvedValue(response)
      reception.updateRequestStatusInSS()
      await flushPromises()

      expect(axios.patch).toBeCalledWith(
        `${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`,
        { data: { attributes: { requests: reception.updateStatusJson() }}},
        { headers: headers }
      )
      // expect(wrapper.find('#showAlert').text()).toContain('200')
    })

    it('rejected', async () => {
      await flushPromises()
      let response = { response: { data: { errors: [{ status: 422}]} } }
      axios.patch.mockRejectedValue(response)
      reception.updateRequestStatusInSS()
      await flushPromises()
      
      expect(axios.patch).toBeCalledWith(
        `${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`,
        { data: { attributes: { requests: reception.updateStatusJson() }}},
        { headers: headers }
      )
      // expect(wrapper.find('#showAlert').text()).toContain('422')
    })
  })

  it('#getSelectedRequests()', async () => {
    await flushPromises()
    $store.commit('selectRequest', samples.requests[0])
    $store.commit('selectRequest', samples.requests[3])
    let selectedRequest = [samples.requests[0], samples.requests[3]]
    expect(reception.getSelectedRequests().length).toEqual(selectedRequest.length)
  })

  it('#updateStatusJson', async () => {
    await flushPromises()
    $store.commit('selectRequest', samples.requests[0])
    $store.commit('selectRequest', samples.requests[3])
    await flushPromises()
    expect(reception.updateStatusJson()).toEqual([{id: samples.requests[0].id, state: 'started'}, {id: samples.requests[3].id, state: 'started'}])
  })

  describe.skip('alert', () => {
    it('has a hidden alert', async () => {
      await flushPromises()
      expect(wrapper.contains('.showAlert')).toBe(false)
    })

    xit('shows a successful alert on resolved', async () => {
      await flushPromises()
      let response = { data: { status: 201} }
      axios.post.mockResolvedValue(response)
      wrapper.find('#exportRequestsButton').trigger('click')
      await flushPromises()
      expect(wrapper.contains(Alert)).toBe(true)
      expect(wrapper.find('#showAlert').text()).toContain('201')
      expect(wrapper.contains('.alert-success')).toBe(true)
    })

    xit('shows a danger alert on rejected', async () => {
      await flushPromises()
      let response = { response: { data: { errors: [{ status: 422}]} } }
      axios.post.mockRejectedValue(response)
      wrapper.find('#exportRequestsButton').trigger('click')
      await flushPromises()
      expect(wrapper.contains(Alert)).toBe(true)
      expect(wrapper.find('#showAlert').text()).toContain('422')
      expect(wrapper.contains('.alert-danger')).toBe(true)
    })
  })

})
