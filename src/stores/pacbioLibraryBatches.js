import { defineStore } from 'pinia'
import { eachRecord } from '@/lib/csv/pacbio.js'
import useRootStore from '@/stores/index.js'
import { handleResponse } from '@/api/v2/ResponseHelper.js'
import { groupIncludedByResource } from '@/api/JsonApi.js'
import {
  validateAndFormatAsPayloadData,
  hasDuplicateSources,
  fetchTagsAndRequests,
} from '@/stores/utilities/pacbioLibraryBatches.js'
import { dataToObjectById } from '@/api/JsonApi.js'

/**
 * usePacbioLibraryBatchesStore is a store to manage pacbio library batches.
 * @returns {Object} - The store object.
 */
export const usePacbioLibraryBatchesStore = defineStore('pacbioLibraryBatches', {
  state: () => ({
    /**
     * @property {Object} libraryBatches - An object to store all library batches indexed by id.
     */
    libraryBatches: {},
    /**
     * @property {Object} libraries - An object to store all libraries indexed by id.
     */
    libraries: {},
    /**
     * @property {Object} tubes - An object to store all tubes from all libraries indexed by id.
     */
    tubes: {},
  }),

  actions: {
    /**
     * Creates a library batch from a CSV file and a tag set.
     *
     * @param {File} csvFile - The CSV file containing library batch data.
     * @param {Object} tagSet - The tag set to validate against.
     * @returns {Promise<Object>} - The result of the library batch creation.
     */
    async createLibraryBatch(csvFile, tagSet) {
      // Check if the required parameters are provided
      if (!tagSet) {
        return { success: false, errors: ['tagSet is required'] }
      }
      if (!csvFile) {
        return { success: false, errors: ['csvFile is required'] }
      }
      try {
        // Fetch the tags and requests
        const { requests, tags } = await fetchTagsAndRequests(tagSet)

        // Read the CSV file and validate the records
        const csv = await csvFile.text()
        if (hasDuplicateSources(csv)) {
          return { success: false, errors: ['Duplicate source exists'] }
        }
        const eachReordRetObj = eachRecord(
          csv,
          validateAndFormatAsPayloadData,
          requests,
          Object.values(tags).map((t) => t.id),
        )
        if (eachReordRetObj.error) {
          return { success: false, errors: [eachReordRetObj.error] }
        }

        // Create the library batch request
        const librariesAttributes = eachReordRetObj.map((r) => r.result)
        const rootStore = useRootStore()
        const libraryBatches = rootStore.api.v2.traction.pacbio.library_batches
        const promise = libraryBatches.create({
          data: {
            data: {
              type: 'library_batches',
              attributes: {
                libraries_attributes: librariesAttributes,
              },
            },
          },
          include: 'libraries,libraries.tube',
        })

        const { success, body: { included = [] } = {}, errors } = await handleResponse(promise)
        const { tubes = [] } = groupIncludedByResource(included)

        // Return the result
        const barcodes = tubes.map((tube) => tube.attributes.barcode)
        return { success, barcodes, errors }
      } catch (error) {
        return { success: false, errors: [error] }
      }
    },

    /**
     * Fetches library batches with optional filters and pagination.
     *
     * @param {Object} [filter={}] - The filter criteria for fetching library batches.
     * @param {Object} [page={}] - The pagination options for fetching library batches.
     * @returns {Promise<Object>} - The result of the fetch operation, including success status, errors, and metadata.
     */
    async fetchLibraryBatches(filter = {}, page = {}) {
      const rootStore = useRootStore()
      const pacbioLibraryBatches = rootStore.api.v2.traction.pacbio.library_batches
      const promise = pacbioLibraryBatches.get({
        page,
        filter,
        include: 'libraries,libraries.tube',
      })
      const response = await handleResponse(promise)

      const { success, body: { data, included = [], meta = {} } = {}, errors = [] } = response

      if (success && data.length > 0) {
        const { tubes, libraries } = groupIncludedByResource(included)
        this.libraryBatches = dataToObjectById({ data, includeRelationships: true })
        this.tubes = dataToObjectById({ data: tubes })
        this.libraries = dataToObjectById({ data: libraries })
      }
      return { success, errors, meta }
    },

    /**
     * Creates a library batch request with the given library attributes.
     *
     * @param {Array} librariesAttributes - The attributes of the libraries to include in the batch.
     * @returns {Promise<Object>} - The result of the create operation, including success status, tubes, and errors.
     */
    async createLibraryBatcheRequest(librariesAttributes) {
      const rootStore = useRootStore()
      const libraryBatches = rootStore.api.v2.traction.pacbio.library_batches
      const promise = libraryBatches.create({
        data: {
          data: {
            type: 'library_batches',
            attributes: {
              libraries_attributes: librariesAttributes,
            },
          },
        },
        include: 'libraries,libraries.tube',
      })

      const { success, body: { included = [] } = {}, errors } = await handleResponse(promise)
      const { tubes = [] } = groupIncludedByResource(included)
      return { success, tubes, errors }
    },
  },
})
