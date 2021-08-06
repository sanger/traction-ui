import handlePromise from '@/api/PromiseHelper'

const createLibraryInTraction = async ({ rootGetters, getters }, library) => {
  let tag_id = rootGetters['traction/tractionTags'].find((l) => l.group_id == library.tag.group_id)
    .id
  let body = {
    data: {
      type: 'library',
      attributes: {
        volume: library.volume,
        concentration: library.concentration,
        template_prep_kit_box_barcode: library.templatePrepKitBoxBarcode,
        insert_size: library.insertSize,
      },
      relationships: {
        request: { data: { type: 'requests', id: library.sample.id } },
        tag: { data: { type: 'tags', id: tag_id } },
      },
    },
  }

  let request = getters.libraryRequest
  let promise = request.create(body)
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
  let promise = request.get({ include: 'request,tag,tube' })
  let response = await handlePromise(promise)
  let libraries = null

  if (response.successful && !response.empty) {
    // TODO: this is a hack. We are no longer returning multiple tags
    // for a library so we should just have a single group_id
    libraries = response.deserialize.libraries.map((library) => {
      // This is getting more complicated
      // I think this needs to be done in one go when we deserialize
      // the libraries
      const {
        tag: { group_id: tag_group_id } = { group_id: null },
        // should be request: { sample: { name } }
        request: { sample_name } = { sample_name: null },
        tube: { barcode } = { barcode: null },
      } = library
      return { ...library, tag_group_id, sample_name, barcode }
    })

    commit('setLibraries', libraries)
  }

  return libraries
}

const updateTag = async ({ getters }, payload) => {
  let body = {
    data: {
      id: payload.request_library_id,
      type: 'tags',
      attributes: {
        tag_id: payload.selectedSampleTagId,
      },
    },
  }

  let request = getters.requestLibraryRequest
  let promises = request.update(body)
  let response = await handlePromise(promises[0])

  return response
}

const updateLibrary = async ({ commit, getters }, payload) => {
  let body = {
    data: {
      id: payload.id,
      type: 'libraries',
      attributes: {
        volume: payload.volume,
        concentration: payload.concentration,
        template_prep_kit_box_barcode: payload.template_prep_kit_box_barcode,
        fragment_size: payload.fragment_size,
      },
    },
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
  updateLibrary,
  updateTag,
}

export { createLibraryInTraction, deleteLibraries, setLibraries, updateLibrary, updateTag }

export default actions
