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

const exportSampleTubesIntoTraction = async ({ getters }, tubes)  => {
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

const createLibrariesInTraction = async ({ getters }, payload) => {
  let requests = payload.samples.map(item => {
    return {
      id: item.id,
      type: 'requests',
      relationships: {
        tag: {
          data: {
            id: 1
          }
        }
      }
    }
  })

  let library = {
    volume: payload.library.volume,
    concentration: payload.library.concentration,
    library_kit_barcode: payload.library.libraryKitBarcode,
    fragment_size: payload.library.fragmentSize,
    relationships: {
      requests: {
        data: requests
      }
    }
  }

  let body = {
    data: {
      type: 'libraries',
      attributes: {
        libraries: [library]
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
  exportSampleTubesIntoTraction,
  createLibrariesInTraction,
  deleteLibraries
}

export {
  getTractionTubesForBarcodes,
  exportSampleTubesIntoTraction,
  sampleTubeJson,
  createLibrariesInTraction,
  deleteLibraries
}

export default actions
