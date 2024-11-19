import { defineStore } from 'pinia'
import { eachRecord } from '@/lib/csv/pacbio.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import useRootStore from '@/stores/index.js'
import { handleResponse } from '@/api/v2/ResponseHelper.js'
import { groupIncludedByResource } from '@/api/JsonApi.js'
import store from '@/store'
import { validateAndFormatAsPayloadData } from '@/stores/utilities/pacbioLibraryBatches.js'
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
        const { requests, tags } = await this._fetchTagsAndRequests(tagSet)

        // Read the CSV file and validate the records
        const csv = await csvFile.text()
        if (this._hasDuplicateSources(csv)) {
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
        const { success, tubes, errors } =
          await this._createLibraryBatcheRequest(librariesAttributes)

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
     * Fetches all requests and tags for given tagset.
     *
     * @param {Object} tagSet - The tag set to fetch tags and requests for.
     * @returns {Promise<Object>} - The fetched tags and requests.
     */
    async _fetchTagsAndRequests(tagSet) {
      const pacbioRootStore = usePacbioRootStore()
      await store.dispatch('traction/pacbio/requests/setRequests')
      const requests = store.getters['traction/pacbio/requests/requests']
      await pacbioRootStore.fetchPacbioTagSets()
      const tags = tagSet.tags.map((tag) => pacbioRootStore.tags[tag.id ?? tag])
      return { requests, tags }
    },

    /**
     * Creates a library batch request with the given library attributes.
     *
     * @param {Array} librariesAttributes - The attributes of the libraries to include in the batch.
     * @returns {Promise<Object>} - The result of the create operation, including success status, tubes, and errors.
     */
    async _createLibraryBatcheRequest(librariesAttributes) {
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

    /**
     * Checks for duplicate sources in the CSV content.
     *
     * @param {string} csvText - The CSV content as a string.
     * @returns {boolean} - True if duplicate sources are found, otherwise false.
     */
    _hasDuplicateSources(csvText) {
      const lines = csvText.split('\n')
      const sources = new Set()
      const duplicates = []
      // Skip the header line
      lines.slice(1).forEach((line) => {
        const source = line.split(',')[0] // The source is the first column
        if (sources.has(source)) {
          duplicates.push(source)
        } else {
          sources.add(source)
        }
      })
      return duplicates.length > 0
    },
  },
})
