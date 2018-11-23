import Sample from '@/components/Sample'
import Samples from '../data/samples'
import { mount } from './testHelper'

describe('Sample.vue', () => {

  let wrapper, aSample, sample

  beforeEach(() => {
    aSample = Samples.requests[0]
    wrapper = mount(Sample, { propsData: { sample: aSample }})
    sample = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Sample')
  })

  it('will have a sample', () => {
    expect(sample.sample).toEqual(aSample)
  })

  it('will have a row with sample data', () => {
    let sampleRow = wrapper.find('tr').findAll('td')
    expect(sampleRow.at(0).text()).toEqual("")
    expect(sampleRow.at(1).text()).toEqual("1")
    expect(sampleRow.at(2).text()).toEqual("DN11111")
    expect(sampleRow.at(3).text()).toEqual("cat")
  })

  it('will have a select checkbox', () => {
    let selectElement = wrapper.find('tr').findAll('td').at(0)
    expect(selectElement.contains('input')).toBe(true)
  })

  it('will select samples', () => {
    let input = wrapper.find('input')
    input.setChecked()
    expect(input.element.checked).toEqual(true)
  })
})
