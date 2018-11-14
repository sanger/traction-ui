import Vue from 'vue'
import Reception from '@/views/Reception'
import SampleTable from '@/components/SampleTable'
import { mount } from '@vue/test-utils'
import samples from '../data/samples.json'

describe('Rception.vue', () => {

  let cmp, reception

  beforeEach(() => {
    cmp = mount(Reception, {})
    reception = cmp.vm
  })

  it('lets have a look at what is going on!', () => {
    expect(true).toBeTruthy()
  })

  it('will have a name', () => {
    expect(cmp.name()).toEqual('Reception')
  })

  it('will have some samples', () => {
    expect(reception.samples.length).toEqual(samples.length)
  })
  
  it('will have a sample table', () => {
    expect(reception.$children.length).toBe(1)
    expect(cmp.contains('.sample-table')).toBe(true)
  })

})


