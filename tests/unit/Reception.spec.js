import Vue from 'vue'
import Reception from '@/views/Reception'
import SampleTable from '@/components/SampleTable'
import { mount } from '@vue/test-utils'
import Samples from '../data/samples.json'
import flushPromises from 'flush-promises'
import axios from 'axios'

jest.mock('axios')

describe('Reception.vue', () => {

  let cmp, reception, response, samples

  beforeEach(() => {
    samples = Samples
    response = { data: { data: { attributes: samples } } }
    axios.get.mockResolvedValue(response)
  })

  it('will have some samples',  async() => {
    cmp = mount(Reception, {})
    reception = cmp.vm
    await flushPromises()
    expect(reception.samples.length).toEqual(samples.requests.length)
  })

  it('will have a sample table', async () => {
    cmp = mount(Reception, {})
    reception = cmp.vm
    await flushPromises()
    expect(reception.$children.length).toBe(1)
    expect(cmp.contains('.sample-table')).toBe(true)
  })

})
