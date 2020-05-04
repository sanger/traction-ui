import handlePromise  from '@/api/PromiseHelper'

// TODO: check this still works??
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

const processCostCode = (tube) => {
  if (tube.cost_code !== null) {
    return tube.cost_code
  }
  if (/\bDTOL/.test(tube.fields.sanger_sample_id)) {
    return 'S4773'
  } else {
    return tube.cost_code
  }
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
    cost_code: processCostCode(t),
    source_barcode: t.barcode
  }))
}

// TODO: move to libraries subfolder, not tubes
const createLibraryInTraction = async ({ rootGetters, getters }, payload) => {

  let library = payload.library
  let tagId = rootGetters['traction/tractionTags'].find(l => l.group_id == library.tag.group_id).id

  library = {
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

  let body = {
    data: {
      type: 'library',
      attributes: library
    }
  }

  let request = getters.libraryRequest
  let promise = request.create(body)
  let response = await handlePromise(promise)

  return response
}

// TODO: move to libraries subfolder, not tubes
const deleteLibraries = async ({ getters }, libraryIds) => {
  let request = getters.libraryRequest
  let promises = request.destroy(libraryIds)

  let responses = await Promise.all(promises.map(promise => handlePromise(promise)))
  return responses
}

// TODO: move to libraries subfolder, not tubes
const setLibraries = async ({ commit, getters }) => {
  let request = getters.libraryRequest
  let promise = request.get()
  let response = await handlePromise(promise)
  let libraries = null

  if (response.successful && !response.empty) {
    libraries = response.deserialize.libraries

    libraries = response.deserialize.libraries.map((library) => {
      library.tag_group_ids = library.requests.map((request) => {
        return request.tag_group_id
      }).join(',')

      return library
    })
    
    commit('setLibraries', libraries)
  }

  return libraries

}

// TODO: move to libraries subfolder, not tubes
const updateLibrary= async ({ commit, getters }, payload) => {

  let body = {
    data: {
      id: payload.id,
      type: 'libraries',
      attributes: {
        volume: payload.volume,
        concentration: payload.concentration,
        library_kit_barcode: payload.library_kit_barcode,
        fragment_size: payload.fragment_size
      }
    }
  }
  
  let request = getters.libraryRequest
  let promises = request.update(body)
  let response = await handlePromise(promises[0])
  
  if (response.successful) {
    let library = response.deserialize.libraries[0]
    commit('updateLibrary', library)
  }
  return response
}

const actions = {
  exportSampleExtractionTubesIntoTraction,
  createLibraryInTraction,
  deleteLibraries,
  setLibraries,
  updateLibrary

}

export {
  exportSampleExtractionTubesIntoTraction,
  sampleExtractionTubeJson,
  createLibraryInTraction,
  deleteLibraries,
  setLibraries,
  updateLibrary,
  processCostCode
}

export default actions
