import SampleItem from '@/components/SampleItem'
import { mount } from './testHelper'
import Store from '@/store'

describe('SampleItem.vue', () => {

  let wrapper, sample, sampleItem, $store

  beforeEach(() => {
    sample = { id: '1', name: 'DN11111', species: 'cat', state: 'pending' }
    wrapper = mount(SampleItem, { mocks: { $store }, propsData: sample})
    sampleItem = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('SampleItem')
  })

  it('will have an id', () => {
    expect(sampleItem.id).toEqual('1')
  })

  it('will have a name', () => {
    expect(sampleItem.name).toEqual('DN11111')
  })

  it('will have a species', () => {
    expect(sampleItem.species).toEqual('cat')
  })

  it('will have a state', () => {
    expect(sampleItem.state).toEqual('pending')
  })

  it('will produce some json', () => {
    expect(sampleItem.json).toEqual(sample)
  })

  it('will have a row with sample data', () => {
    let row = wrapper.find('tr').findAll('td')
    expect(row.at(0).text()).toEqual("")
    expect(row.at(1).text()).toEqual("1")
    expect(row.at(2).text()).toEqual("DN11111")
    expect(row.at(3).text()).toEqual("cat")
    expect(row.at(4).text()).toEqual("pending")
  })

  it('will allow selection of samples', () => {
    let input = wrapper.find('input')
    input.trigger('click')
    expect(input.element.checked).toEqual(true)
  })
})
