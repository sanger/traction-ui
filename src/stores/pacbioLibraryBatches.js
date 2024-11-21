import { defineStore } from 'pinia'
import { eachRecord } from '@/lib/csv/pacbio.js'
import useRootStore from '@/stores/index.js'
import { handleResponse } from '@/api/v2/ResponseHelper.js'
import { groupIncludedByResource } from '@/api/JsonApi.js'
import {
  validateAndFormatAsPayloadData,
  hasDuplicateTags,
  fetchTagsAndRequests,
} from '@/stores/utilities/pacbioLibraryBatches.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'

/**
 * usePacbioLibraryBatchesStore is a store to manage pacbio library batches.
 * @returns {Object} - The store object.
 */
export const usePacbioLibraryBatchesStore = defineStore('pacbioLibraryBatches', {
  state: () => ({
    /**
     * @property {Object} libraries - An object to store all libraries indexed by id.
     */
    libraries: {},
    /**
     * @property {Object} tubes - An object to store all tubes from all libraries indexed by id.
     */
    tubes: {},
  }),

  getters: {
    /**
     * Retrieves the libraries in the batch with their associated details.
     *
     * @param {Object} state - The state object of the store.
     * @returns {Array<Object>} - An array of library objects with their details.
     */
    librariesInBatch: (state) => {
      const pacbioRootStore = usePacbioRootStore()
      return Object.values(state.libraries).map((library) => {
        const { id, tag_id, volume, concentration, insert_size, template_prep_kit_box_barcode } =
          library
        const tag = pacbioRootStore.tags[tag_id]
        const tagGroupId = tag ? tag.group_id : ''
        return {
          id,
          barcode: state.tubes[library.tube].barcode,
          tag: tagGroupId,
          volume,
          concentration,
          insert_size,
          template_prep_kit_box_barcode,
        }
      })
    },
  },

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
        const error = hasDuplicateTags(csv)
        if (error) {
          return { success: false, errors: [error] }
        }
        const eachReordRetObj = eachRecord(
          csv,
          validateAndFormatAsPayloadData,
          requests,
          Object.values(tags),
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
          include: 'libraries.tube',
        })

        const { success, body: { included = [] } = {}, errors } = await handleResponse(promise)
        const { tubes = [], libraries = [] } = groupIncludedByResource(included)
        this.tubes = dataToObjectById({ data: tubes, includeRelationships: true })
        this.libraries = dataToObjectById({ data: libraries, includeRelationships: true })
        return { success, result: this.librariesInBatch, errors }
      } catch (error) {
        return { success: false, errors: [error] }
      }
    },
  },
})
