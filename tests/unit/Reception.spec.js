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
    // Request.prototype.all = jest.fn(() => Promise.resolve(true))
    // await flushPromises()
    // cmp = mount(Reception, {})
    // reception = cmp.vm
  })

  xit('will have a name', () => {
    expect(cmp.name()).toEqual('Reception')
  })

  it('will have some samples', async () => {
    // Request.prototype.all = jest.fn(() => Promise.resolve(true))
    // await flushPromises()
    cmp = mount(Reception, {})
    reception = cmp.vm
    reception.getSamples()
    expect(true).toBeTruthy()
    // expect(reception.samples.length).toEqual(Request.all.length)
  })
  
  xit('will have a sample table', () => {
    expect(reception.$children.length).toBe(1)
    expect(cmp.contains('.sample-table')).toBe(true)
  })

})


