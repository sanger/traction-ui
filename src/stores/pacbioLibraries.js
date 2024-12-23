import { defineStore } from 'pinia'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import { libraryPayload } from '@/stores//utilities/pacbioLibraries.js'

/**
 * @function validateFields
 * @param {Object} library - The library object to validate.
 * @returns {boolean} Returns true if all required fields are present and truthy in the library object, false otherwise.
 * @description Validates that the required fields are present in the given library object.
 * The required fields are 'id', 'template_prep_kit_box_barcode', 'volume' and 'concentration'.
 * The 'tag' and 'insert_size' fields are optional.
 */
const validateFields = (library) => {
  const requiredAttributes = ['id', 'template_prep_kit_box_barcode', 'volume', 'concentration']
  const errors = requiredAttributes.filter((field) => !library[field])

  return {
    success: errors.length === 0,
    errors: 'Missing required field(s)',
  }
}

/**
 * Importing `defineStore` function from 'pinia' library.
 * The `defineStore` function is used to create a store in Pinia,
 * which is a state management library for Vue.js.
 *
 * @see {@link https://pinia.esm.dev/api/defineStore} for more information about `defineStore`.
 */
export const usePacbioLibrariesStore = defineStore('pacbioLibraries', {
  state: () => ({
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
     * @property {Object} tags - An object to store all tags from all libraries indexed by id.
     */
    tags: {},
  }),

  getters: {
    /**
     * Transforms the libraries in the state into an array with additional properties.
     *
     * @function librariesArray
     * @param {Object} state - The state object containing libraries, tags, requests, and tubes.
     * @returns {Array<Object>} - An array of library objects, each with id, tag_group_id, sample_name, barcode, and other attributes.
     */
    librariesArray: (state) => {
      const pacbioRootStore = usePacbioRootStore()
      return Object.values(state.libraries)
        .filter((library) => library.tube)
        .map((library) => {
          const { id, request, tag_id, tag, tube, ...attributes } = library
          const tagId = tag_id ?? tag

          /*Get the tag group ID from the library's tag ID or from the tag in pacbioRoot store(where all pacbio tags are kept). Why is this required?
          The librariesArray is called in multiple places (in create and edit context) to get the libraries. 
          Therefore, librariesArray needs to search for the tag first in tags. 
          If not found, it should then look for it in 'pacbioRoot' store tags. 
          It's important to note that 'pacbioRoot' store tags will only get populated if a 'pacbioRoot' store action fetchPacbioTagSets is called before, 
          which may not happen in all the places where it's called. 
          Hence, a search in both places is required to ensure that librariesArray returns the correct tag 
          associated with all libraries."*/

          const tagGroupId = state.tags[tagId]
            ? state.tags[tagId].group_id
            : pacbioRootStore.tags[tagId]
              ? pacbioRootStore.tags[tagId].group_id
              : ''

          return {
            id,
            tag_id: String(tagId),
            tube,
            ...attributes,
            tag_group_id: tagGroupId ?? '',
            sample_name: state.requests[request].sample_name,
            barcode: state.tubes[tube].barcode,
          }
        })
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
     * await createLibrary(library, tagId);
     */
    async createLibrary({
      template_prep_kit_box_barcode,
      tag_id,
      concentration,
      volume,
      insert_size,
      sample: { id: pacbio_request_id },
    }) {
      const rootState = useRootStore()
      const request = rootState.api.traction.pacbio.libraries
      const payload = libraryPayload({
        pacbio_request_id,
        template_prep_kit_box_barcode,
        tag_id,
        concentration,
        volume,
        insert_size,
      })

      const promise = request.create({
        data: payload,
        include: 'tube,primary_aliquot',
      })

      const { success, body: { included = [] } = {}, errors } = await handleResponse(promise)
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
    async fetchLibraries(filter = {}, page = {}) {
      const rootStore = useRootStore()
      const pacbioLibraries = rootStore.api.traction.pacbio.libraries
      const promise = pacbioLibraries.get({
        page,
        filter,
        include: 'request,tag,tube',
      })
      const response = await handleResponse(promise)

      const { success, body: { data, included = [], meta = {} } = {}, errors = [] } = response

      if (success && data.length > 0) {
        const { tubes, tags, requests } = groupIncludedByResource(included)
        this.libraries = dataToObjectById({ data, includeRelationships: true })
        this.tubes = dataToObjectById({ data: tubes })
        this.tags = dataToObjectById({ data: tags })
        this.requests = dataToObjectById({ data: requests })
      }
      return { success, errors, meta }
    },

    /**
     * Updates the library with matchingid with all given field values.
     * @param {*} libraryFields - The fields to update the library with.
     * * @returns {Promise<Object>} A promise that resolves to an object.
     * The object has a 'success' property that is true if the library was updated successfully and false otherwise.
     * If 'success' is false, the object also has an 'errors' property with a message describing the error.
     */
    async updateLibrary(libraryFields) {
      //Validate the libraryFields to ensure that all required fields are present
      const valid = validateFields(libraryFields)
      if (!valid.success) {
        return { success: false, errors: valid.errors }
      }

      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.libraries
      const payload = libraryPayload(libraryFields)
      const promise = request.update(payload)
      const { success, errors } = await handleResponse(promise)
      if (success) {
        //Update all fields of the library in the store with matching ID with the given values.
        this.libraries[libraryFields.id] = {
          ...this.libraries[libraryFields.id],
          ...libraryFields,
        }
      }
      return { success, errors }
    },
  },
})
