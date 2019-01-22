import RequestItem from '@/components/RequestItem'
import { mount } from '../testHelper'

describe('RequestItem.vue', () => {

  let wrapper, request, requestItem

  beforeEach(() => {
    request = { id: '1', name: 'DN11111', species: 'cat' }
    wrapper = mount(RequestItem, { propsData: request})
    requestItem = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('RequestItem')
  })

  it('will have an id', () => {
    expect(requestItem.id).toEqual('1')
  })

  it('will have a name', () => {
    expect(requestItem.name).toEqual('DN11111')
  })

  it('will have a species', () => {
    expect(requestItem.species).toEqual('cat')
  })

  it('will produce some json', () => {
    // TODO: currently stubbed species from SS
    let json_request = { sequencescape_request_id: request.id, name: request.name, species: request.species }
    expect(requestItem.json).toEqual(json_request)
  })

  it('will have a row with sample data', () => {
    let row = wrapper.find('tr').findAll('td')
    expect(row.at(0).text()).toEqual("")
    expect(row.at(1).text()).toEqual("1")
    expect(row.at(2).text()).toEqual("DN11111")
    expect(row.at(3).text()).toEqual("cat")
  })

  it('will allow selection of requests', () => {
    let input = wrapper.find('input')
    input.trigger('click')
    expect(input.element.checked).toEqual(true)
  })

})
