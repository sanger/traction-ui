
import axios from 'axios'
import Response from '@/api/Response'

let defaultConfig = {
  baseUrl: 'http://example.com',
  apiNamespace: 'api/v1',
  headers: {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
}

class Request {
  constructor(config) {
    this.baseUrl = config.baseUrl
    this.apiNamespace = config.apiNamespace
    this.headers = config.headers
  }

  get options() {
    return {
      baseUrl: `${this.baseUrl}/${this.apiNamespace}`,
      headers: this.headers
    }
  }

  async get(resource, filters = {}) {
    let url = resource
    let mappedFilters

    if (Object.keys(filters).length > 0) {
      mappedFilters = Object.keys(filters).map(key => `filter[${key}]=${filters[key]}`)
      url = `${resource}?${mappedFilters.join('&')}`
    }

    return await axios.get(url, this.options)
      .then(function (response) {
        return new Response(response).body
      })
      .catch(function (response) {
        return new Response(response).errors
      })
  }

  async post(resource, data) {
    return await axios.post(resource, data, this.options)
      .then(function (response) {
        return new Response(response).body
      })
      .catch(function (response) {
        return new Response(response).errors
      })
  }

  async patch(resource, data) {
    return await axios.patch(resource, data, this.options)
      .then(function (response) {
        return new Response(response).body
      })
      .catch(function (response) {
        return new Response(response).errors
      })
  }

}

export default new Request(defaultConfig)
