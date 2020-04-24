import handlePromise from '@/api/PromiseHelper'

const getPlates = async ({ commit, getters }, barcodes)  => {
  let barcodeString = barcodes.join(',')
  let request = getters.platesRequest
  let promise = request.get({filter: { barcode: barcodeString} })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let plates = response.deserialize.plates
    commit('setPlates', plates)
  }
  return response
}

const actions = {
  getPlates
}

export {
  getPlates
}

export default actions
