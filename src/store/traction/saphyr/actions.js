import handlePromise  from '@/api/PromiseHelper'
import printJob       from '@/api/PrintJobRequests'

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
    response = await dispatch('getTractionTubesForBarcodes', barcodes)
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

const deleteLibraries = async ({ getters }, libraryIds) => {
  let request = getters.libraryRequest
  let promises = request.destroy(libraryIds)

  let responses = await Promise.all(promises.map(promise => handlePromise(promise)))
  return responses
}

const printLabels = async ({}, printerName, libraries) => {
  let response = await printJob(printerName, libraries)
  return response
}

const createLibrariesInTraction = async ({ dispatch, getters }, payload) => {
  let libraries = payload.samples.map(item => {
    return {
      state: 'pending',
      saphyr_request_id: item.id,
      saphyr_enzyme_id: payload.enzymeID
    }
  })

  let body = {
    data: {
      type: 'libraries',
      attributes: {
        libraries: libraries
      }
    }
  }

  let request = getters.libraryRequest
  let promise = request.create(body)
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let barcodes = response.deserialize.libraries.map(r => r.barcode).join('\n')
    response = await dispatch('getTractionTubesForBarcodes', barcodes)
  }
  return response
}

const getRuns = async ({ commit, getters }) => {
  let request = getters.runRequest
  let promise = request.get()
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let runs = response.deserialize.runs
    commit('setRuns', runs)
  }

  return response
}

const startRun = async ({ dispatch }, id)=> {
  let payload = { id: id, attributes: { state: 'started' } }
  await dispatch('handleUpdate', payload)
}

const completeRun = async ({ dispatch }, id)=> {
  let payload = { id: id, attributes: { state: 'completed' } }
  await dispatch('handleUpdate', payload)
}

const cancelRun = async ({ dispatch }, id)=> {
  let payload = { id: id, attributes: { state: 'cancelled' } }
  await dispatch('handleUpdate', payload)
}

const handleUpdate = async ({ getters }, payload) => {
  let request = getters.runRequest
  let runPayload = runPayloadJson(payload)
  let promises = await request.update(runPayload)
  let response = await handlePromise(promises[0])
  return response
}

const runPayloadJson = (payload) => {
  let id = payload.id
  let attributes = payload.attributes

  return {
    data: {
      id: id,
      type: 'runs',
      attributes: attributes
    }
  }
}

const actions = {
  getTractionTubesForBarcodes,
  exportSampleTubesIntoTraction,
  sampleTubeJson,
  deleteLibraries,
  printLabels,
  createLibrariesInTraction,
  getRuns,
  startRun,
  completeRun,
  cancelRun,
  handleUpdate,
  runPayloadJson
}

export {
  getTractionTubesForBarcodes,
  exportSampleTubesIntoTraction,
  sampleTubeJson,
  deleteLibraries,
  printLabels,
  createLibrariesInTraction,
  getRuns,
  startRun,
  completeRun,
  cancelRun,
  handleUpdate,
  runPayloadJson
}

export default actions
