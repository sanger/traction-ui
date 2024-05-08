/*
 * @param {Object} errors - for range 4xx-5xx
 * @param {Object} error - when there is no server response
 * @returns {String} - comma separated string of key, value pairs
 * e.g.  errors: { error1: ['nasty'], error2: ['broken', 'crushed'], },
 * would return 'error1 nasty, error2 broken, error2 crushed'
 */
const parseJsonApiErrors = (errors) => {
  // turn it into something nice i.e. a readable string if it is a 422
  if (Array.isArray(errors)) {
    return parseJsonApiErrorArray(errors)
  } else {
    return parseJsonApiErrorObject(errors)
  }
}

/*
 * @param {Object} errors
 * @returns {String} - comma separated string of key, value pairs
 * e.g.  errors: { error1: ['nasty'], error2: ['broken', 'crushed'], },
 * would return 'error1 nasty, error2 broken, error2 crushed'
 */
const parseJsonApiErrorObject = (errors) => {
  return Object.entries(errors)
    .map(([key, value]) => {
      return value.map((item) => `${key} ${item}`).join(', ')
    })
    .join(', ')
}

/*
 * @param {Array} errors
 * @returns {String} - comma separated string of key, value pairs
 * e.g.  errors: [{ title: 'Invalid field', detail: 'tag_group is not a valid includable relationship of tags', code: '112', status: '400', },]
 * would return 'Invalid field tag_group is not a valid includable relationship of tags'
 */
const parseJsonApiErrorArray = (errors) =>
  errors.map(({ title, detail }) => `${title} ${detail}`).join(', ')

/*
 * @param {Array} errors
 * @returns {String} - comma separated string of key, value pairs
 * // e.g.  errors: [{ source: { pointer: '/data/attributes/printer', }, detail: "can't be blank", },] would return 'printer can't be blank'
 */
const parsePrintMyBarcodeErrors = (errors) => {
  return errors
    .map(({ source, detail }) => `${source.pointer.split('/').pop()} ${detail}`)
    .join(', ')
}

/*
 * @param {Object} errors
 * @param {Object} error
 * @param {Function} errorHandler
 * @returns {String} - parsed errors
 */
const errorResult = (errors, error, errorHandler) => {
  if (error) {
    return error
  }
  return errorHandler(errors)
}

/*
 * @param {Object} e.g. { success = true, body: { data: { id: 1 } }, errors = { error1: ['nasty'], error2: ['broken', 'crushed'], }, error = 'there was an error', error = { title: 'Invalid field', detail: 'tag_group is not a valid includable relationship of tags', code: '112', status: '400', errorHandler = myErrorHandler }
 * it is better to use body rather than data. No overlapping and more in keeping with standard approach
 * we set the body to an empty object to avoid any issues with destructuring
 * the errorHandler is a function that takes errors and parses them into a readable string
 * @returns { Boolean, {Object}, String} { success, body, errors } e.g. { success: true, body: {data: { id: 1}}} or {success: false, errors: 'there was an error'}
 */
const newResponse = ({
  success,
  body = {},
  errors = null,
  error = null,
  errorHandler = parseJsonApiErrors,
}) => ({
  success,
  body,
  // we need to parse the errors into something viewable
  errors: !success ? errorResult(errors, error, errorHandler) : undefined,
})

/*
 * @param {Promise} promise
 * @returns {newResponse}
 */
const handleResponse = async (promise) => {
  try {
    // yay it worked.
    const rawResponse = await promise
    const response = await rawResponse.json()

    // Please check https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_that_the_fetch_was_successful
    // for more information on the ok property
    if (!rawResponse.ok) {
      return newResponse({ success: false, ...response })
    }

    // we add the response to the body
    return newResponse({ success: rawResponse.ok, body: response })
    // rejects the promise if the fetch was unsuccessful
  } catch (error) {
    // we only want this to output during development or production
    // eslint has got this wrong as it is always a string
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!+import.meta.env.VITE_LOG) {
      console.error(error)
    }

    // e.g. a network error
    return newResponse({ success: false, error })
  }
}

export { newResponse, handleResponse, parsePrintMyBarcodeErrors }

export default handleResponse
