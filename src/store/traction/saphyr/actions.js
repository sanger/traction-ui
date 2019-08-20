import handlePromise from '@/api/PromiseHelper'

const getTractionTubesForBarcodes = async ({ commit, getters }, barcodeString)  => {
  let request = getters.tubeRequest
  let promise = request.get({filter: { barcode: barcodeString} })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let tubes = response.deserialize.tubes
    commit('setTubes', tubes)
  }
  return response

}

const exportSampleTubesIntoTraction = async ({ dispatch, getters }, tubes)  => {
  let body = {
    data: {
      type: "requests",
      attributes: {
        requests: sampleTubeJson(tubes)
      }
    }
  }

  let request = getters.requestsRequest
  let promise = request.create(body)
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let barcodes = response.deserialize.requests.map(r => r.barcode).join('\n')
    await dispatch('getTractionTubesForBarcodes', barcodes)
  }
  return response
}

const sampleTubeJson = (tubes) => {
  return tubes.map(t => ({
    external_id: t.samples[0].uuid,
    external_study_id: t.studies[0].uuid,
    name: t.name,
    species: t.samples[0].sample_metadata.sample_common_name
  }))
}

const actions = {
  getTractionTubesForBarcodes,
  exportSampleTubesIntoTraction,
  sampleTubeJson
}

export {
  getTractionTubesForBarcodes,
  exportSampleTubesIntoTraction,
  sampleTubeJson
}

export default actions
