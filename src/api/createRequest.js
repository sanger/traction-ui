import axios from 'axios'

// TODO: Add documentation requirement for merge

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

  const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object
  }

  const isString = (value) => {
    return (typeof value === 'string' || value instanceof String) && value.length > 0
  }

  const buildParameter = (attributes) => (parameter) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${parameter}[${key}]=${value}`)
      .join('&')
  }

  const buildParameterList = (parameters) => {
    return Object.entries(parameters).map(([key, value]) => {
      if (isObject(value)) {
        return buildParameter(value)(key)
      }

      if (isString(value)) {
        return `${key}=${value}`
      }
    })
  }

  const buildQueryString = (parameters) => {
    const queryString = buildParameterList(parameters)
      .filter(Boolean)
      .join('&')
    return queryString.length > 0 ? `?${queryString}` : ''
  }

  const buildQuery = ({ filter = {}, include = '', fields = {} } = {}) => {
    return buildQueryString({ filter, include, fields })
  }

  const execute = (type, ...params) => {
    return api[type](...params)
  }

  const get = ({ filter = {}, include = '' } = {}) => {
    return execute('get', `${resource}${buildQuery({ filter, include })}`)
  }

  const find = ({ id = '', include = '' } = {}) => {
    return execute('get', `${resource}/${id}${buildQuery({ include })}`)
  }

  const create = ({ data }) => {
    return execute('post', resource, data)
  }

  const reArray = (arr) => {
    return arr.length === 1 ? arr[0] : arr
  }

  const destroy = (...ids) => {
    return reArray(ids.map((id) => execute('delete', `${resource}/${id}`)))
  }

  const update = (data) => {
    return reArray(
      (Array.isArray(data) ? data : [data]).map((item) =>
        execute('patch', `${resource}/${item.id}`, item),
      ),
    )
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
