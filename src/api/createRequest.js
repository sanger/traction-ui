import axios from 'axios'

// default headers are for json api
const defaultHeaders = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
}

/*
 * @param {String} rootURL
 * @param {String} apiNamespace
 * @param {String} resource
 * @param {Object} headers - these will default to json api headers
 * @returns {Object} instance of request
 */
const createRequest = ({ rootURL, apiNamespace, resource, headers = defaultHeaders }) => {
  const baseURL = `${rootURL}/${apiNamespace}`
  const api = axios.create({ baseURL, headers })

  /*
   * @param {Any} value
   * @returns boolean
   */
  const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object
  }

  /*
   * @param {Any} value
   * @returns boolean
   */
  const isString = (value) => {
    return (typeof value === 'string' || value instanceof String) && value.length > 0
  }

  /*
   * @param {Object} attributes e.g. { parameter1: { key1: value1, key2: value2}, parameter2: { key1: value1, key2: value2 }}
   * @return String e.g. 'parameter1[key1]=value1&parameter1[key2]=value2&parameter2[key1]=value1&parameter2[key2]=value2
   */
  const buildParameter = (attributes) => (parameter) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${parameter}[${key}]=${value}`)
      .join('&')
  }

  /*
   * @param {Object} parameters
   * @return String
   * Turns a list of parameters into a string
   */
  const buildParameterList = (parameters) => {
    return Object.entries(parameters).map(([key, value]) => {
      // if the value is an object needs to be converted into a string
      if (isObject(value)) {
        return buildParameter(value)(key)
      }

      // if it is a string turn it into a parameter e.g. 'a.b.c' will become 'key=a.b.c'
      if (isString(value)) {
        return `${key}=${value}`
      }
    })
  }

  /*
   * @param {Object} parameters
   * @return String
   * Turns a list of parameters into a string of the format e.g. ?filter[barcode]=DN1
   * If parameters ends up being empty an empty string is returned
   */
  const buildQueryString = (parameters) => {
    const queryString = buildParameterList(parameters)
      .filter(Boolean)
      .join('&')
    return queryString.length > 0 ? `?${queryString}` : ''
  }

  /*
   * @param {Object} filter - query filters
   * @param String include - query include
   * @param {Object} fields - query fields
   * @return String
   * Turns a list of parameters into a query string
   */
  const buildQuery = ({ filter = {}, include = '', fields = {} } = {}) => {
    return buildQueryString({ filter, include, fields })
  }

  /*
   * @param String type - request type e.g. 'get', 'create'
   * @param String include - query include
   * @return AxiosPromise
   * execute a query on an Axios instance
   */
  const execute = (type, ...params) => {
    return api[type](...params)
  }

  /*
   * @param {Object} filter - query filters
   * @param String include - query include
   * @return AxiosPromise
   * Execute a get query
   */
  const get = ({ filter = {}, include = '' } = {}) => {
    return execute('get', `${resource}${buildQuery({ filter, include })}`)
  }

  /*
   * @param String,Number id - id of the record to find
   * @param String include - query include
   * @return AxiosPromise
   * Execute a get query with an id
   */
  const find = ({ id = '', include = '' } = {}) => {
    return execute('get', `${resource}/${id}${buildQuery({ include })}`)
  }

  /*
   * @param {Object} data - data to send for create
   * @return AxiosPromise
   * Execute a create
   */
  const create = ({ data }) => {
    return execute('post', resource, data)
  }

  /*
   * @param Array or String or Integer ids - ids of records to destroy
   * @return [AxiosPromise] - array of promises
   */
  const destroy = (...ids) => {
    return ids.map((id) => execute('delete', `${resource}/${id}`))
  }

  /*
   * @param {Object} data - data to send for update
   * @return AxiosPromise
   * Execute a patch
   */
  const update = (data) => {
    return execute('patch', `${resource}/${data.id}`, data)
  }

  return {
    rootURL,
    apiNamespace,
    resource,
    headers,
    baseURL,
    api,
    buildQuery,
    get,
    create,
    find,
    destroy,
    update,
  }
}

export { defaultHeaders, createRequest }

export default createRequest
