/*
 * @param {Object} errors
 * @param {Object} error
 * @returns {String or Object}
 */
const parseErrors = ({ errors, error }) => {
  // if its stand alone return it
  if (error) {
    return error
  }
  // turn it into something nice i.e. a readable string
  if (errors) {
    return Object.keys(errors)
      .map((key) => {
        return errors[key].map((item) => `${key} ${item}`).join(', ')
      })
      .join(', ')
  }
}

/*
 * @param Boolean success
 * @param {Object} data e.g. { data: { id: 1}}
 * @returns { Boolean, {Object}, String} { success, data, errors } e.g. { success: true, data: {id: 1}} or {success: false, errors: 'there was an error'}
 */
const newResponse = ({ success, data, error }) => {
  success
  data
  error
  // we need to parse the errors into something viewable
  const errors = parseErrors({ ...data, error })

  return {
    success,
    data,
    errors,
  }
}

/*
 * @param {AxiosPromise} promise
 * @returns {newResponse}
 */
const handleResponse = async (promise) => {
  try {
    // yay it worked.
    const rawResponse = await promise
    return newResponse({ success: true, ...rawResponse })
  } catch (error) {
    // 400-500 range will throw an error with a response
    if (error.response) {
      return newResponse({ success: false, ...error.response })
    }
    // e.g. a network error which will not elicit an Axios response
    return newResponse({ success: false, error, data: undefined })
  }
}

export { newResponse, handleResponse }

export default handleResponse
