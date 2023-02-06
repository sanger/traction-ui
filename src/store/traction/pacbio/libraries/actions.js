import handlePromise from '@/api/PromiseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { handleResponse } from '@/api/ResponseHelper'
import { dataToObjectById } from '@/api/JsonApi'

const createLibraryInTraction = async ({ rootState }, library) => {
  // Some duplication of code from createPool but this is for single library pool
  const tag_id = library.tag.id

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

// Fetch Pacbio tagSets and tags and store choices in state
const fetchPacbioTagSets = async ({ commit, rootState }) => {
  const request = rootState.api.traction.pacbio.tag_sets
  const promise = request.get({ include: 'tags' })
  const response = await handleResponse(promise)
  const { success, data: { data, included = [] } = {}, errors = [] } = response
  if (success) {
    const tagSets = dataToObjectById({ data, includeRelationships: true })
    const tags = dataToObjectById({ data: included })
    const tagSetChoices = []
    const tagChoices = {}
    Object.values(tagSets).forEach((tagSet) => {
      tagSetChoices.push({ value: tagSet.id, text: tagSet.name })
      tagChoices[tagSet.id] = tagSet.tags
        .map((tagId) => tags[tagId])
        .map(({ id: value, group_id: text }) => ({ value, text }))
    })
    commit('setTagSetChoices', { tagSetChoices, tagChoices })
  }
  return { success, errors, response }
}

const actions = {
  createLibraryInTraction,
  deleteLibraries,
  setLibraries,
  updateLibrary,
  updateTag,
  fetchPacbioTagSets,
}

export {
  createLibraryInTraction,
  deleteLibraries,
  setLibraries,
  updateLibrary,
  updateTag,
  fetchPacbioTagSets,
}

export default actions
