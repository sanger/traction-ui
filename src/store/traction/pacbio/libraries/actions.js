import handlePromise from '@/api/PromiseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { handleResponse } from '@/api/ResponseHelper'
import { dataToObjectById } from '@/api/JsonApi'

const createLibraryInTraction = async ({ rootState }, library) => {
  // Some duplication of code from createPool but this is for single library pool
  const tag_id = library.tag.id

  const body = {
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
  const request = getters.libraryRequest
  const promises = request.destroy(libraryIds)

  const responses = await Promise.all(promises.map((promise) => handlePromise(promise)))
  return responses
}

const setLibraries = async ({ commit, getters }, filter, page) => {
  const request = getters.libraryRequest
  const promise = request.get({
    page,
    filter,
    include: 'request,tag,pool.tube',
  })
  const response = await handleResponse(promise)

  const { success, data: { data, included = [], meta = {} } = {}, errors = [] } = response
  const { tubes, tags, requests, pools } = groupIncludedByResource(included)

  if (success) {
    /* 
      Here we build library objects to include necessary relational data
      for the pacbio libraries page
    */
    const libraries = data.map((library) => {
      const pool = pools?.find((pool) => pool.id == library.relationships.pool.data?.id)
      return {
        id: library.id,
        ...library.attributes,
        pool,
        tag_group_id: tags?.find((tag) => tag.id == library.relationships.tag.data?.id)?.attributes
          .group_id,
        sample_name: requests?.find(
          (request) => request.id == library.relationships.request.data?.id,
        )?.attributes.sample_name,
        barcode: tubes?.find((tube) => tube.id == pool.relationships.tube.data?.id)?.attributes
          .barcode,
      }
    })
    commit('setLibraries', libraries)
  }

  return { success, errors, meta }
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
  fetchPacbioTagSets,
}

export { createLibraryInTraction, deleteLibraries, setLibraries, fetchPacbioTagSets }

export default actions
