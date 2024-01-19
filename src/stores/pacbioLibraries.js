import { defineStore } from 'pinia'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'

export const usePacbioLibrariesStore = defineStore('pacbioLibraries', {
  state: () => ({
    tagSetChoices: [],
    tagChoices: {},
    libraries: [],
  }),

  getters: {
    /**Return all libraries */
    libraryRequest: () => {
      const rootStore = useRootStore()
      return rootStore.api.traction.pacbio.libraries
    },
    // Return the library requests
    requestLibraryRequest: () => {
      const rootStore = useRootStore()
      return rootStore.api.traction.pacbio.request_library
    },
    // Returns a list of tag options by tagSetId
    tagChoicesForId: (state) => (tagSetId) => {
      return state.tagChoices[tagSetId] || []
    },
  },
  actions: {
    /**Create a new libary */
    async createLibraryInTraction(library, tagId) {
      const rootState = useRootStore()
      const body = {
        data: {
          type: 'library',
          attributes: {
            library_attributes: [
              {
                pacbio_request_id: library.sample.id,
                template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
                tag_id: tagId,
                volume: library.volume,
                concentration: library.concentration,
                insert_size: library.insert_size,
              },
            ],
          },
        },
      }
      //TODO_LIBRARY_CHANGE:Needs to be changed to library
      const request = rootState.api.traction.pacbio.pools
      const promise = request.create({ data: body, include: 'tube' })
      const { success, data: { included = [] } = {}, errors } = await handleResponse(promise)
      const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
      const { attributes: { barcode = '' } = {} } = tube
      return { success, barcode, errors }
    },

    /**Delete all libraries with given library ids */
    async deleteLibraries(libraryIds) {
      const promises = this.libraryRequest.destroy(libraryIds)
      //TODO_LIBRARY_CHANGE: Update all components (which calls deleteLibraries) to use the new response format
      const responses = await Promise.all(promises.map((promise) => handleResponse(promise)))
      return responses
    },

    /**Set libraries in store with those fetched using given filter and page  */
    async setLibraries(filter, page) {
      const request = this.libraryRequest
      const promise = request.get({
        page,
        filter,
        //TODO_LIBRARY_CHANGE: Instead of pool.tube we should be using tube relation in library
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
          /** */
          //TODO_LIBRARY_CHANGE: Keep this? The pool might or might not be present (to support legacy data - pool with libraries)
          const pool = pools?.find((pool) => pool.id == library.relationships.pool.data?.id)
          return {
            id: library.id,
            ...library.attributes,
            pool,
            tag_group_id: tags?.find((tag) => tag.id == library.relationships.tag.data?.id)
              ?.attributes.group_id,
            sample_name: requests?.find(
              (request) => request.id == library.relationships.request.data?.id,
            )?.attributes.sample_name,
            //TODO_LIBRARY_CHANGE: Need to change to library.relationships.tube.data?.id
            barcode: tubes?.find((tube) => tube.id == pool.relationships.tube.data?.id)?.attributes
              .barcode,
            //TODO_LIBRARY_CHANGE: Need to retrieve primary aliquot associated with library?
          }
        })
        this.libraries = libraries
      }
      return { success, errors, meta }
    },

    /**Fetch all tag sets */
    async fetchPacbioTagSets() {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.tag_sets
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
        this.tagSetChoices = tagSetChoices
        this.tagChoices = tagChoices
      }
      return { success, errors, response }
    },

    /**Update a library */
    async updateLibrary(library) {
      const index = this.libraries.findIndex((lib) => lib.id == library.id)
      const libraries = this.libraries
      this.libraries.splice(index, 1, library)
      this.libraries = libraries
    },
  },
})
