import SampleList from '@/components/_SampleList'
import SampleItem from '@/components/SampleItem'
import Samples from '../data/samples'
import { mount } from './testHelper'


describe.skip('SampleList.vue', () => {

  let vm, wrapper, samples

  beforeEach(() => {
    samples = Samples.requests
    wrapper = mount(SampleList, { propsData: { samples: samples }})
    vm = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('SampleList')
  })

  it('will have some samples', () => {
    expect(vm.samples.length).toEqual(samples.length)
  })

  it('will have a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will have a table of sample rows', () => {
    expect(wrapper.contains(SampleItem)).toBe(true)
  })
})
