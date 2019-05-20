import Api from '@/api'

// promise - a promise object
// return - a Api.Response object
const handlePromise = async (promise) => {
  let rawResponse
  try {
    rawResponse = await promise
  } catch(resp) {
    let responseObject = resp.response
    responseObject['data'] = responseObject['data']['data']
    rawResponse = responseObject
  }
  let response = new Api.Response(rawResponse)
  return response
}

export {
  handlePromise
}

export default handlePromise
