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
    return typeof value === 'string' || value instanceof String
  }

  const buildParameter = (attributes) => (parameter) => {
    return Object.keys(attributes)
      .map((key) => `${parameter}[${key}]=${attributes[key]}`)
      .join('&')
  }

  const buildParameterList = (parameters) => {
    return Object.keys(parameters).map((key) => {
      if (isObject(parameters[key])) {
        return buildParameter(parameters[key])(key)
      }

      if (isString(parameters[key])) {
        return `${key}=${parameters[key]}`
      }
    })
  }

  const buildQueryString = (parameters) => {
    const queryString = buildParameterList(parameters)
      .filter(Boolean)
      .join('&')
    return queryString.length > 0 ? `/?${queryString}` : ''
  }

  const buildQuery = ({ filter, include, fields } = {}) => {
    return buildQueryString({ filter, include, fields })
  }

  const execute = (type, ...params) => {
    return api[type](...params)
  }

  const get = ({ filter, include } = {}) => {
    return execute('get', `${resource}${buildQuery({ filter, include })}`)
  }

  const find = ({ id, include } = {}) => {
    return execute('get', `${resource}/${id}${buildQuery({ include })}`)
  }

  const create = ({ data }) => {
    return execute('post', resource, data)
  }

  const convertArray = (arr) => {
    return arr.length === 1 ? arr[0] : arr
  }

  const destroy = (...ids) => {
    return convertArray(ids.map((id) => execute('delete', `${resource}/${id}`)))
  }

  const update = (data) => {
    return convertArray(
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
