
import axios from 'axios'
import Response from '@/api/Response'

let defaultConfig = {
  baseUrl: 'http://example.com',
  apiNamespace: '/api/v1',
  headers: {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
}

class Request {
  constructor(config) {
    this.config = config
  }

  get baseUrl () {
    return this.config.baseUrl
  }

  get apiNamespace () {
    return this.config.apiNamespace
  }

  get headers () {
    return this.config.headers
  }

  set baseUrl (_baseUrl) {
    this.config.baseUrl = _baseUrl
  }

  set apiNamespace (_apiNamespace) {
    this.config.apiNamespace = _apiNamespace
  }

  set headers (_headers) {
    this.config.headers = _headers
  }

  get() {
    return axios.get(this.baseUrl+this.apiNamespace)
      .then(function (response) {
        return new Response(response).body
      })
      .catch(function (response) {
        return new Response(response).errors
      })
  }

  async post(data) {
    return await axios.post(this.baseUrl+this.apiNamespace, data, { headers: this.headers })
      .then(function (response) {
        return new Response(response).body
      })
      .catch(function (response) {
        return new Response(response).errors
      })
  }

  async patch(data) {
    return await axios.patch(this.baseUrl+this.apiNamespace, data, { headers: this.headers })
      .then(function (response) {
        return new Response(response).body
      })
      .catch(function (response) {
        return new Response(response).errors
      })
  }

}

export default new Request(defaultConfig)
