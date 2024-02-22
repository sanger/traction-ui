import { defineStore } from 'pinia'
import { wellToIndex, wellFor } from '@/stores/utilities/wellHelpers.js'
import { newLibrary } from '@/stores/utilities/libraryHelpers.js'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'
import { useRootStore } from '@/stores'
import { validate, valid,payload } from '@/stores/utilities/pool.js'

/**
 * Merge together two representations of the same object.
 * The parent object will be mapped over, and equivalent items from the
 * child object will be merged in. keyFunction allows for cases where there
 * is not a 1:1 mapping between ids.
 * @param {Object} parent the parent object, only resources in here will be present in the output.
 * @param {Object} child resources with a matching id will be merged into the parent
 * @param {fn} keyFunction convert id to the key format in the child
 * @example mergeRepresentations(requests,selectedRequests, id => `_${id}`)
 */
const mergeRepresentations = (parent, child, keyFunction = (id) => id) => {
  return Object.values(parent).map((parentRecord) => {
    return { ...child[keyFunction(parentRecord.id)], ...parentRecord }
  })
}

/**
 * This function sorts all requested based on the column index of the well they are in
 * @param {*} resources
 * @returns
 */
const sortRequestByWellColumnIndex = (resources) => (a, b) =>
  wellToIndex(resources.wells[a.well] || { position: 'A1' }) -
  wellToIndex(resources.wells[b.well] || { position: 'A1' })

/**
 * Sort the requests based on their labware. Tubes will be sorted after plates,
 * and then each labware is sorted in id order
 * @param {S} resources  The resources object
 * @returns  sorted requests
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
 * Constructs an error message for a library record.
 *
 * @param {Object} params - An object containing the line number and record number.
 * @param {number} params.lines - The line number where the error occurred.
 * @param {number} params.records - The record number where the error occurred.
 * @param {string} message - The specific error message.
 * @returns {string} The constructed error message.
 */
const errorFor = ({ lines, records }, message) => `Library ${records} on line ${lines}: ${message}`

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
 * @exports usePacbioLibrariesStore
 */
export const usePacbioLibrariesStore = defineStore('pacbioPoolCreate', {
  state: () => ({
    /**
     * Resources returned by the server, each key represents a resource type.
     * resource types are indexed by their id.
     */
    resources: {
      // The main plate store. Represents the authoritative source of plate information. Plates are indexed by id.
      plates: {},
      /*
       * The main tube store. Represents the authoritative source of tube information.
       * Tubes are indexed by id.
       */
      tubes: {},
      /**
       * The main source of well information. Wells are indexed by id.
       * Populated by the wells included in the request for plates.
       * @example {"id":"1","type":"wells","position":"A1","requests":["1"]}
       */
      wells: {},
      /**
       * The main source of request information. Requests are indexed by id.
       * Populated by the requests included in the request for plates.
       */
      requests: {},
    },
    //Selected collects together user input in the front end, such as selected plates, libraries and tubes.
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
    // Libraries. Indexed by an internally generated id.
    libraries: {},
    // Pool: The current pool being edited or created
    pool: {},
    // Tube: The tube for the current pool
    tube: {},
  }),
  getters: {
    /**
     * Returns a list of all fetched plates
     * @param {Object} state The Pinia state object
     */
    plateList: ({ selected, resources }) => {
      return mergeRepresentations(resources.plates, selected.plates)
    },
    /**
     * Returns a list of all fetched tubes
     * @param {Object} state The Pinia state object
     */
    tubeList: ({ selected, resources }) => {
      return mergeRepresentations(resources.tubes, selected.tubes)
    },
    /**
     * Returns a list of all fetched tagSet
     * @param {Object} state The Pinia state object
     */
    tagSetList: (state) => {
      return Object.values(state.resources.tagSets)
    },
    /**
     * Returns a list of all fetched tagSet
     * @param {Object} state The Pinia state object
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
     * @param {Object} state The Pinia state object
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
     * Returns a list of selected plates
     * @param {Object} state The Pinia state object
     */
    selectedPlates: ({ selected, resources }) =>
      mergeRepresentations(selected.plates, resources.plates),

    /**
     * Returns a list of selected tubes
     * @param {Object} state The Pinia state object
     */
    selectedTubes: ({ selected, resources }) =>
      mergeRepresentations(selected.tubes, resources.tubes),

    /**
     * Returns a list of selected requests
     *
     * Note: Ordering is grouped by plate (in id order) and sorted in column order
     * @param {Object} state The Pinia state object
     * @return {Array} An array of selected requests in the order in which they were selected
     */
    selectedRequests: ({ libraries, resources }) => {
      return Object.values(libraries)
        .map(({ pacbio_request_id }) => ({
          ...resources.requests[pacbio_request_id],
          selected: true,
        }))
        .sort(sortRequestByWellColumnIndex(resources))
        .sort(sortRequestByLabware(resources))
    },
    /**
     * Returns a list of all fetched wells
     * @param {Object} state The Pinia state object
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
     * @param {Object} state The Pinia state object
     */
    requestList: (state) => (ids) => {
      const requests = state.resources.requests
      const selectedRequests = state.libraries
      if (ids) {
        return ids.map((id) => {
          return { ...requests[id], selected: !!selectedRequests[`_${id}`] }
        })
      } else {
        return Object.values(requests).map((request) => {
          return { ...request, selected: !!selectedRequests[`_${request.id}`] }
        })
      }
    },
    /**
     * Returns a function that, when called with an ID, retrieves the library item with that ID.
     *
     * @param {Object} libraries - An object containing library items, keyed by ID.
     * @returns {function(string): Object} A function that takes an ID and returns the corresponding library item.
     */
    libraryItem:
      ({ libraries }) =>
      (id) =>
        libraries[`_${id}`],

    /**
     * Retrieves the pool item from the state. If the pool item does not exist, returns an empty object.
     *
     * @param {Object} state - The state object that contains the pool item.
     * @returns {Object} The pool item from the state, or an empty object if it does not exist.
     */
    poolItem: (state) => state.pool || {},

    /**
     * Retrieves the tube item from the state. If the tibe item does not exist, returns an empty object.
     *
     * @param {Object} state - The state object that contains the tube item.
     * @returns {Object} The tibe item from the state, or an empty object if it does not exist.
     */
    tubeItem: (state) => state.tube || {},
  },
  actions: {
    /***
     * Finds the tube associated with a pacbio_request
     * @param {Object} resources Pinia store resources object
     * @returns {Object} the matching tube from the store
     */
    tubeFor(pacbio_request_id) {
      return this.resources.tubes[this.resources.requests[pacbio_request_id]?.tube]
    },

    /**
     * Automatically tags a plate based on the provided library.
     * It iterates over all libraries and updates the tag of each library on the same plate and with a higher well index.
     *
     * @param {Object} library - The library object based on which the plate is tagged. Must have a 'pacbio_request_id' and 'tag_id' property.
     * @example autoTagPlate({pacbio_request_id: '1', tag_id: '1'})
     */
    autoTagPlate(library) {
      // If the library object is not valid or does not have a 'pacbio_request_id' or 'tag_id' property, return without doing anything.
      if (
        !library ||
        typeof library !== 'object' ||
        !library['pacbio_request_id'] ||
        !library['tag_id']
      ) {
        return
      }

      //Helper function to get the well for a given pacbio_request_id
      const initialWell = wellFor(this.resources, library.pacbio_request_id)
      //Helper function to get the index of the well
      const initialIndex = wellToIndex(initialWell)
      //Get the tags for the selected tag set
      const tags = this.resources.tagSets[this.selected.tagSet.id].tags
      //Get the index of the tag for the given library
      const initialTagIndex = tags.indexOf(library.tag_id)
      //Get the plate for the given library
      const plate = initialWell.plate

      //Iterate over all libraries and update the tag of each library on the same plate and with a higher well index.
      Object.values(this.libraries).forEach(({ pacbio_request_id }) => {
        const otherWell = wellFor(this.resources, pacbio_request_id)

        if (otherWell?.plate !== plate) return

        const offset = wellToIndex(otherWell) - initialIndex

        if (offset < 1) return

        const newTag = (initialTagIndex + offset) % tags.length
        this.updateLibrary({ pacbio_request_id, tag_id: tags[newTag] })
      })
    },
    /**
     * Automatically tags a tube based on the provided library.
     * It iterates over all selected requests and updates the tag of each request with a higher tube ID.
     *
     * @param {Object} library - The library object based on which the tube is tagged. Must have a 'tag_id' property.
     * @example autoTagTube({tag_id: '1'})
     */
    autoTagTube(library) {
      // If the library object is not valid or does not have a 'tag_id' property, return without doing anything.
      if (!library || typeof library !== 'object' || !library['tag_id']) {
        return
      }
      const initialTube = this.tubeFor(library)
      const tags = this.resources.tagSets[this.selected.tagSet.id].tags
      const initialTagIndex = tags.indexOf(library.tag_id)
      Object.values(this.selectedRequests)
        .filter((request) => {
          return request.tube && parseInt(request.tube) > parseInt(initialTube.id)
        })
        .forEach((req, offset) => {
          const newTag = (initialTagIndex + offset + 1) % tags.length
          this.updateLibrary({ pacbio_request_id: req.id, tag_id: tags[newTag] })
        })
    },

    /**
     *
     * Finds the tag id for the tag specified by tag, within the current tag group
     * @param {Object} options - An options object
     * @param {Object} options.getters PacbioVueX store getters object
     * @param {String} options.tag Tag group_id to find
     * @param {Function} options.error Error function for user feedback
     * @returns {Object} Object containing the matching tag_id
     */
    buildTagAttributes(tag, error) {
      if (!tag) return {}
      if (tag) {
        const matchedTag = this.selectedTagSet.tags.find(({ group_id }) => group_id === tag)
        if (matchedTag) {
          return { tag_id: matchedTag.id }
        } else {
          error(`Could not find a tag named ${tag} in selected tag group`)
        }
      }
      return {}
    },
    /**
     * Finds requests for a specific well on a plate based on the provided barcode and well name.
     * If the plate or well cannot be found, returns an object with success set to false and an error message.
     * If the plate and well can be found, selects the plate and returns an object with success set to true and the IDs of the requests for the well.
     *
     * @param {string} barcode - The barcode of the plate to find.
     * @param {string} wellName - The name of the well to find.
     * @returns {Object} An object with the success status and either the error message or the IDs of the requests.
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
      return { success: true, requestIds: wells[wellId].requests }
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
      return { success: true, requestIds: tube.requests }
    },

    /**
     * Finds requests for a specific source based on the provided barcode and optionally a well name.
     * If a well name is provided, assumes the source is a plate and calls `requestsForPlate`.
     * If a well name is not provided, assumes the source is a tube and calls `requestsForTube`.
     *
     * @param {string} barcode - The barcode of the source to find.
     * @param {string} [wellName] - The name of the well to find, if the source is a plate.
     * @returns {Object} An object with the success status and either the error message or the IDs of the requests.
     */
    findRequestsForSource(barcode, wellName) {
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
    selectWellRequests: (well_id) => {
      const { requests } = this.resources.wells[well_id]
      const selectedRequests = this.libraries
      for (const id of requests) {
        const selected = !!selectedRequests[`_${id}`]
        this.selectRequest({ id, selected: !selected })
      }
    },

    /**
     * Updates a library in the state libraries object based on the provided library object.
     * If the library object is not valid or does not have a 'pacbio_request_id' property, the function returns without doing anything.
     *
     * @param {Object} library - The library object to update. Must have a 'pacbio_request_id' property.
     * @returns {void}
     * @example updateLibrary({pacbio_request_id: '1', tag_id: '1'})
     */
    updateLibrary(library) {
      // If the library object is not valid or does not have a 'pacbio_request_id'property, return without doing anything.
      if (!library || typeof library !== 'object' || !library['pacbio_request_id']) {
        return
      }
      // Update the library in the state libraries object based on the provided library object.
      const key = `_${library.pacbio_request_id}`
      this.libraries[key] = { ...this.libraries[key], ...library }
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
          this.selectRequest({ id: requestId, selected: false })
        }
      }
    },

    /**
     * Deselects a tube and all its contents (requests) based on the provided tube barcode.
     * If the tube cannot be found, the function returns without doing anything.
     * If the tube can be found, deselects the tube and then iterates over all requests of the tube and deselects them.
     *
     * @param {string} tubeBarcode - The barcode of the tube to deselect.
     * @returns {void}
     *
     * @example
     * // Deselect a tube and its contents
     * deselectTubeAndContents('TRAC-123')
     */
    deselectTubeAndContents: (tubeBarcode) => {
      const tube = Object.values(this.resources.tubes).find((tube) => tube.barcode == tubeBarcode)
      if (!tube) return
      this.selectTube({ id: tube.id, selected: false })
      const { requests } = this.resources.tubes[tube.id]
      for (const requestId of requests) {
        this.selectRequest({ id: requestId, selected: false })
      }
    },

    /**
     * Selects a tube and all its contents (requests) based on the provided tube ID.
     * If the tube cannot be found, the function returns without doing anything.
     * If the tube can be found, selects the tube and then iterates over all requests of the tube and selects them.
     *
     * @param {number} tubeId - The ID of the tube to select.
     * @returns {void}
     *
     * @example
     * // Select a tube and its contents
     * selectTubeAndContents(1)
     */
    selectTubeAndContents: (tubeId) => {
      this.selectTube({ id: tubeId, selected: true })
      if (!this.resources.tubes[tubeId]) return

      const { requests } = this.resources.tubes[tubeId]
      for (const requestId of requests) {
        this.selectRequest({ id: requestId, selected: true })
      }
    },

    async createPool  ()  {
      const {libraries,pools} = this
      validate(libraries)
      if (!valid(libraries )) return { success: false, errors: 'The pool is invalid' }
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.pools
      const promise = request.create({ data: payload({ libraries, pools}), include: 'tube' })
      const { success, data: { included = [] } = {}, errors } = await handleResponse(promise)
      const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
      const { attributes: { barcode = '' } = {} } = tube
      return { success, barcode, errors }
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
    selectPlate: ({ id, selected = true }) => {
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
     * selectRequest({ id: 1, selected: true })
     * // Removes a request from selected state
     * selectRequest({ id: 1, selected: false })
     */
    selectTube: ({ id, selected = true }) => {
      if (selected) {
        this.selected.tubes[`${id}`] = { id, selected }
      } else {
        delete this.selected.tubes[`${id}`]
      }
    },

    /**
     * Selects or deselects a request based on the provided id and selected status.
     * If selected, a new library is created for the request and added to the libraries object.
     * If not selected, the library for the request is removed from the libraries object.
     *
     * @param {Object} request - The request object to select or deselect. Must have an 'id' property.
     * @param {number} request.id - The id of the request.
     * @param {boolean} [request.selected=true] - The selected status of the request. Defaults to true.
     * @returns {void}
     *
     * @example
     * // Select a request
     * selectRequest({ id: 1, selected: true })
     * // Removes a request from selected state
     * selectRequest({ id: 1, selected: false })
     */
    selectRequest: ({ id, selected = true }) => {
      if (selected) {
        this.libraries[`_${id}`] = newLibrary({ pacbio_request_id: id })
      } else {
        delete this.libraries[`_${id}`]
      }
    },
  },
})
