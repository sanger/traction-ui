import axios from 'axios'

const defaultHeaders = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
}

const createRequest = ({ rootURL, apiNamespace, resource, headers = defaultHeaders }) => {
  const baseURL = `${rootURL}/${apiNamespace}`
  const api = axios.create({ baseURL, headers })

  const buildFilters = ({ ...filters } = {}) => {
    return Object.keys(filters)
      .map((key) => `filter[${key}]=${filters[key]}`)
      .join('&')
  }
  // TODO: I think you can use higher order functions maybe? to improve syntax but again
  // this is a massive improvement on the previous incarnation and easier to understand
  const buildQuery = ({ filters, include } = {}) => {
    const filterString = buildFilters(filters)
    const includeString = include ? `include=${include}` : ''
    const queryString = [filterString, includeString].filter(Boolean).join('&')

    if (queryString.length > 0) {
      return `${resource}?${queryString}`
    } else {
      return resource
    }
  }

  const execute = async (type, ...params) => {
    return api[type](...params)
  }

  const get = async ({ filters, include } = {}) => {
    return execute('get', buildQuery({ filters, include }))
  }

  const create = async ({ data }) => {
    return execute('post', resource, data)
  }

  return {
    rootURL,
    apiNamespace,
    resource,
    headers,
    baseURL,
    api,
    buildFilters,
    buildQuery,
    get,
    create,
  }
}

export { defaultHeaders, createRequest }

export default createRequest
