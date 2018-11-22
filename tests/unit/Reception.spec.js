import Vue from 'vue'
import Reception from '@/views/Reception'
import SampleList from '@/components/SampleList'
import { mount } from '@vue/test-utils'
import Samples from '../data/samples.json'
import flushPromises from 'flush-promises'
import axios from 'axios'

jest.mock('axios')

describe('Reception.vue', () => {

  let cmp, reception, response, samples, stubs

  beforeEach(() => {
    stubs = { stubs: ['b-table', 'b-button'] }
    samples = Samples
    response = { data: { data: { attributes: samples } } }
    axios.get.mockResolvedValue(response)
  })

  it('will have some samples',  async() => {
    cmp = mount(Reception, stubs)
    reception = cmp.vm
    await flushPromises()
    expect(reception.samples.length).toEqual(samples.requests.length)
  })

  it('will have a sample list', async () => {
    cmp = mount(Reception, stubs)
    expect(cmp.contains(SampleList)).toBe(true)
  })

  it('importSamples()', async () => {
    response = { data: { status: 201 } }
    axios.post.mockResolvedValue(response)

    cmp = mount(Reception, stubs)
    reception = cmp.vm

    await flushPromises()
    await flushPromises()
    console.log(reception.importSamples())
    expect(reception.importSamples()).toEqual(response)
  })
})
