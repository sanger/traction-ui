import { defineStore } from 'pinia'
import { eachRecord } from '@/lib/csv/pacbio.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import useRootStore from '@/stores/index.js'
import { handleResponse } from '@/api/v2/ResponseHelper.js'
import { groupIncludedByResource } from '@/api/JsonApi.js'
import store from '@/store'
import { validateAndFormatAsPayloadData } from '@/stores/utilities/pacbioLibraryBatches.js'
import { dataToObjectById } from '@/api/JsonApi.js'

export const usePacbioLibraryBatchesStore = defineStore('pacbioLibraryBatches', {
  state: () => ({
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
    async createLibraryBatch(csvFile, tagSet) {
      if (!tagSet) {
        return { success: false, errors: ['tagSet is required'] }
      }
      if (!csvFile) {
        return { success: false, errors: ['csvFile is required'] }
      }
      try {
        const { requests, tags } = await this._fetchTagsAndRequests(tagSet)

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

        const librariesAttributes = eachReordRetObj.map((r) => r.result)

        const { success, tubes, errors } =
          await this._createLibraryBatcheRequest(librariesAttributes)

        const barcodes = tubes.map((tube) => tube.attributes.barcode)
        return { success, barcodes, errors }
      } catch (error) {
        return { success: false, errors: [error] }
      }
    },

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

    async _fetchTagsAndRequests(tagSet) {
      const pacbioRootStore = usePacbioRootStore()
      await store.dispatch('traction/pacbio/requests/setRequests')
      const requests = store.getters['traction/pacbio/requests/requests']
      await pacbioRootStore.fetchPacbioTagSets()
      const tags = tagSet.tags.map((tag) => pacbioRootStore.tags[tag.id ?? tag])
      //const requests = Object.values(requests)
      return { requests, tags }
    },

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

    _hasDuplicateSources(csvText) {
      const lines = csvText.split('\n')
      const sources = new Set()
      const duplicates = []

      lines.slice(1).forEach((line) => {
        // Skip the header line
        const source = line.split(',')[0]
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
