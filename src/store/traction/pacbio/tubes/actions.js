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
    name: t.fields.sanger_sample_id + 'mock',
    species: 'mock sample_common_name',
    external_id: t.sample_uuid,
    external_study_id: t.study_uuid + '-mock',
    library_type: t.library_type + ' mock',
    estimate_of_gb_required: t.estimate_of_gb_required + 'mock',
    number_of_smrt_cells: t.number_of_smrt_cells + 'mock',
    cost_code: t.cost_code + 'mock'
  }))
}

const createLibrariesInTraction = async ({ getters }, payload) => {
  let libraries = payload.libraries.map(library => {
    return {
      volume: library.volume,
      concentration: library.concentration,
      library_kit_barcode: library.libraryKitBarcode,
      fragment_size: library.fragmentSize,
      relationships: {
        requests: {
          data: library.samples.map(sample => {
            return {
              id: sample.id,
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
        }
      }
    }
  })

  let body = {
    data: {
      type: 'libraries',
      attributes: {
        libraries
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
