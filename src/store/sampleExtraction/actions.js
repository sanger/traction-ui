import { handleResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

const getSampleExtractionTubesForBarcodes = async ({ commit, getters }, barcodes) => {
  let barcodeString = barcodes.join(',')
  let request = getters.sampleExtractionTubeRequest
  let promise = request.get({ filter: { barcode: barcodeString } })

  const response = await handleResponse(promise)

  if (response.success && response.data.data.length != 0) {
    let assets = deserialize(response.data).assets
    commit('setSampleExtractionTubes', assets)
  }
  return response
}

const actions = {
  getSampleExtractionTubesForBarcodes,
}

export { getSampleExtractionTubesForBarcodes }

export default actions
