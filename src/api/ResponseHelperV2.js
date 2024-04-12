/*
 * @param {Object} errors
 * @param {Object} error
 * @returns {String or Object}
 * TODO: Still wondering if there is more to do to make this more robust
 * but probably better to find out with a bit of testing
 */
// TODO: we have left this in a broken state as we still need to work out how errors are handled
const parseErrors = (errors, error) => {
  // if its stand alone return it
  if (error) {
    return error
  }

  // turn it into something nice i.e. a readable string if it is a 422
  // turn it into something nice i.e. a readable string if it is a 422
  if (Array.isArray(errors)) {
    return parseErrorArray(errors)
  } else {
    return parseErrorObject(errors)
  }
}

const parseErrorObject = (errors) => {
  return Object.entries(errors)
    .map(([key, value]) => {
      return value.map((item) => `${key} ${item}`).join(', ')
    })
    .join(', ')
}

const parseErrorArray = (errors) =>
  errors.map(({ title, detail }) => `${title} ${detail}`).join(', ')

/*
 * @param Boolean success
 * @param {Object} data e.g. { data: { id: 1}}
 * @returns { Boolean, {Object}, String} { success, data, errors } e.g. { success: true, data: {id: 1}} or {success: false, errors: 'there was an error'}
 */
const newResponse = ({ success, data = null, errors = null, error = null }) => ({
  success,
  data,
  // we need to parse the errors into something viewable
  errors: !success ? parseErrors(errors, error) : undefined,
})

/*
 * @param {AxiosPromise} promise
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

    return newResponse({ success: rawResponse.ok, data: response })
  } catch (error) {
    // we only want this to output during development or production
    // eslint has got this wrong as it is always a string
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!+import.meta.env.VITE_LOG) {
      console.error(error)
    }

    // e.g. a network error which will not elicit an Axios response
    return newResponse({ success: false, error })
  }
}

export { newResponse, handleResponse }

export default handleResponse
