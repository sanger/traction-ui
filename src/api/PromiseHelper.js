import Api from '@/api'

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
    let responseObject = resp.response
    responseObject['data'] = responseObject['data']['data']
    rawResponse = responseObject
  }
  let response = new Api.Response(rawResponse)
  return response
}

export { handlePromise }

export default handlePromise
