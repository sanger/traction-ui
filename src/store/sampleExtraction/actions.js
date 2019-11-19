import handlePromise from '@/api/PromiseHelper'

const getSampleExtractionTubesForBarcodes = async ({ commit, getters }, barcodes)  => {
  let barcodeString = barcodes.join(',')
  let request = getters.sampleExtractionTubeRequest
  let promise = request.get({filter: { barcode: barcodeString} })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let assets = response.deserialize.assets
    commit('setSampleExtractionTubes', assets)
  }
  return response
}

const actions = {
  getSampleExtractionTubesForBarcodes
}

export {
  getSampleExtractionTubesForBarcodes
}

export default actions
