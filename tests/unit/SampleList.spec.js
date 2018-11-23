import SampleList from '@/components/SampleList'
import Sample from '@/components/Sample'
import Samples from '../data/samples'
import { mount } from './testHelper'


describe('SampleList.vue', () => {

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
    expect(wrapper.contains(Sample)).toBe(true)
  })

  it('getSelectedSamples() returns all selected samples', () => {
    wrapper.findAll('input').at(0).setChecked()
    wrapper.findAll('input').at(1).setChecked()
    expect(vm.getSelectedSamples().length).toEqual(2)
  })
})
