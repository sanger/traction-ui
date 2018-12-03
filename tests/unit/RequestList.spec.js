import RequestList from '@/components/RequestList'
import RequestItem from '@/components/RequestItem'
import Samples from '../data/samples'
import { mount } from './testHelper'


describe('RequestList.vue', () => {

  let vm, wrapper, samples

  beforeEach(() => {
    samples = Samples.requests
    wrapper = mount(RequestList, { propsData: { samples: samples }})
    vm = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('RequestList')
  })

  it('will have some samples', () => {
    expect(vm.samples.length).toEqual(samples.length)
  })

  it('will have a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will have a table of sample rows', () => {
    expect(wrapper.contains(RequestItem)).toBe(true)
  })
})
