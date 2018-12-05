import Request from '@/api/Request'
import axios from 'axios'

jest.mock('axios')

describe('Request', () => {

  it('can have a basuUrl', () => {
    Request.baseUrl = 'http://sequencescape.com'
    expect(Request.baseUrl).toEqual('http://sequencescape.com')
  })

  it('can have an apiNamespace', () => {
    Request.apiNamespace = 'api/v2'
    expect(Request.apiNamespace).toEqual('api/v2')
  })

  it('can have some headers', () => {
    let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
    Request.headers = headers
    console.log(Request)
    expect(Request.headers).toEqual(headers)
  })

  it('performs a get request', () => {
    axios.get.mockResolvedValue({data: { status: 200, data: {id: 1, attributes: {name: 'sample1', species: 'dog'}}}})
    
  })
})
