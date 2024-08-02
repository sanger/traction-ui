import axios from 'axios'

// default headers are for json api
const defaultHeaders = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
}

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
  return typeof value === 'string' || value instanceof String
}

const isEmptyString = (value) => {
  return isString(value) && value.length < 1
}

const isLengthString = (value) => {
  return isString(value) && value.length > 0
}

/*
 * @param {Object} attributes e.g. { parameter1: { key1: value1, key2: value2}, parameter2: { key1: value1, key2: value2 }, parameter3: value3}
 * @return String e.g. 'parameter1[key1]=value1&parameter1[key2]=value2&parameter2[key1]=value1&parameter2[key2]=value2&parameter3=value3
 */
const parametersToString = (attributes, parameter = undefined) => {
  return Object.entries(attributes)
    .flatMap(([key, value]) => {
      // if the value is an object needs to be converted into a string
      // we also pass the key as the parameter
      if (isObject(value)) {
        return parametersToString(value, key)
      }

      // if it is a string turn it into a parameter e.g. 'a.b.c' will become 'key=a.b.c'
      // if parameter is defined it will be 'parameter[key]=value'
      // we only want to do this if the string has some characters
      if (isLengthString(value)) {
        return parameter ? `${parameter}[${key}]=${value}` : `${key}=${value}`
      }

      // if we get here something is wrong. String can be empty but if there is e.g. an array or undefined
      // then it needs to be fixed.
      if (!isEmptyString(value)) {
        throw new TypeError('query arguments are not of the correct type')
      }
    })
    .filter(Boolean)
    .join('&')
}

/*
 * @param {Object} filter - query filters
 * @param String include - query include
 * @param {Object} fields - query fields
 * @param {Object} page - query page
 * @return String
 * Turns a list of parameters into a query string
 */
const buildQuery = ({ page = {}, filter = {}, include = '', fields = {} } = {}) => {
  const queryString = parametersToString({ page, filter, include, fields })

  // if the query string has any length then put a ? in front
  // otherwise just return an empty string
  return queryString.length > 0 ? `?${queryString}` : ''
}

/*
 * @param {String} rootURL
 * @param {String} apiNamespace
 * @param {String} resource
 * @param {Object} headers - these will default to json api headers
 * @returns {Object} instance of request
 */
const createRequest = ({ rootURL, apiNamespace, resource, headers = {} }) => {
  headers = { ...defaultHeaders, ...headers }
  const baseURL = `${rootURL}/${apiNamespace}`
  const api = axios.create({ baseURL, headers })

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
  const get = ({ page = {}, filter = {}, include = '', fields = {} } = {}) => {
    return execute('get', `${resource}${buildQuery({ page, filter, include, fields })}`)
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
  const create = ({ data, include = '' }) => {
    return execute('post', `${resource}${buildQuery({ include })}`, data)
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
  const update = (payload) => {
    return execute('patch', `${resource}/${payload.data.id}`, payload)
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
