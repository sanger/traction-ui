import handlePromise  from '@/api/PromiseHelper'

const createLibraryInTraction = async ({ rootGetters, getters }, payload) => {
  debugger
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
      library.tag_group_ids = library.requests.map((request) => {
        return request.tag_group_id
      }).join(',')

      return library
    })
    
    commit('setLibraries', libraries)
  }

  return libraries

}

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
  createLibraryInTraction,
  deleteLibraries,
  setLibraries,
  updateLibrary

}

export {
  createLibraryInTraction,
  deleteLibraries,
  setLibraries,
  updateLibrary,
}

export default actions
