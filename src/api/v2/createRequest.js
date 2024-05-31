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
const buildQuery = (queryParametersType = QueryParametersType()) => {
  const queryString = parametersToString(queryParametersType)

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
  const baseURL = `${rootURL}/${apiNamespace}`
  const api = { baseURL, headers: { ...defaultHeaders, ...headers } }

  /*
   * @param String type - request type e.g. 'get', 'create'
   * @param String include - query include
   * @return fetch
   * execute a query using fetch
   */
  const execute = (type, url, data) => {
    const fullURL = `${baseURL}/${url}`
    return fetch(fullURL, {
      method: type,
      headers: api.headers,
      ...(data && { body: JSON.stringify(data) }),
    })
  }

  /*
   * @param {Object} filter - query filters
   * @param String include - query include
   * @return Promise
   * Execute a get query
   */
  const get = (queryParametersType = QueryParametersType()) => {
    return execute('GET', `${resource}${buildQuery(queryParametersType)}`)
  }

  /*
   * @param String,Number id - id of the record to find
   * @param String include - query include
   * @return Promise
   * Execute a get query with an id
   */
  const find = ({ id = '', queryParametersType = QueryParametersType() } = {}) => {
    return execute('GET', `${resource}/${id}${buildQuery(queryParametersType)}`)
  }

  /*
   * @param {Object} data - data to send for create
   * @return Promise
   * Execute a create
   */
  const create = ({ data, queryParametersType = QueryParametersType() }) => {
    return execute('POST', `${resource}${buildQuery(queryParametersType)}`, data)
  }

  /*
   * @param Array or String or Integer ids - ids of records to destroy
   * @return [Promise] - array of promises
   */
  const destroy = (...ids) => {
    return ids.map((id) => execute('DELETE', `${resource}/${id}`))
  }

  /*
   * @param {Object} data - data to send for update
   * @return Promise
   * Execute a patch
   * TODO: Update should have same signature as create
   */
  const update = (payload) => {
    return execute('PATCH', `${resource}/${payload.data.id}`, payload)
  }

  return {
    rootURL,
    apiNamespace,
    resource,
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

/**
 * This function is used to define the type of query parameters that can be passed to the createRequest function.
 * @param {*} page - The page number and size of the results to return.
 * @param {*} filter - The filter to apply to the results.
 * @param {*} include - The related resources to include in the results.
 * @param {*} fields - The fields to return in the results.
 * @returns  {Object} An object with the specified query parameters.
 * @example
 * const queryParameters = QueryParametersType({ page: { number: 1, size: 10 }, filter: { barcode: 'ABC' }, include: 'wells.requests', fields: {requests:{sample_name: 'test'} } });
 */
const QueryParametersType = ({ page = {}, filter = {}, include = '', fields = {} } = {}) => {
  return {
    page,
    filter,
    include,
    fields,
  }
}

export { defaultHeaders, createRequest, QueryParametersType }

export default createRequest
