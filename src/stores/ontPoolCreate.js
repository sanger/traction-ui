import { defineStore } from 'pinia'
import { wellToIndex } from './utilities/wellHelpers.js'
import { handleResponse } from '@/api/ResponseHelper.js'
import useRootStore from '@/stores/index.js'
import { dataToObjectById, extractAttributes, groupIncludedByResource } from '@/api/JsonApi.js'
import { sourceRegex } from './utilities/helpers.js'
import {
  newLibrary,
  validate,
  valid,
  payload,
  autoTagPlate,
  autoTagTube,
  buildTagAttributes,
  findRequestsForSource,
  populatePoolingLibraries,
} from './utilities/ontPool.js'
/**
 * Used for combining objects based on id
 * TODO: Move to helper
 */
const mergeRepresentations = (parent, child, keyFunction = (id) => id) => {
  return Object.values(parent).map((parentRecord) => {
    return { ...child[keyFunction(parentRecord.id)], ...parentRecord }
  })
}

/**
 * Orders the well resources by column/row index
 * @param resources The Vuex state resources object
 */
const sortRequestByWellColumnIndex = (resources) => (a, b) =>
  wellToIndex(resources.wells[a.well] || { position: 'A1' }) -
  wellToIndex(resources.wells[b.well] || { position: 'A1' })

/**
 * Defines a store for managing Ont pool creation.
 *
 * @exports useOntPoolCreateStore
 */
export const useOntPoolCreateStore = defineStore('ontPoolCreate', {
  state: () => ({
    resources: {
      // The main plate store. Represents the authoritative source of plate
      // information. Plates are indexed by id.
      plates: {},
      // The main tube store. Represents the authoritative source of tube
      // information. Plates are indexed by id.
      tubes: {},
      /**
       * The main source of well information. Wells are indexed by id.
       * Populated by the wells included in the request for plates.
       * @example {"id":"1","type":"wells","position":"A1","requests":["1"]}
       */
      wells: {},
      // The main source of request information. Requests are indexed by id.
      // Populated by the requests included in the request for plates.
      requests: {},
      // The main source of tagSet information. tagSets are indexed by id.
      tagSets: {},
      // The main source of tagSet information. tagSets are indexed by id.
      // Populated by the tags from a tag set
      tags: {},
      // The main source of pool information. Pools are indexed by id.
      pools: {},
      // The main source of library information. libraries are indexed by id.
      libraries: {},
    },
    selected: {
      // Object reflecting the id of the selected tag set and a selected
      // attribute.
      // eg { id: '1' }
      tagSet: {},
      // Object representing all selected plates. Selected plates are indexed by
      // id. Each plate is represented by an object with an id and a selected
      // attribute { id: 'plate_id', selected: true }
      plates: {},
      // Object representing all selected tubes. Selected tubes are indexed by
      // id. Each tube is represented by an object with an id and a selected
      // attribute { id: 'tube_id', selected: true }
      tubes: {},
    },
    // Handles the store data for the pooling page
    pooling: {
      // Libraries. Indexed by an internally generated id.
      libraries: {},
      // Pool: The current pool being edited or created
      pool: {},
      // Tube: The tube for the current pool
      tube: {},
    },
  }),
  getters: {
    /**
     * Returns the requests
     * @param {Object} state The state object
     */
    requests: (state) => Object.values(state.resources.requests),

    /**
     * Returns the pool
     * @param {Object} state The state object
     */
    poolItem: (state) => state.pooling.pool || {},

    /**
     * Returns the tube
     * @param {Object} state The state object
     */
    tubeItem: (state) => state.pooling.tube || {},

    /**
     * Returns a library
     * @param {Object} state The state object
     */
    libraryItem: (state) => (id) => state.pooling.libraries[id],

    /**
     * Returns a list of selected plates
     * @param {Object} state The state object
     */
    selectedPlates: ({ selected, resources }) =>
      mergeRepresentations(selected.plates, resources.plates),

    /**
     * Returns a list of selected tubes
     * @param {Object} state The state object
     */
    selectedTubes: ({ selected, resources }) =>
      mergeRepresentations(selected.tubes, resources.tubes),

    /**
     * Returns a list of all fetched wells
     * @param {Object} state The state object
     */
    wellList: (state) => (ids) => {
      const wells = state.resources.wells
      if (ids) {
        return ids.map((id) => wells[id])
      } else {
        return wells.values
      }
    },
    /**
     * Returns a list of all fetched requests
     * @param {Object} state The Vuex state object
     */
    requestList: (state) => (ids) => {
      const requests = state.resources.requests
      const selectedRequests = state.pooling.libraries
      if (ids) {
        return ids.map((id) => {
          return { ...requests[id], selected: !!selectedRequests[id] }
        })
      } else {
        return Object.values(requests).map((request) => {
          return { ...request, selected: !!selectedRequests[request.id] }
        })
      }
    },

    /**
     * Returns a list of all fetched tagSet
     * @param {Object} state The Vuex state object
     */
    tagSetList: (state) => {
      return Object.values(state.resources.tagSets)
    },

    /**
     * Returns a list of all fetched tagSet
     * @param {Object} state The Vuex state object
     */
    tagList: (state) => (ids) => {
      const tags = state.resources.tags
      if (ids) {
        return ids.map((id) => tags[id])
      } else {
        return tags.values
      }
    },

    /**
     * Returns the selected tag set
     * @param {Object} state The Vuex state object
     */
    selectedTagSet: ({ resources, selected }) => {
      if (selected.tagSet.id) {
        const tagSet = resources.tagSets[selected.tagSet.id]
        const tags = tagSet.tags.map((tag) => resources.tags[tag])
        return { ...tagSet, tags }
      } else {
        return { id: null, tags: [] }
      }
    },

    /**
     * Returns a list of selected requests
     *
     * Note: Ordering is grouped by plate (in id order) and sorted in column order
     * @param {Object} state The Vuex state object
     * @return {Array} An array of selected requests in the order in which they were selected
     */
    selectedRequests: ({ pooling, resources }) => {
      return Object.values(pooling.libraries)
        .map(({ ont_request_id }) => ({
          ...resources.requests[ont_request_id],
          selected: true,
        }))
        .sort(sortRequestByWellColumnIndex(resources))
    },

    /**
     * Returns a list of pools
     *
     * @param {Object} state The Vuex state object
     * @return {Array} An array of selected requests in the order in which they were selected
     */
    pools: (state) => {
      // We catch here in case this getter is called when the resources aren't pulled
      try {
        return Object.values(state.resources.pools).map((pool) => {
          const libraries = pool.libraries.map((libraryId) => {
            const { id, type, request, tag } = state.resources.libraries[libraryId]
            const { sample_name } = state.resources.requests[request]
            const { group_id } = state.resources.tags[tag] || {}
            return { id, type, sample_name, group_id }
          })

          const { barcode } = state.resources.tubes[pool.tube]
          return {
            ...pool,
            libraries,
            barcode,
          }
        })
      } catch {
        return []
      }
    },
  },
  actions: {
    /**
     * Fetches ONT requests from the API with optional filters and pagination.
     *
     * @param {Object} filter - Optional filters to apply to the request.
     * @param {Object} page - Optional pagination parameters.
     * @returns {Object} - An object containing the success status, errors, and meta information.
     */
    async fetchOntRequests(filter = {}, page = {}) {
      const rootStore = useRootStore()

      const request = rootStore.api.traction.ont.requests
      const promise = request.get({ page, filter })
      const response = await handleResponse(promise)

      const { success, body: { data, meta = {} } = {}, errors = [] } = response

      if (success) {
        this.resources.requests = dataToObjectById({ data, includeRelationships: true })
      }

      return { success, errors, meta }
    },

    /**
     * Fetches ONT pools from the API with optional filters and pagination.
     *
     * @param {Object} filter - Optional filters to apply to the request.
     * @param {Object} page - Optional pagination parameters.
     * @returns {Object} - An object containing the success status, errors, and meta information.
     */
    async fetchOntPools(filter = {}, page = {}) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.pools
      const promise = request.get({
        page,
        filter,
        include: 'tube,libraries.tag,libraries.request',
      })
      const response = await handleResponse(promise)

      const { success, body: { data, included = [], meta = {} } = {}, errors = [] } = response
      const { tubes, libraries, tags, requests } = groupIncludedByResource(included)

      if (success) {
        this.resources.requests = dataToObjectById({ data: requests, includeRelationships: true })
        this.resources.tubes = dataToObjectById({ data: tubes, includeRelationships: true })
        this.resources.libraries = dataToObjectById({ data: libraries, includeRelationships: true })
        this.resources.tags = dataToObjectById({ data: tags, includeRelationships: true })
        this.resources.pools = dataToObjectById({ data, includeRelationships: true })
      }

      return { success, errors, meta }
    },

    /**
     * Fetches ONT tag sets from the API.
     *
     * @returns {Object} - An object containing the success status, errors, and the response.
     */
    async fetchOntTagSets() {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.tag_sets
      const promise = request.get({ include: 'tags' })
      const response = await handleResponse(promise)

      const { success, body: { data, included = [] } = {}, errors = [] } = response

      const { tags } = groupIncludedByResource(included)

      if (success) {
        this.resources.tagSets = dataToObjectById({ data, includeRelationships: true })
        this.resources.tags = dataToObjectById({ data: tags })
      }

      return { success, errors, response }
    },

    /**
     * Selects or deselects well requests based on the given well ID.
     *
     * This method will:
     *  * Add new library requests to the pooling libraries if they are not already selected.
     *  * Remove library requests from the pooling libraries if they are already selected.
     *
     * @param {string} well_id - The ID of the well whose requests are being selected or deselected.
     */
    selectWellRequests(well_id) {
      const { requests } = this.resources.wells[well_id]
      const selectedRequests = this.pooling.libraries
      for (const id of requests) {
        if (!selectedRequests[id]) {
          this.pooling.libraries[`${id}`] = newLibrary({ ont_request_id: id })
        } else {
          delete this.pooling.libraries[`${id}`]
        }
      }
    },

    /**
     * Deselects a plate and all its contents (wells and requests) based on the given plate ID.
     *
     * This method will:
     *  * Remove the plate from the selected plates.
     *  * Remove all wells associated with the plate.
     *  * Remove all requests associated with each well.
     *  * Remove all libraries associated with each request in well.
     *  * Remove the plate from the resources.
     *
     * @param {string} plateId - The ID of the plate to be deselected.
     */
    deselectPlateAndContents(plateId) {
      delete this.selected.plates[`${plateId}`]
      const { wells } = this.resources.plates[plateId]
      for (const wellId of wells) {
        const { requests = [] } = this.resources.wells[wellId]
        for (const requestId of requests) {
          delete this.pooling.libraries[`${requestId}`]
          delete this.resources.requests[requestId]
        }
        delete this.resources.wells[wellId]
      }
      delete this.resources.plates[plateId]
    },

    /**
     * Creates a new ONT pool.
     *
     * This method will:
     *  * Validate the libraries in the pool.
     *  * If the libraries are not valid, it will return an error.
     *  * If the libraries are valid, it will make an API call to create the pool.
     *  * The API call will include the libraries and the pool data, and will request to include the tube in the response.
     *  * The response will be handled to extract the success status, included resources, and errors.
     *  * The tube's barcode will be extracted from the included resources.
     *
     * @returns {Object} - An object containing the success status, the tube's barcode, and any errors.
     */
    async createPool() {
      const rootStore = useRootStore()
      const libraries = this.pooling.libraries
      validate({ libraries })
      if (!valid({ libraries })) return { success: false, errors: 'The pool is invalid' }
      const request = rootStore.api.traction.ont.pools
      const promise = request.create({
        data: payload({ libraries, pool: this.pooling.pool }),
        include: 'tube',
      })
      const { success, body: { included = [] } = {}, errors } = await handleResponse(promise)
      const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
      const { attributes: { barcode = '' } = {} } = tube
      return { success, barcode, errors }
    },

    /**
     * Updates an existing ONT pool.
     *
     * This method will:
     *  * Validate the libraries in the pool.
     *  * If the libraries are not valid, it will return an error.
     *  * If the libraries are valid, it will make an API call to update the pool.
     *  * The API call will include the libraries and the pool data.
     *  * The response will be handled to extract the success status and errors.
     *
     * @returns {Object} - An object containing the success status and any errors.
     */
    async updatePool() {
      const rootStore = useRootStore()
      const libraries = this.pooling.libraries
      validate({ libraries })
      if (!valid({ libraries })) return { success: false, errors: 'The pool is invalid' }
      const request = rootStore.api.traction.ont.pools
      const promise = request.update(payload({ libraries, pool: this.pooling.pool }))
      const { success, errors } = await handleResponse(promise)
      return { success, errors }
    },

    /*
     * Given a tag change to library_a, will automatically apply tags to the remaining wells
     * on the plate with the following  rules:
     * - Only apply additional tags if autoTag is true
     * - Tags applied in column order based on the source well
     * - Do not apply tags that appear earlier on the plate
     * - Do not apply tags to request originating from other plates
     * - Offset tags based on well position, ignoring occupancy. For example
     *   if tag 2 was applied to A1, then C1 would receive tag 4 regardless
     *   the state of B1.
     * @param {Object} library - The library object containing the well and tag information.
     * @param {boolean} autoTag - Flag indicating whether to apply tags automatically.
     *
     */
    async applyTags(library, autoTag) {
      this.pooling.libraries[`${library.ont_request_id}`] = {
        ...this.pooling.libraries[library.ont_request_id],
        ...library,
      }
      if (autoTag) {
        const request = this.resources.requests[library.ont_request_id]
        const plateMatch = request.source_identifier.match(sourceRegex)?.groups.wellName
        const { wells, requests, tagSets, tubes } = this.resources
        if (plateMatch) {
          const taggedLibraries = autoTagPlate({
            wells,
            requests,
            tagSets,
            library,
            selectedTagSet: this.selectedTagSet,
            libraries: this.pooling.libraries,
          })
          this.pooling.libraries = taggedLibraries
        } else {
          const taggedLibraries = autoTagTube({
            tagSets,
            tubes,
            selectedTagSet: this.selectedTagSet,
            selectedRequests: this.selectedRequests,
            libraries: this.pooling.libraries,
            library,
          })
          this.pooling.libraries = taggedLibraries
        }
      }
    },
    /**
     * Selects of deselects a plate based on the params
     * @param id The id of the plate to select
     * @param selected Defaults to true, selects or deselects the plate
     */
    selectPlate(id, selected = true) {
      if (selected) {
        this.selected.plates[`${id}`] = { id, selected: true }
      } else {
        delete this.selected.plates[`${id}`]
      }
    },
    /**
     * Selects of deselects a tube based on the params
     * @param id The id of the tube to select
     * @param selected Defaults to true, selects or deselects the tube
     */
    selectTube(id, selected = true) {
      if (selected) {
        this.selected.tubes[`${id}`] = { id, selected: true }
      } else {
        delete this.selected.tubes[`${id}`]
      }
    },
    /**
     * Updates the library data from a CSV record.
     *
     * @param {Object} params - The parameters for the function.
     * @param {Object} params.record - The CSV record containing the library data.
     * @param {string} params.record.source - The source identifier (e.g., barcode or well).
     * @param {string} params.record.tag - The tag associated with the library.
     * @param {Object} params.record.attributes - Additional attributes for the library.
     * @param {Object} params.info - Information about the CSV record (e.g., row number).
     *
     * @description
     * This function processes a CSV record to update the library data. It:
     * - Validates the presence of a source identifier in the record.
     * - Matches the source identifier to extract relevant data (e.g., barcode or well).
     * - Finds requests associated with the source and validates their existence.
     * - Builds tag attributes for the library based on the selected tag set.
     * - Selects the plate or tube associated with the source.
     * - Updates the pooling libraries with the new library data, including tag attributes and additional attributes.
     * - Logs messages for any errors or successful updates.
     */
    updateLibraryFromCsvRecord({ record: { source, tag, ...attributes }, info }) {
      const rootStore = useRootStore()

      // Validate the presence of a source identifier
      if (!source) {
        rootStore.addCSVLogMessage(info, 'has no source')
        return
      }

      // Match the source identifier to extract relevant data
      const match = source.match(sourceRegex)
      const sourceData = match?.groups || { barcode: source }

      // Find requests associated with the source
      const { success, errors, requestIds, ...labware } = findRequestsForSource({
        sourceData,
        resources: this.resources,
      })

      // Handle errors or missing requests
      if (!success) {
        rootStore.addCSVLogMessage(info, errors)
        return
      }
      if (requestIds.length === 0) {
        rootStore.addCSVLogMessage(info, `no requests associated with ${source}`)
        return
      }

      // Build tag attributes for the library
      const tagAttributes = buildTagAttributes(this.selectedTagSet, tag)
      if (tagAttributes.error) {
        rootStore.addCSVLogMessage(info, tagAttributes.error)
        return
      }

      // Select the plate or tube associated with the source
      labware.plate
        ? this.selectPlate(labware.plate.id, true)
        : this.selectTube(labware.tube.id, true)

      // Update the pooling libraries with the new library data
      requestIds.forEach((ont_request_id) => {
        if (!this.pooling.libraries[ont_request_id]) {
          // Log a message for adding a new library
          rootStore.addCSVLogMessage(info, `Added ${source} to pool`, 'info')
        }
        this.pooling.libraries[`${ont_request_id}`] = {
          ...this.pooling.libraries[ont_request_id],
          ont_request_id,
          ...tagAttributes,
          ...attributes,
        }
      })
    },

    /**
     * Clears the pool data while preserving the resources.
     * Stores the current resources, resets the state, and then restores the resources.
     *
     * @example
     * // Clear the pool data
     * clearPoolData();
     */
    clearPoolData() {
      const resources = this.resources
      this.$reset()
      this.resources = resources
    },

    /**
     * Sets the pool data for a given pool ID.
     *
     * @param {string|number} id - The ID of the pool to fetch data for. If the ID is not a number (e.g., 'new'), the function will clear the pool data and return early.
     * @returns {Object} - An object containing the success status and any errors encountered during the operation.
     *
     * @description
     * This function fetches and sets the data for a specific pool. It:
     * - Clears the current pool data to ensure a clean state.
     * - Validates the provided ID to ensure it is a number. If not, it skips fetching and returns success.
     * - Sends a request to the API to fetch the pool data, including related resources such as libraries, requests, wells, plates, and tubes.
     * - Processes the API response to extract and organize the data into the store's resources.
     * - Updates the store's `pooling` state with the fetched pool, libraries, and tube data.
     * - Updates the store's `resources` state with the fetched tubes, requests, wells, and plates.
     * - Automatically selects the fetched plates and tubes in the store.
     *
     * @example
     * const result = await setPoolData(123)
     * if (result.success) {
     *   console.log('Pool data successfully set')
     * } else {
     *   console.error(result.errors)
     * }
     */
    async setPoolData(id) {
      const rootStore = useRootStore()
      this.clearPoolData()

      // Guard clause to not run the rest if the id is not a number (e.g., 'new')
      if (isNaN(id)) {
        return { success: true, errors: [] }
      }

      // Send a request to the API to fetch the pool data
      const request = rootStore.api.traction.ont.pools
      const promise = request.find({
        id: id,
        include:
          'libraries.tag.tag_set,libraries.source_plate.wells.requests,libraries.source_tube.requests,libraries.request,tube',
      })
      const response = await handleResponse(promise)
      const { success, body: { data, included = [] } = {}, errors = [] } = response

      if (success) {
        const {
          libraries,
          requests,
          wells,
          plates = [],
          tag_sets: [tag_set] = [{}],
          tubes,
        } = groupIncludedByResource(included)

        // Find the pool tube in the list of returned tubes
        const poolingTube = tubes.find((tube) => tube.id == data.relationships.tube.data.id)

        // Update the store's pooling state
        this.pooling.pool = extractAttributes(data)
        this.pooling.libraries = populatePoolingLibraries(libraries)
        this.pooling.tube = extractAttributes(poolingTube)

        // Update the store's resources
        this.resources.tubes = dataToObjectById({ data: tubes, includeRelationships: true })
        this.resources.requests = dataToObjectById({ data: requests, includeRelationships: true })
        this.resources.wells = dataToObjectById({ data: wells, includeRelationships: true })
        this.resources.plates = dataToObjectById({ data: plates, includeRelationships: true })
        this.selected.tagSet = { id: tag_set.id }

        // Automatically select the fetched plates and tubes
        Object.keys(this.resources.plates).map((id) => this.selectPlate(id))
        Object.keys(this.resources.tubes).map((id) => this.selectTube(id))
      }

      // Return the success status and any errors
      return { success, errors }
    },

    /**
     * Finds an ONT plate based on the provided filter.
     *
     * @param {Object} filter - The filter object used to search for the plate. Must include a `barcode` field.
     * @returns {Object} - An object containing the success status and any errors encountered during the search.
     *
     * @description
     * This function searches for an ONT plate using the provided filter. It:
     * - Validates that the filter contains a non-empty `barcode` field.
     * - Sends a request to the API to fetch plates matching the filter, including their wells and associated requests.
     * - Processes the API response to extract plates, wells, and requests.
     * - Updates the store's resources with the fetched data if the search is successful.
     * - Selects the first plate from the results and updates the selected plates in the store.
     * - Returns an error if no plates match the filter or if the filter is invalid.
     *
     * @example
     * const filter = { barcode: 'PLATE123' }
     * const result = await findOntPlate(filter)
     * if (result.success) {
     *   console.log('Plate found and resources updated')
     * } else {
     *   console.error(result.errors)
     * }
     */
    async findOntPlate(filter) {
      const rootStore = useRootStore()

      // Validate that the filter contains a non-empty barcode
      if (filter['barcode'].trim() === '') {
        return {
          success: false,
          errors: ['Please provide a plate barcode'],
        }
      }

      // Send a request to the API to fetch plates matching the filter
      const request = rootStore.api.traction.ont.plates
      const promise = request.get({ filter, include: 'wells.requests' })
      const response = await handleResponse(promise)

      // Extract data and included resources from the response
      let { success, body: { data, included = [] } = {}, errors = [] } = response
      const { wells, requests } = groupIncludedByResource(included)

      // Return an error if no plates match the filter
      if (!data.length) {
        success = false
        errors = [`Unable to find plate with barcode: ${filter['barcode']}`]
      }

      // If the search is successful, update the store's resources and select the plate
      if (success) {
        this.selectPlate(data[0].id)
        this.resources.plates = dataToObjectById({ data, includeRelationships: true })
        this.resources.wells = dataToObjectById({ data: wells, includeRelationships: true })
        this.resources.requests = dataToObjectById({ data: requests, includeRelationships: true })
      }

      // Return the success status and any errors
      return { success, errors }
    },

    /**
     * Finds an ONT tube based on the provided filter.
     *
     * @param {Object} filter - The filter object used to search for the tube. Must include a `barcode` field.
     * @returns {Object} - An object containing the success status and any errors encountered during the search.
     *
     * @description
     * This function searches for an ONT tube using the provided filter. It:
     * - Validates that the filter contains a non-empty `barcode` field.
     * - Sends a request to the API to fetch tubes matching the filter, including their associated requests.
     * - Processes the API response to extract tubes and requests.
     * - Updates the store's resources with the fetched data if the search is successful.
     * - Selects the first tube from the results and updates the selected tubes in the store.
     * - Returns an error if no tubes match the filter or if the filter is invalid.
     *
     * @example
     * const filter = { barcode: 'TUBE123' }
     * const result = await findOntTube(filter)
     * if (result.success) {
     *   console.log('Tube found and resources updated')
     * } else {
     *   console.error(result.errors)
     * }
     */
    async findOntTube(filter) {
      const rootStore = useRootStore()

      // Validate that the filter contains a non-empty barcode
      if (filter['barcode'].trim() === '') {
        return {
          success: false,
          errors: ['Please provide a tube barcode'],
        }
      }

      // Send a request to the API to fetch tubes matching the filter
      const request = rootStore.api.traction.ont.tubes
      const promise = request.get({ filter, include: 'requests' })
      const response = await handleResponse(promise)

      // Extract data and included resources from the response
      let { success, body: { data, included = [] } = {}, errors = [] } = response
      const { requests } = groupIncludedByResource(included)

      // Return an error if no tubes match the filter
      if (!data.length) {
        success = false
        errors = [`Unable to find tube with barcode: ${filter['barcode']}`]
      }

      // If the search is successful, update the store's resources and select the tube
      if (success) {
        this.selectTube(data[0].id)
        this.resources.tubes = dataToObjectById({ data, includeRelationships: true })
        this.resources.requests = dataToObjectById({ data: requests, includeRelationships: true })
      }

      // Return the success status and any errors
      return { success, errors }
    },
  },
})
