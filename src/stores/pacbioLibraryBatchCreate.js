import { defineStore } from 'pinia'
import { eachRecord } from '@/lib/csv/pacbio.js'
import useRootStore from '@/stores/index.js'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource } from '@/api/JsonApi.js'
import {
  validateAndFormatAsPayloadData,
  fetchTagsAndRequests,
} from '@/stores/utilities/pacbioLibraryBatches.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import { getColumnValues, removeEmptyLines } from '@/lib/csv/pacbio.js'
import { findDuplicates } from '@/lib/DataHelpers.js'

/**
 * usePacbioLibraryBatchesStore is a store to manage pacbio library batches.
 * @returns {Object} - The store object.
 */
export const usePacbioLibraryBatchCreateStore = defineStore('pacbioLibraryBatchCreate', {
  state: () => ({
    /**
     * @property {Object} libraries - An object to store all libraries indexed by id.
     */
    libraries: {},
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
        const {
          id,
          tag_id,
          volume,
          concentration,
          insert_size,
          template_prep_kit_box_barcode,
          source_identifier,
          barcode,
        } = library
        const tag = pacbioRootStore.tags[tag_id]
        const tagGroupId = tag ? tag.group_id : ''
        return {
          id,
          barcode,
          source: source_identifier,
          tag: tagGroupId,
          volume,
          concentration,
          insert_size,
          template_prep_kit_box_barcode,
        }
      })
    },
    librariesInfoInPrintFormat: (state) =>
      Object.values(state.libraries).map(({ barcode, source_identifier }) => ({
        barcode,
        source_identifier,
      })),
  },

  actions: {
    /**
     * Creates a library batch from a CSV file and a tag set.
     *
     * @param {File} csvFile - The CSV file containing library batch data.
     * @param {Object} tagSet - The tag set name to validate against.
     * @returns {Promise<Object>} - The result of the library batch creation.
     */
    async createLibraryBatch(csvFile, tagSet) {
      // Check if the required parameters are provided
      if (!tagSet) {
        return { success: false, errors: 'tagSet is required' }
      }
      if (!csvFile) {
        return { success: false, errors: 'csvFile is required' }
      }
      try {
        let csv = await csvFile.text()

        // Remove empty lines from the CSV content
        csv = removeEmptyLines(csv)
        // Check if the CSV content is empty or has only headers
        if (csv.length === 0 || csv.split('\n').length <= 1) {
          return { success: false, errors: 'The provided csv file is empty' }
        }

        const sources = getColumnValues(csv, 0)
        const tagNames = getColumnValues(csv, 1)

        // Check for duplicate sources
        // Ignore empty sources in duplicate check as they will be better handled in validation step as missing data
        let duplicates = findDuplicates(sources).filter((d) => d !== '')
        if (duplicates.length) {
          return {
            success: false,
            errors: `Duplicate sources found in the csv: ${duplicates.join(', ')}`,
          }
        }

        // Check for duplicate tags
        duplicates = findDuplicates(tagNames)
        if (duplicates.length) {
          return {
            success: false,
            errors: `Duplicate tags found in the csv: ${duplicates.join(', ')}`,
          }
        }

        // Fetch the tags and requests
        const { requests, tags } = await fetchTagsAndRequests(sources, tagSet)

        if (requests.length === 0) {
          return { success: false, errors: 'None of the given sources (/samples) were found' }
        }
        if (tags.length === 0) {
          return { success: false, errors: 'None of the given tags found' }
        }

        // Validate csv and return results
        const eachReordRetObj = eachRecord(
          csv,
          validateAndFormatAsPayloadData,
          false,
          requests,
          tags,
        )
        if (eachReordRetObj.error) {
          return { success: false, errors: eachReordRetObj.error }
        }

        // Create the library batch request
        const librariesAttributes = eachReordRetObj.map((r) => r.result)
        const rootStore = useRootStore()
        const libraryBatches = rootStore.api.traction.pacbio.library_batches
        const promise = libraryBatches.create({
          data: {
            data: {
              type: 'library_batches',
              attributes: {
                libraries_attributes: librariesAttributes,
              },
            },
          },
          include: 'libraries',
        })
        const { success, body: { included = [] } = {}, errors } = await handleResponse(promise)
        const { libraries = [] } = groupIncludedByResource(included)
        this.libraries = dataToObjectById({ data: libraries, includeRelationships: true })
        return { success, result: this.librariesInBatch, errors }
      } catch (error) {
        return { success: false, errors: error.message }
      }
    },
  },
})
