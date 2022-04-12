import handlePromise from '@/api/PromiseHelper'

const getTractionTubesForBarcodes = async ({ commit, getters }, barcodes) => {
  let request = getters.tubeRequest
  let barcodeString = barcodes.join(',')
  let promise = request.get({ filter: { barcode: barcodeString }, include: 'materials' })
  let response = await handlePromise(promise)
  if (response.successful && !response.empty) {
    let tubes = response.deserialize.tubes
    commit('setTubes', tubes)
  }
  return response
}

const exportSampleExtractionTubesIntoTraction = async ({ getters }, tubes) => {
  let body = {
    data: {
      type: 'requests',
      attributes: {
        requests: sampleExtractionTubeJson(tubes),
      },
    },
  }

  let request = getters.requestsRequest
  let promise = request.create({ data: body })
  //TODO: change this to use responseHelper which gives better error handling
  let response = await handlePromise(promise)

  return response
}

// TODO: This is where the payload is created
const sampleExtractionTubeJson = (tubes) => {
  return tubes.map((t) => ({
    name: t.fields.sanger_sample_id,
    species: t.fields.sample_common_name,
    external_id: t.sample_uuid,
    external_study_id: t.study_uuid,
  }))
}

const createLibrariesInTraction = async ({ getters }, payload) => {
  let libraries = payload.samples.map((item) => {
    return {
      state: 'pending',
      saphyr_request_id: item.id,
      saphyr_enzyme_id: payload.enzymeID,
    }
  })

  let body = {
    data: {
      type: 'libraries',
      attributes: {
        libraries: libraries,
      },
    },
  }

  let request = getters.libraryRequest
  let promise = request.create({ data: body })
  let response = await handlePromise(promise)

  return response
}

const deleteLibraries = async ({ getters }, libraryIds) => {
  let request = getters.libraryRequest
  let promises = request.destroy(libraryIds)

  let responses = await Promise.all(promises.map((promise) => handlePromise(promise)))
  return responses
}

const setLibraries = async ({ commit, getters }) => {
  let request = getters.libraryRequest
  let promise = request.get()
  let response = await handlePromise(promise)
  let libraries = null

  if (response.successful && !response.empty) {
    libraries = response.deserialize.libraries

    commit('setLibraries', libraries)
  }

  return libraries
}

const actions = {
  getTractionTubesForBarcodes,
  exportSampleExtractionTubesIntoTraction,
  createLibrariesInTraction,
  deleteLibraries,
  setLibraries,
}

export {
  getTractionTubesForBarcodes,
  exportSampleExtractionTubesIntoTraction,
  sampleExtractionTubeJson,
  createLibrariesInTraction,
  deleteLibraries,
  setLibraries,
}

export default actions
