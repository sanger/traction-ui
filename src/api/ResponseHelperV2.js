/*
 * @param {Object} errors
 * @param {Object} error
 * @returns {String or Object}
 * TODO: Still wondering if there is more to do to make this more robust
 * but probably better to find out with a bit of testing
 */
// TODO: we have left this in a broken state as we still need to work out how errors are handled
const parseErrors = ({ errors, error }) => {
  // if its stand alone return it
  if (error) {
    return error
  }

  // turn it into something nice i.e. a readable string if it is a 422
  return parseErrorObject(errors)
}

const parseErrorObject = (errors) =>
  Object.entries(errors)
    .map(([key, value]) => {
      return value.map((item) => `${key} ${item}`).join(', ')
    })
    .join(', ')

// const parseErrorArray = (errors) =>
//   errors.map(({ title, detail }) => `${title} ${detail}`).join(', ')

/*
 * @param Boolean success
 * @param {Object} data e.g. { data: { id: 1}}
 * @returns { Boolean, {Object}, String} { success, data, errors } e.g. { success: true, data: {id: 1}} or {success: false, errors: 'there was an error'}
 */
const newResponse = ({ success, data }) => ({
  success,
  data,
  // we need to parse the errors into something viewable
  errors: !success ? parseErrors(data) : undefined,
})

/*
 * @param {AxiosPromise} promise
 * @returns {newResponse}
 */
const handleResponse = async (promise) => {
  try {
    // yay it worked.
    const rawResponse = await promise
    const data = await rawResponse.json()
    return newResponse({ success: rawResponse.ok, data })
  } catch (error) {
    // we only want this to output during development or production
    // eslint has got this wrong as it is always a string
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!+import.meta.env.VITE_LOG) {
      console.error(error)
    }

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
