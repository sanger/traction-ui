import { handleResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

const getSampleExtractionTubesForBarcodes = async ({ commit, getters }, barcodes) => {
  const barcodeString = barcodes.join(',')
  const request = getters.sampleExtractionTubeRequest
  const promise = request.get({ filter: { barcode: barcodeString } })

  const response = await handleResponse(promise)

  if (!response.success || response.data.data.length === 0) {
    return {
      success: false,
      errors: 'Sample Extraction tubes failed to be imported',
    }
  }
  const assets = deserialize(response.data).assets
  commit('setSampleExtractionTubes', assets)

  return response
}

const actions = {
  getSampleExtractionTubesForBarcodes,
}

export { getSampleExtractionTubesForBarcodes }

export default actions
