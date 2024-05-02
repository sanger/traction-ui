import Response from '@/api/v1/Response'

/*
 * Note: Please see handleResponse for updated handling of responses,
 * this is a little more robust and handling the various server responses,
 * and is less opinionated about how the returned data is handled.
 */

// promise - a promise object
// return - a Api.Response object
const handlePromise = async (promise) => {
  let rawResponse
  try {
    rawResponse = await promise
  } catch (resp) {
    if (resp.response) {
      const responseObject = resp.response
      responseObject['data'] = responseObject['data']['data']
      rawResponse = responseObject
    } else {
      // We don't always end up with a server response, which results in the
      // above pattern failing with 'Cannot read properties of undefined
      // (reading 'data')' obscuring the original error. Here we re-throw the
      // original error.
      // This is a little inconsistent with the behaviour above, and instead we
      // would be better off returning an Api.Response with an invalid status.
      // However when I actually tried that approach I discovered that we ended
      // up just hiding errors instead.
      // Given we already have pressure to move onto handleResponse, I've
      // decided to leave the core-behaviour unchanged, but ensure that a useful
      // error message is propagated.
      throw resp
    }
  }
  const response = new Response(rawResponse)
  return response
}

export { handlePromise }

export default handlePromise
