import RequestList from '@/components/RequestList'
import RequestItem from '@/components/RequestItem'
import Samples from '../data/samples'
import { mount } from './testHelper'


describe('RequestList.vue', () => {

  let vm, wrapper, requests

  beforeEach(() => {
    requests = Samples.requests
    wrapper = mount(RequestList, { propsData: { requests: requests }})
    vm = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('RequestList')
  })

  it('will have some requests', () => {
    expect(vm.requests.length).toEqual(requests.length)
  })

  it('will have a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will have a table of request rows', () => {
    expect(wrapper.contains(RequestItem)).toBe(true)
  })
})
