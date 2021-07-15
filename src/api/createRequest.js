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
      return `/?${queryString}`
    } else {
      return ''
    }
  }

  const execute = (type, ...params) => {
    return api[type](...params)
  }

  const get = ({ filters, include } = {}) => {
    return execute('get', `${resource}${buildQuery({ filters, include })}`)
  }

  const find = ({ id, include } = {}) => {
    return execute('get', `${resource}/${id}${buildQuery({ include })}`)
  }

  const create = ({ data }) => {
    return execute('post', resource, data)
  }

  const destroy = (...ids) => {
    const promises = ids.map((id) => execute('delete', `${resource}/${id}`))
    return promises.length === 1 ? promises[0] : promises
  }

  const update = (data) => {
    const promises = (Array.isArray(data) ? data : [data]).map((item) =>
      execute('patch', `${resource}/${item.id}`, item),
    )
    return promises.length === 1 ? promises[0] : promises
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
    find,
    destroy,
    update,
  }
}

export { defaultHeaders, createRequest }

export default createRequest
