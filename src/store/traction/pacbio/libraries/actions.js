import handlePromise from '@/api/PromiseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { handleResponse } from '@/api/ResponseHelper'

const createLibraryInTraction = async ({ rootState, rootGetters }, library) => {
  // Some duplication of code from createPool but this is for single library pool
  const tag = rootGetters['traction/tractionTags'].find((l) => l.group_id == library.tag.group_id)
  const tag_id = tag ? tag.id : ''

  let body = {
    data: {
      type: 'pools',
      attributes: {
        library_attributes: [
          {
            pacbio_request_id: library.sample.id,
            template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
            tag_id,
            volume: library.volume,
            concentration: library.concentration,
            insert_size: library.insert_size,
          },
        ],
        template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
        volume: library.volume,
        concentration: library.concentration,
        insert_size: library.insert_size,
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

const setLibraries = async ({ commit, getters }, filter) => {
  let request = getters.libraryRequest
  let promise = request.get({
    include: 'request,tag,tube,pool',
    filter: filter,
  })
  let response = await handleResponse(promise)

  const { success, data: { data, included = [] } = {}, errors = [] } = response
  const { tubes, tags, requests, pools } = groupIncludedByResource(included)

  if (success) {
    let libraries = data.map((library) => {
      return {
        id: library.id,
        ...library.attributes,
        pool: pools.find((pool) => pool.id == library.relationships.pool.data?.id),
        tag_group_id: tags.find((tag) => tag.id == library.relationships.tag.data?.id)?.attributes
          .group_id,
        sample_name: requests.find(
          (request) => request.id == library.relationships.request.data?.id,
        )?.attributes.sample_name,
        barcode: tubes.find((tube) => tube.id == library.relationships.tube.data?.id)?.attributes
          .barcode,
      }
    })
    commit('setLibraries', libraries)
  }

  return { success, errors }
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
    id: payload.id,
    type: 'libraries',
    attributes: {
      volume: payload.volume,
      concentration: payload.concentration,
      template_prep_kit_box_barcode: payload.template_prep_kit_box_barcode,
      insert_size: payload.insert_size,
    },
  }
  const req = getters.libraryRequest
  const promise = req.update({ data: body, include: 'request,tag,tube,pool' })
  const { success, data: { data = {}, included = [] } = {}, errors } = await handleResponse(promise)
  const {
    tubes: [tube = {}] = [],
    requests: [request = {}] = [],
    tags: [tag = { attributes: { group_id: null } }] = [],
    pools: [pool = {}] = [],
  } = groupIncludedByResource(included)

  if (success) {
    // Formats returned data into correct structure for library store
    const formattedLibrary = {
      ...data.attributes,
      id: data.id,
      tag_group_id: tag.attributes.group_id,
      sample_name: request.attributes.sample_name,
      barcode: tube.attributes.barcode,
      pool,
      tag,
      request,
      tube,
    }
    commit('updateLibrary', formattedLibrary)
  }
  return { success, errors }
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
