import RequestItem from '@/components/RequestItem'
import { mount } from '../testHelper'

describe('RequestItem.vue', () => {

  let wrapper, request, requestItem

  beforeEach(() => {
    request = { id: '1', name: 'DN11111', sample_common_name: 'cat', sanger_sample_id: '123', state: 'pending' }
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

  it('will have a sample common name', () => {
    expect(requestItem.sample_common_name).toEqual('cat')
  })

  it('will have a sanger sample id', () => {
    expect(requestItem.sanger_sample_id).toEqual('123')
  })

  it('will have a state', () => {
    expect(requestItem.state).toEqual('pending')
  })

  it('will produce some json', () => {
    // TODO: currently stubbed species from SS
    let json_request = { sequencescape_request_id: request.id, name: request.name, species: request.sample_common_name }
    expect(requestItem.json).toEqual(json_request)
  })

  it('will have a row with sample data', () => {
    let row = wrapper.find('tr').findAll('td')
    expect(row.at(0).text()).toEqual("")
    expect(row.at(1).text()).toEqual("1")
    expect(row.at(2).text()).toEqual("DN11111")
    expect(row.at(3).text()).toEqual("cat")
    expect(row.at(4).text()).toEqual("123")
    expect(row.at(5).text()).toEqual("pending")
  })

  it('will allow selection of requests', () => {
    let input = wrapper.find('input')
    input.trigger('click')
    expect(input.element.checked).toEqual(true)
  })

})
