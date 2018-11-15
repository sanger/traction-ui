import Vue from 'vue'
import Reception from '@/views/Reception'
import SampleTable from '@/components/SampleTable'
import { mount } from '@vue/test-utils'
import samples from '../data/samples.json'
import Request from '@/services/Sequencescape'
import flushPromises from 'flush-promises'

describe('Reception.vue', () => {

  let cmp, reception

  beforeEach(() => {
    Request.all = jest.fn(() => Promise.resolve({ data: samples}))
  })

  it('will have some samples',  async() => {
    cmp = mount(Reception, {})
    reception = cmp.vm
    await flushPromises()
    expect(reception.samples.length).toEqual(samples.length)
  })
  
  it('will have a sample table', async () => {
    cmp = mount(Reception, {})
    reception = cmp.vm
    await flushPromises()
    expect(reception.$children.length).toBe(1)
    expect(cmp.contains('.sample-table')).toBe(true)
  })

})


