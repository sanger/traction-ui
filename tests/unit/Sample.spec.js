import Sample from '@/components/Sample'
import { mount } from './testHelper'
import Store from '@/store'

describe('Sample.vue', () => {

  let wrapper, aSample, sample, $store

  beforeEach(() => {
    aSample = { id: '1', name: 'DN11111', species: 'cat' }
    $store = Store
    $store.commit('clear')
    $store.commit('addSamples', [aSample])
    wrapper = mount(Sample, { mocks: { $store }, propsData: { sample: aSample }})
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

  it('will update the sample in the store to select on click', () => {
    let input = wrapper.find('input')
    input.setChecked()
    expect($store.getters.selectedSamples.length).toEqual(1)
  })
})
