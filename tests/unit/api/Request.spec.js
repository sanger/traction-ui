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
    Request.apiNamespace = 'api/v2'
    expect(Request.apiNamespace).toEqual('api/v2')
  })

  it('can have some headers', () => {
    let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
    Request.headers = headers
    expect(Request.headers).toEqual(headers)
  })

  it('will have some config', () => {
    expect(Request.options.baseUrl).toEqual(`${Request.baseUrl}/${Request.apiNamespace}`)
    expect(Request.options.headers).toEqual(Request.headers)
  })

  describe('get', () => {

    it('returns Response body on success', () => {
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.get.mockResolvedValue(response)
      Request.get('requests').then(data => {
        expect(data).toEqual([{id: 1, name: 'sample1', species: 'dog'}])
      })
      expect(axios.get).toBeCalledWith('requests', Request.options)
    })

    it('returns Response errors on failure', () => {
      let response = {status: 422, data: { errors: [{ name: 'error message1' }, { name: 'error message2' }]}}
      axios.get.mockRejectedValue(response)
      Request.get('requests').then(data => {
        expect(data).toEqual({message: 'error message1, error message2'})
      })
      expect(axios.get).toBeCalledWith('requests', Request.options)
    })

    it('with filters', () => {
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.get.mockResolvedValue(response)
      Request.get('requests', {type: 'long_read', state: 'pending'}).then(data => {
        expect(data).toEqual([{id: 1, name: 'sample1', species: 'dog'}])
      })
      expect(axios.get).toBeCalledWith('requests?filter[type]=long_read&filter[state]=pending', Request.options)
    })
  })

  describe('post', () => {

    it('returns Response body on success', () => {
      let data = { data: { attributes: { samples: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.post.mockResolvedValue(response)
      Request.post('requests', data).then(data => {
        expect(data).toEqual([{id: 1, name: 'sample1', species: 'dog'}])
      })
      expect(axios.post).toBeCalledWith('requests', data, Request.options)
    })

    it('returns Response errors on failure', () => {
      let data = { data: { attributes: { samples: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 422, data: { errors: [{ name: 'error message1' }, { name: 'error message2' }]}}
      axios.post.mockRejectedValue(response)
      Request.post('requests', data).then(data => {
        expect(data).toEqual({message: 'error message1, error message2'})
      })
      expect(axios.post).toBeCalledWith('requests', data, Request.options)
    })
  })

  describe('patch', () => {

    it('returns Response body on success', () => {
      let data = { data: { attributes: { requests: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.patch.mockResolvedValue(response)
      Request.patch('requests', data).then(data => {
        expect(data).toEqual([{id: 1, name: 'sample1', species: 'dog'}])
      })
      expect(axios.patch).toBeCalledWith('requests', data, Request.options)
    })

    it('returns Response errors on failure', () => {
      let data = { data: { attributes: { requests: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 422, data: { errors: [{ name: 'error message1' }, { name: 'error message2' }]}}
      axios.patch.mockRejectedValue(response)
      Request.patch('requests', data).then(data => {
        expect(data).toEqual({message: 'error message1, error message2'})
      })
      expect(axios.patch).toBeCalledWith('requests', data, Request.options)
    })
  })

})
