
import axios from 'axios'

let defaultConfig = {
  baseUrl: 'http://example.com',
  apiNamespace: 'api/v1',
  headers: {}
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
}

export default new Request(defaultConfig)
