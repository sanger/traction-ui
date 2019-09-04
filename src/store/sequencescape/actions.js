import handlePromise from '@/api/PromiseHelper'

const getSequencescapeTubesForBarcodes = async ({ commit, getters }, barcodes)  => {
  let barcodeString = barcodes.join(',')
  let request = getters.sequencescapeTubeRequest
  let promise = request.get({filter: { barcode: barcodeString} })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let tubes = response.deserialize.tubes
    commit('setSequencescapeTubes', tubes)
  }
  return response
}

const actions = {
  getSequencescapeTubesForBarcodes
}

export {
  getSequencescapeTubesForBarcodes
}

export default actions
