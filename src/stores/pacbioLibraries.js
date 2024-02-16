/**
 * Importing `defineStore` function from 'pinia' library.
 * The `defineStore` function is used to create a store in Pinia,
 * which is a state management library for Vue.js.
 *
 * @see {@link https://pinia.esm.dev/api/defineStore} for more information about `defineStore`.
 */
import { defineStore } from 'pinia'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'

/**
 * This method will check each library to ensure that:
 *  * required fields are present
 **/
const validate = (library) => {
  // tags are optional
  const requiredAttributes = [
    'id',
    'template_prep_kit_box_barcode',
    'volume',
    'concentration',
    'insert_size',
  ]
  return requiredAttributes.every((field) => library[field])
}

export const usePacbioLibrariesStore = defineStore('pacbioLibraries', {
  state: () => ({
    /**
     * @property {Object} tagState - An object to store and manage all tag-related data.
     */
    tagState: {
      /**
       * @property {Object} tagSets - An object to store all tag-sets which are indexed by id
       */
      tagSets: {},
      /**
       * @property {Object} tags - An object to store all tags, each of which belongs to a tag set.
       */
      tags: {},
    },
    /**
     * @property {Object} libraryState - An object to store and manage all library-related data.
     */
    libraryState: {
      /**
       * @property {Object} libraries - An object to store all libraries indexed by id.
       */
      libraries: {},
      /**
       * @property {Object} tubes - An object to store all tubes from all libraries indexed by id.
       */
      tubes: {},
      /**
       * @property {Object} requests - An object to store all requests from all libraries indexed by id.
       */
      requests: {},
      /**
       * @property {Object} libraryTags - An object to store all tags from all libraries indexed by id.
       */
      libraryTags: {},
    },
  }),

  getters: {
    /**
     * Returns an array of tag choices for a given tag set ID.
     *
     * @function tagChoicesForId
     * @param {Object} state - The state object containing tagSets and tags.
     * @param {string} tagSetId - The ID of the tag set to get choices for.
     * @returns {Array<{value: string, text: string}>} - An array of tag choices, each represented as an object with a value and text property.
     */
    tagChoicesForId: (state) => (tagSetId) => {
      if (!tagSetId) return []
      const values =
        state.tagState.tagSets[tagSetId].tags
          .map((tagId) => state.tagState.tags[tagId])
          .map(({ id: value, group_id: text }) => ({ value, text })) || []
      return values
    },
    /**
     * Returns an array of tag set choices from the state.
     *
     * @function tagSetChoices
     * @param {Object} state - The state object containing tagSets.
     * @returns {Array<{value: string, text: string}>} - An array of tag set choices, each represented as an object with a value and text property.
     */
    tagSetChoices: (state) => {
      return Object.values(state.tagState.tagSets).map(({ id, name }) => ({
        value: id,
        text: name,
      }))
    },

    /**
     * Transforms the libraries in the state into an array with additional properties.
     *
     * @function librariesArray
     * @param {Object} state - The state object containing libraries, libraryTags, requests, and tubes.
     * @returns {Array<Object>} - An array of library objects, each with id, tag_group_id, sample_name, barcode, and other attributes.
     */
    librariesArray: (state) => {
      const ret = Object.values(state.libraryState.libraries)
        .filter((library) => library.tube)
        .map((library) => {
          const { id, request, tag_id, tube, ...attributes } = library
          debugger
          return {
            id,
            ...attributes,
            tag_group_id: tag_id ? state.libraryState.libraryTags[tag_id].group_id : '',
            sample_name: state.libraryState.requests[request].sample_name,
            barcode: state.libraryState.tubes[tube].barcode,
          }
        })
      return ret
    },
  },
  actions: {
    /**
     * Asynchronously creates a new library in Traction.
     * @param {Object} library - The library object to be created.
     * @param {string|number} tagId - The ID of the tag to be associated with the library.
     * @returns {Promise} A promise that resolves when the library is successfully created.
     *
     * @example
     * await createLibraryInTraction(library, tagId);
     */
    async createLibraryInTraction(library) {
      const rootState = useRootStore()
      const request = rootState.api.traction.pacbio.libraries
      const body = {
        data: {
          type: 'libraries',
          attributes: {
            pacbio_request_id: library.sample.id,
            template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
            tag_id: library.tag_id,
            concentration: library.concentration,
            volume: library.volume,
            insert_size: library.insert_size,
            primary_aliquot_attributes: {
              template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
              volume: library.volume,
              concentration: library.concentration,
              insert_size: library.insert_size,
            },
          },
        },
      }
      const promise = request.create({
        data: body,
        include: 'tube,primary_aliquot',
      })
      const { success, data: { included = [] } = {}, errors } = await handleResponse(promise)
      const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
      const { attributes: { barcode = '' } = {} } = tube
      return { success, barcode, errors }
    },

    /**
     * Deletes the specified libraries.
     *
     * @param {Array} libraryIds - An array of IDs of the libraries to be deleted.
     * @returns {Promise} A promise that resolves when all the specified libraries are successfully deleted.
     *
     * @example
     * await deleteLibraries([1, 2, 3]);
     */
    async deleteLibraries(libraryIds) {
      const rootStore = useRootStore()
      const promises = rootStore.api.traction.pacbio.libraries.destroy(libraryIds)
      const responses = await Promise.all(promises.map((promise) => handleResponse(promise)))
      return responses
    },

    /**
     * Fetch libraries in store with those fetched using given filter and page.
     * @param {Object} filter - The filter criteria to apply when fetching the libraries.
     * @param {number} page - The page number to fetch from the server.
     * @returns {Promise<{success: boolean, errors: Array}>} - A promise that resolves to an object containing a success boolean and an array of errors.
     */
    async fetchLibraries(filter, page) {
      const rootStore = useRootStore()
      const pacbioLibraries = rootStore.api.traction.pacbio.libraries
      const promise = pacbioLibraries.get({
        page,
        filter,
        include: 'request,tag,tube',
      })
      const response = await handleResponse(promise)

      const { success, data: { data, included = [], meta = {} } = {}, errors = [] } = response

      if (success && data.length > 0) {
        const { tubes, tags, requests } = groupIncludedByResource(included)
        this.libraryState.libraries = dataToObjectById({ data, includeRelationships: true })
        this.libraryState.tubes = dataToObjectById({ data: tubes })
        this.libraryState.libraryTags = dataToObjectById({ data: tags })
        this.libraryState.requests = dataToObjectById({ data: requests })
      }
      return { success, errors, meta }
    },

    /**
     * Fetches Pacbio tag sets from the root store and formats them by ID.
     * @function fetchPacbioTagSets
     * @returns {Promise<{success: boolean, errors: Array, response: Object}>} - A promise that resolves to an object containing a success boolean, an array of errors, and the response object.
     * @throws {Error} - Throws an error if the request fails.
     */
    async fetchPacbioTagSets() {
      const rootStore = useRootStore()
      const promise = rootStore.api.traction.pacbio.tag_sets.get({ include: 'tags' })

      const response = await handleResponse(promise)
      const { success, data: { data, included = [] } = {}, errors = [] } = response
      if (success && data.length > 0) {
        this.tagState.tagSets = dataToObjectById({ data, includeRelationships: true })
        this.tagState.tags = dataToObjectById({ data: included })
      }
      return { success, errors, response }
    },

    async updateLibrary(libraryFields) {
      if (!validate(libraryFields)) return { success: false, errors: 'The library is invalid' }
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.libraries
      const body = {
        data: {
          type: 'libraries',
          id: libraryFields.id,
          attributes: {
            template_prep_kit_box_barcode: libraryFields.template_prep_kit_box_barcode,
            tag_id: libraryFields.tag_id,
            concentration: libraryFields.concentration,
            volume: libraryFields.volume,
            insert_size: libraryFields.insert_size,
          },
        },
      }

      const promise = request.update(body)
      const { success, errors } = await handleResponse(promise)
      if (success) {
        this.libraryState.libraries[libraryFields.id] = {
          ...this.libraryState.libraries[libraryFields.id],
          ...libraryFields,
        }
      }
      return { success, errors }
    },
  },
})
