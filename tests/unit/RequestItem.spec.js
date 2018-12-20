import RequestItem from '@/components/RequestItem'
import { mount } from './testHelper'
// import Store from '@/store'

describe('RequestItem.vue', () => {

  let wrapper, request, requestItem, $store

  beforeEach(() => {
    request = { id: '1', name: 'DN11111', species: 'cat' }
    // $store = Store
    // $store.commit('clear')
    // $store.commit('addRequests', [aSample])
    wrapper = mount(RequestItem, { mocks: { $store }, propsData: { request: request }})
    requestItem = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('RequestItem')
  })

  it('will have a sample', () => {
    expect(requestItem.request).toEqual(request)
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

  xit('will update the sample in the store to select on click', () => {
    let input = wrapper.find('input')
    input.setChecked()
    expect($store.getters.selectedRequests().length).toEqual(1)
  })
})
