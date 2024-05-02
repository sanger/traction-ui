/*
 * @param {Object} errors - for range 4xx-5xx
 * @param {Object} error - when there is no server response
 * @returns {String} - comma separated string of key, value pairs
 * e.g.  errors: { error1: ['nasty'], error2: ['broken', 'crushed'], },
 * would return 'error1 nasty, error2 broken, error2 crushed'
 */
const parseErrors = (errors, error) => {
  // if its stand alone return it
  if (error) {
    return error
  }

  // turn it into something nice i.e. a readable string if it is a 422
  if (Array.isArray(errors)) {
    return parseErrorArray(errors)
  } else {
    return parseErrorObject(errors)
  }
}

/*
 * @param {Object} errors
 * @returns {String} - comma separated string of key, value pairs
 * e.g.  errors: { error1: ['nasty'], error2: ['broken', 'crushed'], },
 * would return 'error1 nasty, error2 broken, error2 crushed'
 */
const parseErrorObject = (errors) => {
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
const parseErrorArray = (errors) =>
  errors.map(({ title, detail }) => `${title} ${detail}`).join(', ')

/*
 * @param {Object} e.g. { success = true, data: { id: 1}, errors = { error1: ['nasty'], error2: ['broken', 'crushed'], }, error = 'there was an error', error = { title: 'Invalid field', detail: 'tag_group is not a valid includable relationship of tags', code: '112', status: '400',
 * @returns { Boolean, {Object}, String} { success, data, errors } e.g. { success: true, data: {id: 1}} or {success: false, errors: 'there was an error'}
 */
const newResponse = ({ success, data = null, errors = null, error = null }) => ({
  success,
  data,
  // we need to parse the errors into something viewable
  errors: !success ? parseErrors(errors, error) : undefined,
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

    return newResponse({ success: rawResponse.ok, data: response })
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

export { newResponse, handleResponse }

export default handleResponse
