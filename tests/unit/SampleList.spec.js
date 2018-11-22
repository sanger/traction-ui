import { mount, createLocalVue } from '@vue/test-utils'
import SampleList from '@/components/SampleList'
import Sample from '@/components/Sample'
import Samples from '../data/samples.json'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('SampleList.vue', () => {

  let cmp, sampleList, samples

  beforeEach(() => {
    samples = Samples.requests
    cmp = mount(SampleList, { localVue, propsData: { samples: samples }})
    sampleList = cmp.vm
  })

  it('will have a name', () => {
    expect(cmp.name()).toEqual('SampleList')
  })

  it('will have some samples', () => {
    expect(sampleList.samples.length).toEqual(samples.length)
  })

  it('will have a table', () => {
    expect(cmp.contains('table')).toBe(true)
  })

  it('will have a table of sample rows', async () => {
    expect(cmp.contains(Sample)).toBe(true)
  })

})
