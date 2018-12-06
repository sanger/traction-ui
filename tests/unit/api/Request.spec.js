import Request from '@/api/Request'
import Response from '@/api/Response'
import axios from 'axios'

jest.mock('axios')

describe('Request', () => {

  it('can have a baseUrl', () => {
    Request.baseUrl = 'http://sequencescape.com'
    expect(Request.baseUrl).toEqual('http://sequencescape.com')
  })

  it('can have an apiNamespace', () => {
    Request.apiNamespace = '/api/v2'
    expect(Request.apiNamespace).toEqual('/api/v2')
  })

  it('can have some headers', () => {
    let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
    Request.headers = headers
    expect(Request.headers).toEqual(headers)
  })

  describe('get', () => {

    it('returns Response body on success', () => {
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.get.mockResolvedValue(response)
      Request.get().then(data => {
        expect(data).toEqual([{id: 1, name: 'sample1', species: 'dog'}])
      })
      expect(axios.get).toBeCalledWith('http://sequencescape.com/api/v2')
    })

    it('returns Response errors on failure', () => {
      let response = {status: 422, data: { errors: [{ name: 'error message1' }, { name: 'error message2' }]}}
      axios.get.mockRejectedValue(response)
      Request.get().then(data => {
        expect(data).toEqual({message: 'error message1, error message2'})
      })
      expect(axios.get).toBeCalledWith('http://sequencescape.com/api/v2')
    })
  })

  describe('post', () => {

    it('returns Response body on success', () => {
      let data = { data: { attributes: { samples: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.post.mockResolvedValue(response)
      let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
      Request.post(data).then(data => {
        expect(data).toEqual([{id: 1, name: 'sample1', species: 'dog'}])
      })
      expect(axios.post).toBeCalledWith('http://sequencescape.com/api/v2', data, { headers: headers })
    })

    it('returns Response errors on failure', () => {
      let data = { data: { attributes: { samples: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 422, data: { errors: [{ name: 'error message1' }, { name: 'error message2' }]}}
      axios.post.mockRejectedValue(response)
      let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
      Request.post(data).then(data => {
        expect(data).toEqual({message: 'error message1, error message2'})
      })
      expect(axios.post).toBeCalledWith('http://sequencescape.com/api/v2', data, { headers: headers })
    })
  })

  describe('patch', () => {

    it('returns Response body on success', () => {
      let data = { data: { attributes: { requests: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.patch.mockResolvedValue(response)
      let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
      Request.patch(data).then(data => {
        expect(data).toEqual([{id: 1, name: 'sample1', species: 'dog'}])
      })
      expect(axios.patch).toBeCalledWith('http://sequencescape.com/api/v2', data, { headers: headers })
    })

    it('returns Response errors on failure', () => {
      let data = { data: { attributes: { requests: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 422, data: { errors: [{ name: 'error message1' }, { name: 'error message2' }]}}
      axios.patch.mockRejectedValue(response)
      let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
      Request.patch(data).then(data => {
        expect(data).toEqual({message: 'error message1, error message2'})
      })
      expect(axios.patch).toBeCalledWith('http://sequencescape.com/api/v2', data, { headers: headers })
    })
  })

})
