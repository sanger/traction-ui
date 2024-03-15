import { defineStore } from 'pinia'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper'
import {
  groupIncludedByResource,
  extractAttributes,
  dataToObjectById,
  dataToObjectByPlateNumber,
  splitDataByParent,
  dataToObjectByPosition,
} from '@/api/JsonApi'
import {
  newRun,
  createRunType,
  RunTypeEnum,
  newWell,
  defaultWellAttributes,
  newPlate,
} from '@/stores/utilities/run'

const buildRunSuitabilityErrors = ({ pool, libraries }) => [
  ...(pool.run_suitability?.errors || []).map(({ detail }) => `Pool ${detail}`),
  ...libraries.flatMap((library) => {
    const libraryName = `Library ${library.id} (${library.sample_name})`
    return library.run_suitability.errors.map(({ detail }) => `${libraryName} ${detail}`)
  }),
]

// Helper function for setting pool and library data
const formatById = (obj, data, includeRelationships = false) => {
  return {
    ...obj,
    ...dataToObjectById({ data, includeRelationships }),
  }
}

/**
 * returns a pool object with the libraries and barcode
 * @param {Object} state the pinia state object
 * @param {Object} pool a pool object
 * @returns
 */
const generatePoolContents = (state, pool) => {
  const libraries = (pool.libraries || []).map((libraryId) => {
    const { id, type, request, tag, run_suitability } = state.library_pools[libraryId]
    const { sample_name } = state.requests[request]
    const { group_id } = state.tags[tag] || {}
    return { id, type, sample_name, group_id, run_suitability }
  })
  const { barcode } = state.tubes[pool.tube]

  return {
    ...pool,
    libraries,
    barcode,
    run_suitability: {
      ...pool.run_suitability,
      formattedErrors: buildRunSuitabilityErrors({ libraries, pool }),
    },
  }
}

/**
 * Returns a library object with the barcode, sample_name and group_id
 * @param {Object} state the pinia state object
 * @param {Object} library a library object
 * @returns
 */
const generateLibraryContents = (state, library) => {
  const { request, tag } = library
  const { sample_name } = state.requests[request]
  const { group_id } = state.tags[tag] || {}
  const { barcode } = state.tubes[library.tube]
  return { ...library, barcode, sample_name, group_id }
}

export const usePacbioRunCreateStore = defineStore('pacbioRunCreate', {
  /**
   * Generates an object describing a new library for population `store.libraries`
   * @param {Object} attributes any attributes of the object to pre-populate
   * @example newLibrary({pacbio_request_id: '1'})
   */
  state: () => ({
    // Resources returned by the server, each key represents a resource type.
    // resource types are indexed by their id.
    resources: {
      // The SMRT Link version store.
      smrtLinkVersions: {},
    },
    // Run: The current run being edited or created
    run: {},

    // Plates: The plates for the current run
    plates: {},

    // Wells: The wells for the plates in the current run
    wells: {},

    //Pools: The pools that belong to the wells or the pool selected for a new run
    pools: {},

    //Libraries: The libraries that belong to the wells or the library selected for a new run
    libraries: {},

    // Libraries that belong to a pool
    library_pools: {},

    //Tubes: The tubes for each pool or the tubes selected for a new run
    tubes: {},

    //Requests: The requests for the libraries or pool libraries
    requests: {},

    //Tags: The tags for the currently selected libraries
    tags: {},

    //Run Type: The type of run either new or existing
    runType: {},

    //smrtLinkVersion: The smrtLinkVersion of the run either new or existing
    smrtLinkVersion: {},

    //Default well attributes: The default attributes needed for each well
    defaultWellAttributes: {},

    //Instrument types: The instrument types available for selection
    instrumentTypeList: PacbioInstrumentTypes,

    //Instrument type: The instrument type selected for the run
    instrumentType: PacbioInstrumentTypes.Revio,

    //Aliquots: The aliquots for the run
    aliquots: {},
  }),
  getters: {
    /**
     * Returns a list of all fetched smrt link versions
     * @param {Object} state the pinia state object
     */
    smrtLinkVersionList: (state) => {
      return state.resources.smrtLinkVersions
    },

    defaultSmrtLinkVersion: (state) => {
      return Object.values(state.resources.smrtLinkVersions).find((version) => version.default)
    },

    // The smrtLinkVersion of the current run
    currentSmrtLinkVersion: (state) => {
      return state.smrtLinkVersion || {}
    },

    /**
     * Returns a list of all the tubes with their contents (pool or library)
     * @param {Object} state the pinia state object
     * @returns
     */
    tubeContents: (state) => {
      return Object.values(state.tubes).reduce((result, tube) => {
        // We should assume a tube only has one pool
        const pool = state.pools[tube.pools?.[0]]
        const library = state.libraries[tube.libraries]

        if (pool) {
          result.push(generatePoolContents(state, pool))
        } else if (library) {
          result.push(generateLibraryContents(state, library))
        }
        return result
      }, [])
    },

    tubeContentByBarcode: (state) => {
      return (barcode) => {
        return state.tubeContents.find((tubeContent) => tubeContent.barcode === barcode)
      }
    },

    runItem: (state) => state.run || {},

    runTypeItem: (state) => state.runType || {},

    getWell: (state) => (plateNumber, position) => {
      return state.wells[plateNumber][position]
    },

    /**
     * Gets or creates the well based on it's position.
     * If it is a new well it will be built along with retrieving the currentWellDefaults
     * If it is an existing well it will be retrieved
     * @param position The position of the well
     * @param plateNumber The plate number of the well
     */
    getOrCreateWell: (state) => (position, plateNumber) => {
      return (
        state.wells[plateNumber][position] || newWell({ position, ...state.defaultWellAttributes })
      )
    },

    getPlate: (state) => (plateNumber) => {
      return state.plates[plateNumber]
    },

    getPlateList: (state) => {
      return Object.values(state.plates)
    },

    runDefaultWellAttributes: (state) => state.defaultWellAttributes || {},

    instrumentTypeItem: (state) => state.instrumentType || {},
  },
  actions: {
    /**
     * Retrieves a list of pacbio smrt_link_versions and populates the store.
     * @returns { success, errors }. Was the request successful? were there any errors?
     */
    async fetchSmrtLinkVersions() {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.smrt_link_versions
      const promise = request.get({})
      const response = await handleResponse(promise)

      const { success, data: { data } = {}, errors = [] } = response

      if (success) {
        // populate smrtLinkVersions in store
        this.resources.smrtLinkVersions = dataToObjectById({ data })
      }

      return { success, errors }
    },
    async findPoolsOrLibrariesByTube(filter) {
      // when users search for nothing, prompt them to enter a barcode
      if (filter['barcode'].trim() === '') {
        return {
          success: false,
          errors: ['Please provide a pool barcode'],
        }
      }

      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.tubes
      const promise = request.get({
        include:
          'pools.used_aliquots.library.request,pools.used_aliquots.tag,libraries.used_aliquots.request,libraries.used_aliquots.tag',
        fields: {
          requests: 'sample_name',
          tags: 'group_id',
        },
        filter,
      })
      const response = await handleResponse(promise)
      const { success, data: { data, included = [] } = {}, errors = [] } = response

      // success is true with an empty list when no pools match the filter
      if (success && data.length > 0) {
        const { pools, libraries, aliquots, tags, requests } = groupIncludedByResource(included)

        // populate pools, tubes, libraries, tags and requests in store
        this.pools = formatById(this.pools, pools, true)
        this.tubes = formatById(this.tubes, data, true)
        this.libraries = formatById(this.libraries, libraries, true)
        this.aliquots = formatById(this.aliquots, aliquots, true)
        this.requests = formatById(this.requests, requests)
        this.tags = formatById(this.tags, tags)

        return { success, errors }
      } else {
        return {
          success: false,
          errors: [`Unable to find pool or library with barcode: ${filter['barcode']}`],
        }
      }
    },
    /**
     * Retrieves a pacbio run and populates the store.
     * @param id the id of the run to retrieve
     * @returns { success, errors }. Was the request successful? were there any errors?
     */
    async fetchRun({ id }) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.runs
      const promise = request.find({
        id,
        // The used aliquots are needed to get the libraries, pools and tubes
        include:
          'plates.wells.used_aliquots.library.tube,plates.wells.used_aliquots.pool.tube,smrt_link_version',
      })
      const response = await handleResponse(promise)

      const { success, data: { data, included = [] } = {}, errors = [] } = response

      if (success) {
        const {
          plates,
          wells,
          pools,
          libraries,
          tubes,
          aliquots,
          smrt_link_versions: [smrt_link_version = {}] = [],
        } = groupIncludedByResource(included)

        const smrtLinkVersion = extractAttributes(smrt_link_version)

        this.run = {
          id: data.id,
          ...data.attributes,
        }
        // Populate the plates
        this.plates = dataToObjectByPlateNumber({ data: plates, includeRelationships: true })

        // Populate the wells
        // Adds the wells to state by plate number and well position, two dimensional array
        const wellsByPlate = splitDataByParent({
          data: wells,
          fn: dataToObjectByPosition,
          includeRelationships: true,
          parent: { parentData: plates, children: 'wells', key: 'plate_number' },
        })
        // We need to add the _destroy key to each plate to handle well deletions
        // eslint-disable-next-line no-unused-vars
        Object.entries(wellsByPlate).forEach(([_plateNumber, plate]) => {
          plate['_destroy'] = []
        })
        this.wells = wellsByPlate

        //Populate pools, libraries, library_pools, tags, requests and tubes
        this.pools = formatById(this.pools, pools, true)
        this.libraries = formatById(this.libraries, libraries, true)
        this.tubes = formatById(this.tubes, tubes, true)
        this.aliquots = formatById(this.aliquots, aliquots, true)

        //Populate the smrtLinkVersion
        this.smrtLinkVersion = smrtLinkVersion
      }
      return { success, errors }
    },

    /**
     * Saves (persists) the existing run. If it is a new run it will be created.
     * If it is an existing run it will be updated.
     * @returns { success, errors }. Was the request successful? were there any errors?
     */
    async saveRun() {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.runs

      // based on the runType create the payload and the promise
      const payload = this.runType.payload({
        run: this.run,
        plates: this.plates,
        wells: this.wells,
        smrtLinkVersion: this.smrtLinkVersion,
        instrumentType: this.instrumentType,
      })
      const promise = this.runType.promise({ request, payload })
      const response = await handleResponse(promise)

      const { success, errors = [] } = response

      return { success, errors }
    },

    /**
     * Sets the current run. If it is a new run it will be created.
     * If it is an existing run it will be updated.
     * @param id The id of the run. It will be new or existing
     * @returns { success, errors }. Was the action successful? were there any errors?
     *
     */
    async setRun({ id }) {
      // create and set the runType based on the id
      this.runType = createRunType({ id })

      // if it is a new create a new run and commit it
      if (this.runType.type === RunTypeEnum.New) {
        // ensure that the smrt link version id is set to the default
        // eslint-disable-next-line no-unused-vars

        const { id, ...attributes } = newRun()
        this.run = {
          id,
          ...attributes,
        }
        this.smrtLinkVersion = this.defaultSmrtLinkVersion
        // success will always be true and errors will be empty
        return { success: true, errors: [] }
      }

      // if it is an existing run, call the fetch run action
      let { success, errors = [] } = await this.fetchRun({ id })

      // we only want to get the library and pool data if the fetchRun was successful
      if (success) {
        // extract the tube barcodes
        const filter = {
          barcode: Object.values(this.tubes)
            .map((tube) => tube.barcode)
            .join(','),
        }
        const result = await this.findPoolsOrLibrariesByTube({ filter })
        if (result) {
          // allow the success and errors to be overwritten by the result
          ;({ success, errors } = result)
        }
      }

      // return the result from the fetchRun
      return { success, errors }
    },

    /**
     * Updates the well
     * @param well The well to update
     * @param plateNumber The plate number of the well
     */
    updateWell({ well, plateNumber }) {
      //Replaces the well in store with the updated well
      this.wells[plateNumber][well.position] = {
        ...this.wells[plateNumber]?.[well.position],
        ...well,
      }
    },

    /**
     *
     * @param {Object} well The well to delete
     * @param {Number} plateNumber The number of the plate
     * Adds _destroy key to the well in store so future wells
     * for the same position can be added
     */
    deleteWell({ well, plateNumber }) {
      const id = this.wells[plateNumber][well.position].id

      delete this.wells[plateNumber][well.position]
      this.wells[plateNumber]['_destroy'].push({ _destroy: true, id })
    },

    /**
     * Updates the store with the SMRT version selected on the component.
     * @param id the id of smrtLinkVersion object to update the store with.
     */
    setSmrtLinkVersion(id) {
      this.smrtLinkVersion = { ...this.resources.smrtLinkVersions[id] }
    },

    /**
     * Sets the defaultWellAttributes
     */
    setDefaultWellAttributes() {
      this.defaultWellAttributes = defaultWellAttributes()
    },

    /**
     * Sets the Instrument Type
     * @param instrumentName the name of the instrument
     * if a key is passed set the instrument type based on the key
     * otherwise find the instrument type based on the instrument name
     * creates the plates based on the instrument type plate count if it is a new plate
     */
    setInstrumentData(key) {
      //Adds the instrumentType to state
      const instrumentTypeForKey = key
        ? this.instrumentTypeList[key]
        : Object.values(this.instrumentTypeList).find(
            (instrumentType) => instrumentType.name === this.run.system_name,
          )
      this.instrumentType = { ...instrumentTypeForKey }
      if (this.runType.type === RunTypeEnum.New) {
        /*
         * Adds the plates and wells to state by plate number
         * Warning: this is a destructive action
         * Firstly removes wells and plates from state
        // we need to do this as we may be going from 2 plates to 1 plate*/
        this.plates = {}
        this.wells = {}

        for (let i = 1; i <= this.instrumentType.plateCount; i++) {
          this.plates[i] = newPlate(i)
          this.wells[i] = { _destroy: [] }
        }
        this.run.dna_control_complex_box_barcode = null
      }
    },
    removePool(id) {
      delete this.pools[id]
    },
    removeLibrary(id) {
      delete this.libraries[id]
    },
    clearRunData() {
      const resources = this.resources
      this.$reset()
      this.resources = resources
    },
  },
})
