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
    name: t.fields.sanger_sample_id,
    species: t.fields.sample_common_name,
    external_id: t.sample_uuid,
    external_study_id: t.study_uuid,
    library_type: t.library_type,
    estimate_of_gb_required: t.estimate_of_gb_required,
    number_of_smrt_cells: t.number_of_smrt_cells,
    cost_code: t.cost_code
  }))
}

const createLibrariesInTraction = async ({ rootGetters, getters }, payload) => {

  let libraries = payload.libraries.map(library => {
    let tagId = rootGetters['traction/tractionTags'].find(l => l.group_id == library.tag.group_id).id

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
                    id: tagId
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

const setLibraries = async ({ commit, getters }) => {
  let request = getters.libraryRequest
  let promise = request.get()
  let response = await handlePromise(promise)
  let libraries = null

  if (response.successful && !response.empty) {
    libraries = response.deserialize.libraries

    libraries = response.deserialize.libraries.map((library) => {
      library.tag_oligos = library.requests.map((request) => {
        return request.tag_oligo
      }).join(',')
      return library
    })
    
    commit('setLibraries', libraries)
  }

  return libraries

}

const actions = {
  getTractionTubesForBarcodes,
  exportSampleExtractionTubesIntoTraction,
  createLibrariesInTraction,
  deleteLibraries,
  setLibraries
}

export {
  getTractionTubesForBarcodes,
  exportSampleExtractionTubesIntoTraction,
  sampleExtractionTubeJson,
  createLibrariesInTraction,
  deleteLibraries,
  setLibraries
}

export default actions
