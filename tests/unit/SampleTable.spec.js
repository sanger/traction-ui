import { mount, createLocalVue } from '@vue/test-utils'
import SampleTable from '@/components/SampleTable'
import Samples from '../data/samples.json'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('SampleTable.vue', () => {

  let cmp, sampleTable, samples

  beforeEach(() => {
    samples = Samples.requests
    cmp = mount(SampleTable, { localVue, propsData: { samples: samples }})
    sampleTable = cmp.vm
  })

  it('will have a name', () => {
    expect(cmp.name()).toEqual('SampleTable')
  })

  it('will have some samples', () => {
    expect(sampleTable.samples.length).toEqual(samples.length)
  })

  it('will have a table', () => {
    expect(cmp.contains('table')).toBe(true)
  })

  it('will fill the table with the samples', () => {
    expect(cmp.find('tbody').findAll('tr').length).toEqual(5)
  })

  it('will have the correct data in each row', () => {
    let tr = cmp.find('tbody').findAll('tr').at(0).findAll('td')
    expect(tr.at(0).element.textContent).toEqual(samples[0].id.toString())
    expect(tr.at(1).element.textContent).toEqual(samples[0].name)
  })

})
