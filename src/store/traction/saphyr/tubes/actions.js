import handlePromise  from '@/api/PromiseHelper'

const getTractionTubesForBarcodes = async ({ commit, getters }, barcodes)  => {
  let request = getters.tubeRequest
  let barcodeString = barcodes.join(',')
  let promise = request.get({filter: { barcode: barcodeString} })
  let response = await handlePromise(promise)
  if (response.successful && !response.empty) {
    let tubes = response.deserialize.tubes
    commit('setTubes', tubes)
  }
  return response
}

const exportSampleExtractionTubesIntoTraction = async ({ getters }, tubes)  => {
  let body = {
    data: {
      type: "requests",
      attributes: {
        requests: sampleExtractionTubeJson(tubes)
      }
    }
  }

  let request = getters.requestsRequest
  let promise = request.create(body)
  let response = await handlePromise(promise)

  return response
}

const sampleExtractionTubeJson = (tubes) => {
  return tubes.map(t => ({
    external_id: 'mockExternal-ID',
    external_study_id: 'mockStudy-ID',
    name: 'mockName',
    species: 'mockSpecies'
  }))
}

const createLibrariesInTraction = async ({ getters }, payload) => {
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

  return response
}

const deleteLibraries = async ({ getters }, libraryIds) => {
  let request = getters.libraryRequest
  let promises = request.destroy(libraryIds)

  let responses = await Promise.all(promises.map(promise => handlePromise(promise)))
  return responses
}

const actions = {
  getTractionTubesForBarcodes,
  exportSampleExtractionTubesIntoTraction,
  createLibrariesInTraction,
  deleteLibraries
}

export {
  getTractionTubesForBarcodes,
  exportSampleExtractionTubesIntoTraction,
  sampleExtractionTubeJson,
  createLibrariesInTraction,
  deleteLibraries
}

export default actions
