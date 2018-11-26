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
    response = { data: { data: { attributes: samples } } }
    axios.get.mockResolvedValue(response)
  })

  it('will have some samples',  async() => {
    wrapper = mount(Reception, {  mocks: { $store }, localVue })
    reception = wrapper.vm
    await flushPromises()
    expect($store.state.samples.length).toEqual(samples.requests.length)
    expect(reception.samples.length).toEqual(samples.requests.length)
  })

  it('will have a sample list', async () => {
    wrapper = mount(Reception, { localVue })
    expect(wrapper.contains(SampleList)).toBe(true)
  })

  xit('will get a list of selected samples on importSamples()', async () => {
    wrapper = mount(Reception, { localVue })
    reception = wrapper.vm
    await flushPromises()
    wrapper.findAll('input').at(0).setChecked()
    wrapper.findAll('input').at(1).setChecked()
    expect(reception.importSamples().length).toEqual(2)
  })

  xit('importSamples()', async () => {
    response = { data: { status: 201 } }
    axios.post.mockResolvedValue(response)

    wrapper = mount(Reception, { localVue })
    reception = wrapper.vm

    await flushPromises()
    await flushPromises()
    console.log(reception.importSamples())
    expect(reception.importSamples()).toEqual(response)
  })
})
