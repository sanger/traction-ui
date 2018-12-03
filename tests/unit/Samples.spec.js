import Samples from '@/views/Samples'
import SampleList from '@/components/SampleList'
import { mount } from './testHelper'
import Store from '@/store'
import flushPromises from 'flush-promises'
import axios from 'axios'

jest.mock('axios')

describe('Samples.vue', () => {

  let wrapper, $store, samples, vm

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
    let response = { data: { data: samples.requests } }
    axios.get.mockResolvedValue(response)
    wrapper = mount(Samples, { mocks: { $store }})
    vm = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Samples')
  })

  it('#getSamples()', async () => {
    await flushPromises()
    expect($store.state.samples.length).toEqual(samples.requests.length)
    expect(vm.samples.length).toEqual(samples.requests.length)
  })

  it('will have a sample list', async () => {
    await flushPromises()
    expect(wrapper.contains(SampleList)).toBe(true)
  })

})
