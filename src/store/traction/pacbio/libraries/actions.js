import handlePromise from '@/api/PromiseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { handleResponse } from '@/api/ResponseHelper'

const createLibraryInTraction = async ({ rootState, rootGetters }, library) => {
  // Some duplication of code from createPool but this is for single library pool
  let tag_id = rootGetters['traction/tractionTags'].find((l) => l.group_id == library.tag.group_id)
    .id

  let body = {
    data: {
      type: 'pools',
      attributes: {
        library_attributes: [
          {
            pacbio_request_id: library.sample.id,
            template_prep_kit_box_barcode: library.templatePrepKitBoxBarcode,
            tag_id,
            volume: library.volume,
            concentration: library.concentration,
            insert_size: library.insertSize,
          },
        ],
        template_prep_kit_box_barcode: library.templatePrepKitBoxBarcode,
        volume: library.volume,
        concentration: library.concentration,
        insert_size: library.insertSize,
      },
    },
  }

  const request = rootState.api.traction.pacbio.pools
  const promise = request.create({ data: body, include: 'tube' })
  const { success, data: { included = [] } = {}, errors } = await handleResponse(promise)
  const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
  const { attributes: { barcode = '' } = {} } = tube
  return { success, barcode, errors }
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

  const request = getters.requestLibraryRequest
  const promise = request.update(body)
  const response = await handlePromise(promise)

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
        insert_size: payload.insert_size,
      },
    },
  }

  const request = getters.libraryRequest
  const promise = request.update(body)
  const response = await handlePromise(promise)

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
