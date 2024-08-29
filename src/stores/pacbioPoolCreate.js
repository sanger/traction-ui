import { defineStore } from 'pinia'
import { wellToIndex, wellFor } from '@/stores/utilities/wellHelpers.js'
import { handleResponse } from '@/api/v1/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'
import useRootStore from '@/stores'
import { validate, payload } from '@/stores/utilities/pool.js'
import { createUsedAliquot, isValidUsedAliquot } from './utilities/usedAliquot.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'

/**
 * Merge together two representations of the same object.
 * The parent object will be mapped over, and equivalent items from the
 * child object will be merged in. keyFunction allows for cases where there
 * is not a 1:1 mapping between ids.
 * @param {Object} parent the parent object, only resources in here will be present in the output.
 * @param {Object} child resources with a matching id will be merged into the parent
 * @param {fn} keyFunction convert id to the key format in the child
 * @example mergeRepresentations(requests,selectedUsedAliquots, id => `_${id}`)
 */
const mergeRepresentations = (parent, child, keyFunction = (id) => id) => {
  return Object.values(parent).map((parentRecord) => {
    return { ...child[keyFunction(parentRecord.id)], ...parentRecord }
  })
}

/**
 * This function sorts all requested based on the column index of the well they are in.
 * This takes a `resources` object and returns a comparator function for sorting requests by well column index.
 * The comparator function takes two requests `a` and `b`, retrieves their wells from `resources.wells` based on their `well` properties,
 * converts the wells to indices using the `wellToIndex` function, and returns the difference between the indices.
 * If a request does not have a well in `resources.wells`, it defaults to a well with a position of 'A1'.
 *
 * @param {*} resources
 * @returns {Array} sorted requests
 */
const sortRequestByWellColumnIndex = (resources) => (a, b) =>
  wellToIndex(resources.wells[a.well] || { position: 'A1' }) -
  wellToIndex(resources.wells[b.well] || { position: 'A1' })

/**
 * Sort the requests based on their labware. Tubes will be sorted after plates,
 * and then each labware is sorted in id order
 * @param {*} resources  The resources object
 * @returns  {Array} sorted requests
 */
const sortRequestByLabware = (resources) => (a, b) => {
  if (a.tube && b.tube) {
    // Both our tubes
    return parseInt(a.tube) - parseInt(b.tube)
  } else if (a.well && b.well) {
    // Both are plates
    return parseInt(resources.wells[a.well].plate) - parseInt(resources.wells[b.well].plate)
  } else {
    // A plate and a tube
    return parseInt(a.tube || 0) - parseInt(b.tube || 0)
  }
}

/**
 * This regular expression matches string that start with an alphanumeric string or hyphens (captured in a group called 'barcode')
 * followed by an optional colon and a well name (captured as 'wellName').
 * The well name is a letter followed by a number or two numbers.
 *
 * @type {RegExp}
 * @example "TRAC-1:A1"
 */
const sourceRegex = /^(?<barcode>[\w-]+)(:(?<wellName>\w[0-9]{1,2})){0,1}$/

/**
 * Generates an error message for a barcode that could not be found.
 * The message includes the format that the barcode should be in for plates and tubes.
 *
 * @param {string} barcode - The barcode that could not be found.
 * @returns {string} The generated error message.
 */
const barcodeNotFound = (barcode) =>
  `${barcode} could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.`

/**
 * Defines a store for managing Pacbio pool creation.
 *
 * @exports usePacbioPoolCreateStore
 */
export const usePacbioPoolCreateStore = defineStore('pacbioPoolCreate', {
  state: () => ({
    /**
     * Resources returned by the server, each key represents a resource type.
     * resource types are indexed by their id.
     */
    resources: {
      /**
       * An object to store the plates.
       * Each key-value pair represents a plate, where the key is the plate ID and the value is the plate data.
       * @type {Object.<string, Object>}
       * @example
       * "1": {"id": "1","type": "plates","barcode": "DN2","created_at": "2021/11/30 13:57","wells": ["1","2","3","4","5","6","7","8"]}
       */
      plates: {},

      /**
       * The main tube store. Represents the authoritative source of tube information.
       * Tubes are indexed by id. Each key-value pair represents a tube, where the key is the tube ID and the value is the tube data.
       * @type {Object.<string, Object>}
       * @example  "1": {"id": "1","type": "tubes","barcode": "3980000001795","requests": ["97"]}
       */
      tubes: {},

      /**
       * The main source of well information. Wells are indexed by id.
       * Populated by the wells included in the request for plates.
       * @type {Object.<string, Object>}
       * @example  "1": { "id": "1", "type": "wells", "position": "A1", "requests": ["1"], "plate": "1" },
                   "2": { "id": "2", "type": "wells", "position": "A2", "requests": ["2"], "plate": "1" },
       */
      wells: {},

      /**
       * The main source of request information. Requests are indexed by id.
       * Each key-value pair represents a request, where the key is the resuest ID and the value is the request data.
       * Populated by the requests included in the request for plates.
       * @type {Object.<string, Object>}
       * @example "1": {"id": "1","type": "requests",
       *                 "estimate_of_gb_required": 100,"number_of_smrt_cells": 3,"cost_code": "PSD1234",
       *                 "external_study_id": "1","sample_name": "Sample48","barcode": null,"sample_species": "human",
       *                 "created_at": "2021/11/30 13:57","source_identifier": "DN1:A1","well": "1","plate": "1"}
       */
      requests: {},

      /**
       * The main source of libraries information. Libraries are indexed by id.
       * Each key-value pair represents a library, where the key is the library ID and the value is the library data.
       * Populated by the libraries included in the request for tubes.
       * @type {Object.<string, Object>}
       * @example "1": {"id": "1","type": "libraries","requests": "1","tag_id": "1","template_prep_kit_box_barcode":"123213131231321321313","volume": 10,"concentration": 5,"insert_size": 1000}
       */
      libraries: {},
    },
    //Selected collects together user input in the front end, such as selected plates, used_aliquots and tubes.
    selected: {
      /**
       * Object reflecting the id of the selected tag set and a selected
       * attribute.
       * eg { id: '1' }
       */
      tagSet: {},
      /**
       * Object representing all selected plates. Selected plates are indexed by
       * id. Each plate is represented by an object with an id and a selected
       * attribute { id: 'plate_id', selected: true }
       */
      plates: {},
      /**
       * Object representing all selected tubes. Selected tubes are indexed by
       * id. Each tube is represented by an object with an id and a selected
       * attribute { id: 'tube_id', selected: true }
       */
      tubes: {},
    },
    /* used_aliquots. Indexed by source_id.
     When a used aliquot is selected, it is added to this object with the key being the source_id prefixed by '_'.
     The '_' ensures keys are maintained in insertion order, not numeric order.
     This allow maintain the order in which they were selected'*/
    used_aliquots: {},
    // Pool: The current pool being edited or created
    pool: {},
    // Tube: The tube for the current pool
    tube: {},
  }),
  getters: {
    /**
     * This function takes an object with a `selected` property and returns a tag set.
     * If the `selected` object has a `tagSet` with an `id`, it retrieves the corresponding tag set from the `pacbioRoot` store,
     * maps over its `tags`, retrieves each tag from the `pacbioRoot` store, and returns a new object with the tag set and its tags.
     * If the `selected` object does not have a `tagSet` with an `id`, it returns an object with `id` set to `null` and `tags` as an empty array.
     *
     * @param {Object} param0 - An object with a `selected` (an object with a `tagSet` property) property.
     * @returns {Object} The tag set with its tags or an object with `id` set to `null` and `tags` as an empty array.
     */
    selectedTagSet: ({ selected }) => {
      if (selected.tagSet && selected.tagSet.id) {
        const pacbioRoot = usePacbioRootStore()
        const tagSet = pacbioRoot.tagSets[selected.tagSet.id]
        const tags = tagSet.tags.map((tag) => pacbioRoot.tags[tag.id ?? tag])
        return { ...tagSet, tags }
      } else {
        return { id: null, tags: [] }
      }
    },
    /**
     * This function takes an object with `selected` and `resources` properties and returns a list of selected plates.
     * It merges the representations of `selected.plates` and `resources.plates` using the `mergeRepresentations` function.
     *
     * @param {Object} param0 - An object with `selected` and `resources` properties.
     * @returns {Object[]} The merged representations of the selected plates and the resource plates.
     */
    selectedPlates: ({ selected, resources }) =>
      mergeRepresentations(selected.plates, resources.plates),
    /**
     * This function takes an object with `selected` and `resources` properties and returns a list of selected tubes.
     * It merges the representations of `selected.tubes` and `resources.tubes` using the `mergeRepresentations` function.
     *
     * @param {Object} param0 - An object with `selected` and `resources` properties.
     * @returns {Object[]} The merged representations of the selected tubes and the resource tubes.
     */
    selectedTubes: ({ selected, resources }) =>
      mergeRepresentations(selected.tubes, resources.tubes),

    /**
     * This function takes an object with `used_aliquots` and `resources` properties and returns a list of selected requests.
     * It maps over the values of `used_aliquots`, retrieves each corresponding request from `resources.requests` based on the
     * `source_id`, adds a `selected` property set to `true` to each request, and then sorts the requests by well column
     *  index and labware using the `sortRequestByWellColumnIndex` and `sortRequestByLabware` functions.
     *
     * @param {Object} param0 - An object with `used_aliquots` and `resources` properties.
     * @returns {Object[]} The selected requests sorted by well column index and labware.
     */
    selectedUsedAliquots: ({ used_aliquots, resources }) => {
      return Object.values(used_aliquots)
        .map((aliquot) => {
          return {
            ...resources.requests[aliquot.request],
            ...aliquot,
            selected: true,
          }
        })
        .sort(sortRequestByWellColumnIndex(resources))
        .sort(sortRequestByLabware(resources))
    },

    /**
     * Returns a list of all fetched wells.
     * If IDs are provided, returns the wells with those IDs.
     * Otherwise, returns all wells.
     *
     * @param {Object} state - The Pinia state object.
     * @returns {Function} A function that takes an array of IDs and returns the corresponding wells.
     *
     * @example
     * // Get all wells
     * const allWells = wellList(state)();
     * // Get specific wells
     * const specificWells = wellList(['id1', 'id2']);
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
     * Returns a list of requests.
     * If a source object is provided, returns the requests for that source object.
     * Otherwise, returns all requests with a selected property indicating if they are in the selected requests with their source_id.
     *
     * @param {Object} state - The Pinia state object.
     * @returns {Function} A function that takes a source object and returns the corresponding requests with their source_id.
     *
     */
    requestList: (state) => (source_obj) => {
      const requests = state.resources.requests
      const selectedUsedAliquots = state.used_aliquots
      let val = []
      if (source_obj) {
        const source_id = source_obj.source_id ?? source_obj.id
        const used_aliquot = state.used_aliquots[`_${source_id}`]
        const selected = !!used_aliquot
        val = source_obj['requests']?.map((id) => {
          return { ...requests[id], selected, source_id }
        })
      } else {
        val = Object.values(requests).map((request) => {
          const source = request.tube || request.well
          return { ...request, selected: !!selectedUsedAliquots[`_${source}`] }
        })
      }
      return val
    },
    /**
     * Returns a specific used_aliquot item based on its ID.
     *
     * @param {Object} used_aliquots - The used_aliquots object.
     * @returns {Function} A function that takes an ID and returns the corresponding used_aliquots item.
     */
    usedAliquotItem: (state) => (id) => state.used_aliquots[`_${id}`],

    /**
     * Retrieves the tube item from the state. If the tibe item does not exist, returns an empty object.
     *
     * @param {Object} state - The state object that contains the tube item.
     * @returns {Object} The tibe item from the state, or an empty object if it does not exist.
     */
    tubeItem: (state) => state.tube || {},

    sourceTypeForRequest: () => (request) =>
      request.tube || request.well ? 'Pacbio::Request' : 'Pacbio::Library',
  },
  actions: {
    /**
     * Automatically tags a plate based on the provided used_aliquot.
     * It iterates over all used_aliquots and updates the tag of each used_aliquot on the same plate and with a higher well index.
     *
     * @param {Object} used_aliquot - The used_aliquot object based on which the plate is tagged. Must have a 'source_id' and 'tag_id' property.
     * @example autoTagPlate({source_id: '1', tag_id: '1'})
     */
    autoTagPlate(used_aliquot) {
      // If the used_aliquot object is not valid or does not have a 'source_id' or 'tag_id' property, return without doing anything.
      if (!isValidUsedAliquot(used_aliquot, ['request', 'tag_id', 'source_id'])) return

      const pacbioRootStore = usePacbioRootStore()
      //Helper function to get the well for a given source_id
      const initialWell = wellFor(this.resources, used_aliquot.request)
      //Helper function to get the index of the well
      const initialIndex = wellToIndex(initialWell)
      //Get the tags for the selected tag set
      const tags = pacbioRootStore.tagSets[this.selected.tagSet.id].tags
      //Get the index of the tag for the given used_aliquot
      const initialTagIndex = tags.indexOf(used_aliquot.tag_id)
      //Get the plate for the given used_aliquot
      const plate = initialWell.plate

      //Iterate over all used_aliquots and update the tag of each used_aliquot on the same plate and with a higher well index.
      Object.values(this.used_aliquots).forEach((aliquot) => {
        const otherWell = wellFor(this.resources, aliquot.request)

        if (otherWell?.plate !== plate) return

        const offset = wellToIndex(otherWell) - initialIndex

        if (offset < 1) return

        const newTag = (initialTagIndex + offset) % tags.length
        this.updateUsedAliquot({ ...aliquot, tag_id: tags[newTag] })
      })
    },
    /**
     * Automatically tags a tube based on the provided used_aliquot.
     * If the used_aliquot is not valid or does not have a 'tag_id' or 'source_id' property, the function returns without doing anything.
     * Otherwise, it gets the initial tube and tags from the pacbioRootStore and the used_aliquot.
     * It then iterates over the selected requests, filters those with a tube id greater than the initial tube id,
     * and updates the used_aliquot tag for each of them.
     *
     * @param {Object} used_aliquot - The used_aliquot object based on which the tube is tagged. Must have a 'tag_id' property.
     * @example autoTagTube({tag_id: '1'})
     */
    autoTagTube(used_aliquot) {
      // If the used_aliquot object is not valid or does not have a 'tag_id' property, return without doing anything.
      if (!isValidUsedAliquot(used_aliquot, ['request', 'tag_id'])) return
      const pacbioRootStore = usePacbioRootStore()
      const initialTube = this.resources.tubes[this.resources.requests[used_aliquot.request]?.tube]
      const tags = pacbioRootStore.tagSets[this.selected.tagSet.id].tags
      const initialTagIndex = tags.indexOf(used_aliquot.tag_id)
      Object.values(this.selectedUsedAliquots)
        .filter((aliquotRequest) => {
          return aliquotRequest.tube && parseInt(aliquotRequest.tube) > parseInt(initialTube.id)
        })
        .forEach((usedAliquot, offset) => {
          const newTag = (initialTagIndex + offset + 1) % tags.length
          this.updateUsedAliquot({
            ...usedAliquot,
            tag_id: tags[newTag],
          })
        })
    },

    /**
     * Finds requests for a specific well on a plate based on the provided barcode and well name.
     * If the plate or well cannot be found, returns an object with success set to false and an error message.
     * If the plate and well can be found, selects the plate and returns an object with success set to true and the IDs of the requests for the well.
     *
     * @param {string} barcode - The barcode of the plate to find.
     * @param {string} wellName - The name of the well to find.
     * @returns {Object} An object with the success status and either the error message or the IDs of the requests.
     * @example requestsForPlate('DN1', 'A1');
     */
    requestsForPlate(barcode, wellName) {
      const { plates, wells } = this.resources
      const plate = Object.values(plates).find((plate) => plate.barcode == barcode)
      if (!plate) return { success: false, errors: barcodeNotFound(barcode) }

      // Ensure the plate is registered as selected
      this.selectPlate({ id: plate.id, selected: true })
      const wellId = plate.wells.find((well_id) => wells[well_id].position == wellName)
      if (!wellId)
        return {
          success: false,
          errors: `A well named ${wellName} could not be found on ${barcode}`,
        }
      return { success: true, requestIds: wells[wellId].requests, source_id: String(wellId) }
    },

    /**
     * Finds requests for a specific tube based on the provided barcode.
     * If the tube cannot be found, returns an object with success set to false and an error message.
     * If the tube can be found, selects the tube and returns an object with success set to true and the IDs of the requests for the tube.
     *
     * @param {string} barcode - The barcode of the tube to find.
     * @returns {Object} An object with the success status and either the error message or the IDs of the requests.
     */
    requestsForTube(barcode) {
      const tube = Object.values(this.resources.tubes).find((tube) => tube.barcode == barcode)
      if (!tube) return { success: false, errors: barcodeNotFound(barcode) }
      // Ensure the tube is registered as selected
      this.selectTube({ id: tube.id, selected: true })
      return { success: true, requestIds: tube.requests, source_id: String(tube.source_id) }
    },

    /**
     * Finds requests for a specific source based on the provided barcode and optionally a well name.
     * If a well name is provided, assumes the source is a plate and calls `requestsForPlate`.
     * If a well name is not provided, assumes the source is a tube and calls `requestsForTube`.
     *
     * @param {Object} payload - The payload object.
     * @param {string} payload.barcode - The barcode of the source.
     * @param {string} [payload.wellName] - The name of the well (optional).
     * @returns {Array} An array of requests for the source.
     *
     * @example
     * // Find requests for a plate
     * const requests = findRequestsForSource({ barcode: 'barcode123', wellName: 'A1' });
     * // Find requests for a tube
     * const requests = findRequestsForSource({ barcode: 'barcode123' });
     */
    findRequestsForSource({ barcode, wellName }) {
      if (wellName) {
        return this.requestsForPlate(barcode, wellName)
      } else {
        return this.requestsForTube(barcode)
      }
    },

    /**
     * Selects or deselects requests for a specific well based on the provided well ID.
     * Iterates over all requests for the well and toggles their selected status.
     *
     * @param {number} well_id - The ID of the well to select or deselect requests for.
     * @example selectWellRequests(1)
     */

    selectWellRequests(well_id) {
      const { requests } = this.resources.wells[well_id]
      const selectedUsedAliquotRequests = this.used_aliquots
      for (const id of requests) {
        const selected = !!selectedUsedAliquotRequests[`_${well_id}`]
        this.selectRequestInSource({ request: id, source_id: String(well_id), selected: !selected })
      }
    },

    /**
     * Updates a used_aliquot in the state used_aliquot object based on the provided used_aliquot object.
     * If the used_aliquot object is not valid or does not have a 'source_id' property, the function returns without doing anything.
     *
     * @param {Object} used_aliquot - The used_aliquot object to update. Must have a 'source_id' property.
     * @returns {void}
     * @example updateUsedAliquot({source_id: '1', tag_id: '1'})
     */
    updateUsedAliquot(used_aliquot) {
      // If the used_aliquot object is not valid or does not have a 'source_id'property, return without doing anything.
      if (!isValidUsedAliquot(used_aliquot)) {
        return
      }
      // Update the used_aliquot in the state used_aliquots object based on the provided used_aliquot object.
      const key = `_${used_aliquot.source_id}`
      this.used_aliquots[key] = { ...this.used_aliquots[key], ...used_aliquot }
    },

    /**
     * Deselects a plate and all its contents (wells and requests) based on the provided plate ID.
     * Iterates over all wells of the plate and for each well, iterates over all requests and deselects them.
     *
     * @param {number} plateId - The ID of the plate to deselect.
     * @returns {void}
     *
     * @example
     * // Deselect a plate and its contents
     * deselectPlateAndContents(1)
     */
    deselectPlateAndContents(plateId) {
      this.selectPlate({ id: plateId, selected: false })
      const { wells } = this.resources.plates[plateId]
      for (const wellId of wells) {
        const { requests = [] } = this.resources.wells[wellId]
        for (const requestId of requests) {
          this.selectRequestInSource({
            request: requestId,
            source_id: String(wellId),
            selected: false,
          })
        }
      }
    },

    /**
     * Deselects a tube and all its contents (requests) based on the provided tube barcode.
     * If the tube cannot be found, the function returns without doing anything.
     * If the tube can be found, deselects the tube and then iterates over all requests of the tube and deselects them.
     *
     * @param {string} id - The id of the tube to deselect.
     * @returns {void}
     *
     * @example
     * // Deselect a tube and its contents
     * deselectTubeAndContents('1')
     */
    deselectTubeAndContents(id) {
      const tube = this.resources.tubes[id]
      if (!tube) return
      this.selectTube({ id: tube.id, selected: false })
      const { requests } = this.resources.tubes[tube.id]
      for (const requestId of requests) {
        this.selectRequestInSource({
          request: requestId,
          source_id: String(tube.source_id),
          selected: false,
        })
      }
    },

    /**
     * Asynchronously creates a pool with the given used_aliquots and pools.
     * Validates the used_aliquots before proceeding.
     * If the used_aliquots are not valid, returns an error response.
     * Otherwise, sends a request to create the pool and handles the response.
     * Groups the included resources by type and extracts the barcode from the first tube.
     *
     * @async
     * @returns {Promise<Object>} A promise that resolves to an object containing the success status, barcode, and any errors.
     *
     * @example
     * // Create a pool
     * const result = await createPool();
     * console.log(result); // { success: true, barcode: 'barcode123', errors: [] }
     */
    async createPool() {
      const { used_aliquots, pool } = this
      if (!validate({ used_aliquots, pool }))
        return { success: false, errors: 'The pool is invalid' }
      const rootStore = useRootStore()
      const request = rootStore.api.v1.traction.pacbio.pools
      const promise = request.create({
        data: payload({ used_aliquots, pool }),
        include: 'tube',
      })
      const { success, data: { included = [] } = {}, errors } = await handleResponse(promise)
      const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
      const { attributes: { barcode = '' } = {} } = tube
      return { success, barcode, errors }
    },

    /**

     * Asynchronously creates a pool with the given used_aliquots and pools.
     * Validates the used_aliquots before proceeding.
     * If the used_aliquots are not valid, returns an error response.
     * Otherwise, sends a request to create the pool and handles the response.
     * Groups the included resources by type and extracts the barcode from the first tube.
     *
     * @async
     * @returns {Promise<Object>} A promise that resolves to an object containing the success status, barcode, and any errors.
     *
     * @example
     * // Create a pool
     * const result = await createPool();
     * console.log(result); // { success: true, barcode: 'barcode123', errors: [] }
     */
    async updatePool() {
      const { used_aliquots, pool } = this
      if (!validate({ used_aliquots, pool }))
        return { success: false, errors: 'The pool is invalid' }
      const rootStore = useRootStore()
      const request = rootStore.api.v1.traction.pacbio.pools
      const promise = request.update(payload({ used_aliquots, pool }))
      const { success, errors } = await handleResponse(promise)
      return { success, errors }
    },

    /**
     * Asynchronously populates used_aliquots from a pool with the given ID.
     * Sends a request to find the pool and includes all associated records.
     * If the request is successful, populates the pool, used_aliquots, requests, wells, plates, and tubes,
     * selects the tag set, and selects all the tubes and plates.
     *
     * @async
     * @param {number} poolId - The ID of the pool.
     * @returns {Promise<Object>} A promise that resolves to an object containing the success status and any errors.
     *
     * @example
     * // Populate used_aliquots from a pool
     * const result = await populateUsedAliquotsFromPool(1);
     * console.log(result); // { success: true, errors: [] }
     */
    async populateUsedAliquotsFromPool(poolId) {
      const rootStore = useRootStore()
      const request = rootStore.api.v1.traction.pacbio.pools
      const promise = request.find({
        id: poolId,
        include:
          'used_aliquots.tag.tag_set,requests.tube,tube,libraries.tube,libraries.request,requests.plate.wells.requests',
      })
      const response = await handleResponse(promise)

      const { success, data: { data, included = [] } = {}, errors = [] } = response
      if (success) {
        const {
          aliquots = [],
          requests,
          wells,
          plates = [],
          tag_sets: [tag_set] = [{}],
          tubes = [],
          libraries = [],
        } = groupIncludedByResource(included)

        //Populate pool attributes
        this.pool = {
          id: data.id,
          ...data.attributes,
        }

        //Populate requests
        this.resources.requests = dataToObjectById({
          data: requests,
          includeRelationships: true,
        })
        //Populate tubes
        this.resources.tubes = dataToObjectById({ data: tubes, includeRelationships: true })

        // Get the pool tube and remove it from tubes list
        this.tube = this.resources.tubes[data.relationships.tube.data.id]
        delete this.resources.tubes[data.relationships.tube.data.id]

        //Populate libraries
        this.resources.libraries = dataToObjectById({
          data: libraries,
          includeRelationships: true,
        })

        //Assign library request to tube if the tube has a library
        Object.values(this.resources.libraries).forEach((library) => {
          const request = this.resources.requests[library.request]
          this.resources.tubes[library.tube].requests = [request.id]
          this.resources.tubes[library.tube].source_id = String(library.id)
        })
        //Populate plates
        this.resources.plates = dataToObjectById({
          data: plates,
          includeRelationships: true,
        })

        //Populate wells
        this.resources.wells = dataToObjectById({ data: wells, includeRelationships: true })

        // Create used_aliquots
        const usedAliquots = dataToObjectById({
          data: aliquots,
          includeRelationships: true,
        })
        // Set the used_aliquots mapped to the source_id
        Object.values(usedAliquots).forEach((usedAliquot) => {
          usedAliquot.request = usedAliquot.id
          const usedAliquotObject = createUsedAliquot({
            ...usedAliquot,
            tag_id: usedAliquot.tag,
          })
          usedAliquotObject.setRequestAndVolume(this.resources.libraries)
          this.used_aliquots[`_${usedAliquotObject.source_id}`] = usedAliquotObject
        })

        //Selects all the tubes and plates
        Object.values(this.resources.tubes).forEach(({ id }) =>
          this.selectTube({ id, selected: true }),
        )
        Object.values(this.resources.plates).forEach(({ id }) =>
          this.selectPlate({ id, selected: true }),
        )

        //Select tag set
        this.selectTagSet(tag_set.id)
      }

      return { success, errors }
    },

    /**
     * Applies tags to a used_aliquot.
     * Always updates the used_aliquot first.
     * If autoTag is true, applies tags automatically based on whether the request has a well.
     * If the request has a well, applies tags to the plate.
     * Otherwise, applies tags to the tube.
     *
     *  Given a tag change to used_aliquot_a, will automatically apply tags to the remaining wells
     *  on the plate with the following  rules:
     * - Only apply additional tags if autoTag is true
     * - Tags applied in column order based on the source well
     * - Do not apply tags that appear earlier on the plate
     * - Do not apply tags to request originating from other plates
     * - Offset tags based on well position, ignoring occupancy. For example
     *   if tag 2 was applied to A1, then C1 would receive tag 4 regardless
     *   the state of B1.
     *
     * @param {Object} payload - The payload object.
     * @param {Object} payload.used_aliquot - The used_aliquot to which to apply tags.
     * @param {boolean} payload.autoTag - Whether to apply tags automatically.
     *
     * @example
     * // Apply tags to a used_aliquot
     * applyTags({ used_aliquot: aliquot1, autoTag: true });
     */
    applyTags({ used_aliquots, autoTag }) {
      // We always apply the first tag
      this.updateUsedAliquot(used_aliquots)
      if (autoTag) {
        const request = this.resources.requests[used_aliquots.request]
        if (request.well) {
          this.autoTagPlate(used_aliquots)
        } else {
          this.autoTagTube(used_aliquots)
        }
      }
    },

    /**
     * Updates a used_aliquot from a CSV record.
     * * Given a record extracted from a csv file, will update the corresponding used_aliquot
     * Each used_aliquot is identified by the key 'source' which consists of a string identifying
     * the source plate barcode and its well. eg. DN814597W-A10
     *
     * If the record has no source, logs a message and returns.
     * Otherwise, finds requests for the source and updates the used_aliquot accordingly.
     * If the record has a tag, finds a matching tag in the selected tag set and updates the used_aliquot with the tag's ID.
     * If no matching tag is found, logs a message.
     *
     * @param {Object} payload - The payload object.
     * @param {Object} payload.record - The CSV record.
     * @param {string} payload.record.source - The source of the record.
     * @param {string} [payload.record.tag] - The tag of the record (optional).
     * @param {Object} payload.record.attributes - The other attributes of the record.
     * @param {string} payload.info - The information for logging messages.
     *
     * @example
     * // Update a used_aliquot from a CSV record
     * updateUsedAliquotFromCsvRecord({ record: { source: 'source123', tag: 'tag123', attributes: {} }, info: 'info123' });
     */

    updateUsedAliquotFromCsvRecord({ record: { source, tag, ...attributes }, info }) {
      const rootStore = useRootStore()
      if (!source) {
        rootStore.addCSVLogMessage(info, 'has no source')
        return
      }
      const match = source.match(sourceRegex)
      const sourceData = match?.groups || { barcode: source }
      const { success, errors, requestIds, source_id } = this.findRequestsForSource(sourceData)

      if (!success) {
        rootStore.addCSVLogMessage(info, errors)
        return
      }
      if (requestIds.length === 0) {
        rootStore.addCSVLogMessage(info, `no requests associated with ${source}`)
        return
      }

      let tagAttributes = {}
      if (tag) {
        const matchedTag = this.selectedTagSet.tags.find(({ group_id }) => group_id === tag)
        if (matchedTag) {
          tagAttributes = { tag_id: matchedTag.id }
        } else {
          rootStore.addCSVLogMessage(
            info,
            `Could not find a tag named ${tag} in selected tag group`,
          )
        }
      }
      requestIds.forEach((request_id) => {
        const used_aliquot = this.used_aliquots[`_${source_id}`]
        if (!used_aliquot) {
          // We're adding a used_aliquot
          rootStore.addCSVLogMessage(info, `Added ${source} to pool`, 'info')
        }
        this.updateUsedAliquot({
          request: request_id,
          source_id,
          ...tagAttributes,
          ...attributes,
        })
      })
    },

    /**
     * Finds a PacBio plate based on a filter.
     * If the filter's barcode is empty, returns an error.
     * Otherwise, sends a GET request to the API to find plates that match the filter.
     * If no plates are found, returns an error.
     * If plates are found, selects the first plate, and populates the resources with the plates, wells, and requests.
     *
     * @async
     * @param {Object} filter - The filter to apply.
     * @param {string} filter.barcode - The barcode to filter by.
     * @returns {Promise<Object>} A promise that resolves to an object with a success boolean and an array of errors.
     *
     * @example
     * // Find a PacBio plate with a specific barcode
     * const result = await findPacbioPlate({ barcode: 'barcode123' });
     */
    async findPacbioPlate(filter) {
      // Here we want to make sure the filter exists
      // If it doesn't exist the request will return all plates
      if (filter['barcode'].trim() === '') {
        return {
          success: false,
          errors: ['Please provide a plate barcode'],
        }
      }
      const rootStore = useRootStore()
      const request = rootStore.api.v1.traction.pacbio.plates
      const promise = request.get({ filter: filter, include: 'wells.requests' })
      const response = await handleResponse(promise)
      let { success, data: { data, included = [] } = {}, errors = [] } = response
      const { wells, requests } = groupIncludedByResource(included)

      // We will be return a successful empty list if no plates match the filter
      // Therefore we want to return an error if we don't have any plates
      if (!data?.length) {
        success = false
        errors = [`Unable to find plate with barcode: ${filter['barcode']}`]
      }

      if (success) {
        // We want to grab the first (and only) record from the applied filter
        this.selectPlate({ id: data[0].id, selected: true })
        //Populate plates
        this.resources.plates = {
          ...this.resources.plates,
          ...dataToObjectById({ data, includeRelationships: true }),
        }
        //Populate wells
        this.resources.wells = {
          ...this.resources.wells,
          ...dataToObjectById({ data: wells, includeRelationships: true }),
        }
        this.resources.requests = {
          ...this.resources.requests,
          ...dataToObjectById({ data: requests, includeRelationships: true }),
        }
      }

      return { success, errors }
    },

    /**
     * Finds a PacBio tube based on a filter.
     * If the filter's barcode is empty, returns an error.
     * Otherwise, sends a GET request to the API to find tubes that match the filter.
     * If no tubes are found, returns an error.
     * If tubes are found, selects the first tube, and populates the resources with the tubes and requests.
     *
     * @async
     * @param {Object} filter - The filter to apply.
     * @param {string} filter.barcode - The barcode to filter by.
     * @returns {Promise<Object>} A promise that resolves to an object with a success boolean and an array of errors.
     *
     * @example
     * // Find a PacBio tube with a specific barcode
     * const result = await findPacbioTube({ barcode: 'barcode123' });
     */
    async findPacbioTube(filter) {
      // Here we want to make sure the filter exists
      // If it doesn't exist the request will return all tubes
      if (filter['barcode'].trim() === '') {
        return {
          success: false,
          errors: ['Please provide a tube barcode'],
        }
      }
      const rootStore = useRootStore()
      const request = rootStore.api.v1.traction.pacbio.tubes
      const promise = request.get({ filter: filter, include: 'requests,libraries.request' })
      let {
        success,
        data: { data, included = [] } = {},
        errors = [],
      } = await handleResponse(promise)
      const { requests, libraries } = groupIncludedByResource(included)

      // We will be return a successful empty list if no tubes match the filter
      // Therefore we want to return an error if we don't have any tubes
      if (!data?.length) {
        success = false
        errors = [`Unable to find tube with barcode: ${filter['barcode']}`]
      }

      if (success) {
        //If this a library, the requests will be associated with library, therefore manually assign it to a tube
        const tubes = dataToObjectById({ data, includeRelationships: true })
        if (libraries) {
          this.resources.libraries = {
            ...this.resources.libraries,
            ...dataToObjectById({
              data: libraries,
              includeRelationships: true,
            }),
          }
        }
        Object.keys(tubes).forEach((key) => {
          tubes[key] = {
            ...tubes[key],
            requests: libraries ? requests.map((request) => request.id) : tubes[key].requests,
            source_id: String(libraries ? tubes[key].libraries : tubes[key].id),
          }
        })
        // We want to grab the first (and only) record from the applied filter
        this.selectTube({ id: data[0].id, selected: true })
        this.resources.tubes = {
          ...this.resources.tubes,
          ...tubes,
        }
        this.resources.requests = {
          ...this.resources.requests,
          ...dataToObjectById({ data: requests, includeRelationships: true }),
        }
      }

      return { success, errors }
    },

    /**
     * Flags plate with `id` as selected. (Or unselected if selected is false)
     * @param {String} id The id of the plate
     * @param {Boolean} selected Whether the plate is selected (defaults to true)
     * @returns {void}
     * @example
     * * // Select a request
     * selectPlate({ id: 1, selected: true })
     * // Removes a plate from selected state
     * selectPlate({ id: 1, selected: false })
     */

    selectPlate({ id, selected = true }) {
      if (selected) {
        this.selected.plates[`${id}`] = { id, selected }
      } else {
        delete this.selected.plates[`${id}`]
      }
    },

    /**
     * Selects or deselects a tube based on the provided id and selected status.
     * If selected, the tube is added to the selected tubes object. If not selected, the tube is removed from the selected tubes object.
     *
     * @param {number} tube.id - The id of the tube.
     * @param {boolean} [tube.selected=true] - The selected status of the tube. Defaults to true.
     * @returns {void}
     * @example
     * // Select a request
     * selecTube({ id: 1, selected: true })
     * // Removes a request from selected state
     * selectTube({ id: 1, selected: false })
     */

    selectTube({ id, selected = true }) {
      if (selected) {
        this.selected.tubes[`${id}`] = { id, selected }
      } else {
        delete this.selected.tubes[`${id}`]
      }
    },

    /**
     * Selects or deselects a request based on the provided request object, source_id and selected status.
     * If selected, a new used_aliquot is created for the request and added to the used_aliquots object.
     * If not selected, the used_aliquot for the request is removed from the used_aliquots object.
     *
     * @param {Object} request - The request object to select or deselect. Must have an 'id' property.
     * @param {number} request.id - The id of the request.
     * @param {number} source_id - The id of the source of aliquot.
     * @param {boolean} [request.selected=true] - The selected status of the request. Defaults to true.
     * @returns {void}
     */

    selectRequestInSource({ request, source_id, selected = true }) {
      if (selected) {
        /*If the request is associated with a library, fill the used_aliquot values with the library attributes values
        for template_prep_kit_box_barcode, volume, concentration, and insert_size*/

        const autoFillLibraryAttributes = [
          'template_prep_kit_box_barcode',
          'volume',
          'concentration',
          'insert_size',
          'available_volume',
          'tag_id',
        ]
        const library = Object.values(this.resources.libraries).find(
          (library) => library.id == source_id,
        )

        const libraryAttributes = library
          ? autoFillLibraryAttributes.reduce((result, key) => {
              result[key] = library[key] ?? null
              return result
            }, {})
          : {}

        /*
          if the library has a tag id we want to select the tag_set if its not already selected
          unless the tag doesn't match the existing selected tag_set
        */
        if (libraryAttributes.tag_id) {
          const rootStore = useRootStore()
          const selectedTagSet = this.selected.tagSet
          const pacbioRootStore = usePacbioRootStore()
          const tagSet = pacbioRootStore.tagsetForTagId(libraryAttributes.tag_id)
          const tag = pacbioRootStore.tags[libraryAttributes.tag_id]

          // If there is no selected tag set, select the tag set for the library if it exists
          if (!selectedTagSet.id && tagSet) {
            this.selectTagSet(tagSet.id)
          }

          // If the selectedTagSet is not the same as the tagSet and the tag exists, add a message and remove the tag from the library
          if (this.selected.tagSet.id !== tagSet.id && libraryAttributes.tag_id) {
            rootStore.addVuexMessage({
              type: 'warning',
              message: `Library tag not populated as ${tag.group_id || 'tag'} is not in the selected tag group`,
            })
            libraryAttributes.tag_id = null
          }
        }
        this.used_aliquots[`_${source_id}`] = {
          ...createUsedAliquot({
            source_id,
            request,
            ...libraryAttributes,
            source_type: this.sourceTypeForRequest(this.resources.requests[request]),
            volume: library ? library.available_volume ?? library.volume : null,
          }),
        }
        // Validate the used aliquot if the request is from library
        library && this.validateUsedAliquot(this.used_aliquots[`_${source_id}`], 'volume')
      } else {
        delete this.used_aliquots[`_${source_id}`]
      }
    },

    /**
     * Selects a tag set by setting the `tagSet` property of the `selected` object to an object with the provided ID.
     *
     * @param {number} id - The ID of the tag set to select.
     *
     * @example
     * // Select a tag set
     * selectTagSet(1);
     */
    selectTagSet(id) {
      this.selected.tagSet = { id }
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
     * Validates the given field in used aliquot object.
     *
     * @param {Object} used_aliquot_obj - The used aliquot object to validate.
     * @param {string} field - The field to validate.
     * @param {any} value - The value to validate is optional.If not provided, the value from the used_aliquot object is used.
     * @returns {void}
     *
     * @example
     * validateUsedAliquot({ request: 'request1' }, 'field1', 'value1');
     */
    validateUsedAliquot(used_aliquot_obj, field, value) {
      // If the given used_aliquot object is not valid or does not have a 'request' property, return without doing anything.
      if (!isValidUsedAliquot(used_aliquot_obj)) {
        return
      }
      // Get the used aliquot item based on the request id to ensure the used aliquot exists
      const used_aliquot = this.usedAliquotItem(used_aliquot_obj.source_id)
      if (!used_aliquot) return
      used_aliquot.validateField(field, value)
    },
  },
})
