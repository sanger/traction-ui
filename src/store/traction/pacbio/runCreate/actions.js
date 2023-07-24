import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource, extractAttributes } from '@/api/JsonApi'
import { newRun, createRunType, RunTypeEnum, newWell, defaultWellAttributes } from './run'

// Asynchronous update of state.
export default {
  /**
   * Retrieves a list of pacbio smrt_link_versions and populates the store.
   * @param commit the vuex commit object. Provides access to mutations
   * @param rootState the vuex rootState object. Provides access to current state
   * @returns { success, errors }. Was the request successful? were there any errors?
   */
  fetchSmrtLinkVersions: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.smrt_link_versions
    const promise = request.get({})
    const response = await handleResponse(promise)

    const { success, data: { data } = {}, errors = [] } = response

    if (success) {
      commit('populateSmrtLinkVersions', data)
    }
    return { success, errors }
  },

  /**
   * Retrieves a list of pools based on a filter
   * @param commit the vuex commit object. Provides access to mutations
   * @param getters Provides access to the vuex getters
   * @param filter the barcode(s) to find the pools for
   * @returns { success, errors }. Was the request successful? were there any errors?
   */
  findPools: async ({ commit, getters }, filter) => {
    // when users search for nothing, prompt them to enter a barcode
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a pool barcode'],
      }
    }

    const request = getters.poolRequest
    const promise = request.get({
      include: 'tube,libraries.tag,libraries.request',
      fields: {
        requests: 'sample_name',
        tubes: 'barcode',
        tags: 'group_id',
        libraries: 'request,tag,run_suitability',
      },
      filter,
    })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response
    // success is true with an empty list when no pools match the filter
    if (success && data.length > 0) {
      const { tubes, libraries, tags, requests } = groupIncludedByResource(included)

      // commit pools, tubes, libraries, tags and requests
      commit('setPools', data)
      commit('setTubes', tubes)
      commit('setLibraries', libraries)
      commit('setTags', tags)
      commit('setRequests', requests)
      return { success, errors }
    } else {
      return { success: false, errors: [`Unable to find pool with barcode: ${filter['barcode']}`] }
    }
  },

  /**
   * Retrieves a pacbio run and populates the store.
   * @param rootState the vuex rootState object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @returns { success, errors }. Was the request successful? were there any errors?
   */
  fetchRun: async ({ commit, rootState }, { id }) => {
    const request = rootState.api.traction.pacbio.runs
    const promise = request.find({
      id,
      // This is long but we want to include pool data
      include:
        'plates.wells.pools.tube,plates.wells.pools.libraries.tag,plates.wells.pools.libraries.request,smrt_link_version',
      fields: {
        requests: 'sample_name',
        tubes: 'barcode',
        tags: 'group_id',
        libraries: 'request,tag,run_suitability',
      },
    })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      const {
        plates,
        wells,
        pools,
        tubes,
        libraries,
        tags,
        requests,
        smrt_link_versions: [smrt_link_version = {}] = [],
      } = groupIncludedByResource(included)

      const smrtLinkVersion = extractAttributes(smrt_link_version)

      commit('populateRun', data)
      commit('populatePlates', plates)
      commit('populateWells', { plates, wells })
      commit('populatePools', pools)
      commit('setLibraries', libraries)
      commit('setTags', tags)
      commit('setRequests', requests)
      commit('setTubes', tubes)
      commit('populateSmrtLinkVersion', smrtLinkVersion)
    }
    return { success, errors }
  },

  /**
   * Saves (persists) the existing run. If it is a new run it will be created.
   * If it is an existing run it will be updated.
   * @param rootState the vuex rootState object. Provides access to current state
   * @param state {runType, runs, plates, wells}. The current runType, run it's plates and wells
   * @returns { success, errors }. Was the request successful? were there any errors?
   */
  saveRun: async ({ rootState, state: { runType, run, plates, wells, smrtLinkVersion } }) => {
    const request = rootState.api.traction.pacbio.runs

    // based on the runType create the payload and the promise
    const payload = runType.payload({ run, plates, wells, smrtLinkVersion })
    const promise = runType.promise({ request, payload })
    const response = await handleResponse(promise)

    const { success, errors = [] } = response

    return { success, errors }
  },

  /**
   * Sets the current run. If it is a new run it will be created.
   * If it is an existing run it will be updated.
   * @param commit the vuex commit object. Provides access to mutations
   * @param dispatch We need to call another action
   * @param getters Provides access to the vuex getters
   * @param id The id of the run. It will be new or existing
   * @returns { success, errors }. Was the action successful? were there any errors?
   *
   */
  setRun: async ({ commit, dispatch, getters }, { id }) => {
    // create and commit the runType based on the id
    const runType = createRunType({ id })
    commit('populateRunType', runType)

    // if it is a new create a new run and commit it
    if (runType.type === RunTypeEnum.New) {
      // ensure that the smrt link version id is set to the default
      // eslint-disable-next-line no-unused-vars

      const { id, ...attributes } = newRun()

      commit('populateRun', { id, attributes })
      commit('populateSmrtLinkVersion', getters.defaultSmrtLinkVersion)

      // success will always be true and errors will be empty
      return { success: true, errors: [] }
    }

    // if it is an existing run

    // call the fetch run action
    const { success, errors = [] } = await dispatch('fetchRun', { id })

    // return the result from the fetchRun
    return { success, errors }
  },

  /**
   * Gets or creates the well based on it's position.
   * If it is a new well it will be built along with retrieving the currentWellDefaults
   * If it is an existing well it will be retrieved
   * @param state the vuex rootState object. Provides access to current state
   * @param position The position of the well
   * @param plateNumber The plate number of the well
   */
  getOrCreateWell: ({ state }, { position, plateNumber }) => {
    return (
      state.wells[plateNumber][position] || newWell({ position, ...state.defaultWellAttributes })
    )
  },

  /**
   * Updates the well
   * @param commit the vuex commit object. Provides access to mutations
   * @param well The well to update
   * @param plateNumber The plate number of the well
   */
  updateWell: ({ commit }, { well, plateNumber }) => {
    commit('updateWell', { well, plateNumber })
  },

  /**
   * "Deletes" the well (adds `_destroy` to the well, a flag for the service)
   * @param commit the vuex commit object. Provides access to mutations
   * @param well The well to update
   * @param plateNumber The plate number of the well
   */
  deleteWell: ({ commit }, { well, plateNumber }) => {
    commit('deleteWell', { well, plateNumber })
  },

  /**
   * Gets the pool based on it's barcode.
   * Finds the pool, commits it to store and then returns it
   * If it is an existing well it will be retrieved
   * @param dispatch We need to call another action
   * @param getters Provides access to the vuex getters
   * @param barcode The barcode to find
   * @returns {Object} {success, errors, pool} success: was the pool returned, errors: any errors from API call, pool: The actual pool
   */
  getPool: async ({ dispatch, getters }, { barcode }) => {
    const { success, errors = [] } = await dispatch('findPools', { barcode })

    const pool = success ? getters.poolByBarcode(barcode) : {}

    return { success, errors, pool }
  },

  /**
   * Updates the store with the SMRT version selected on the component.
   * @param commit the vuex commit object. Provides access to mutations.
   * @param smrtLinkVersion the smrtLinkVersion object to update the store with.
   */
  updateSmrtLinkVersion: ({ commit }, smrtLinkVersion) => {
    commit('populateSmrtLinkVersion', { ...smrtLinkVersion })
  },

  /**
   * Sets the defaultWellAttributes
   * @param commit the vuex commit object. Provides access to mutations
   */
  setDefaultWellAttributes: ({ commit }) => {
    commit('populateDefaultWellAttributes', defaultWellAttributes())
  },

  /**
   * Sets the Instrument Type
   * @param commit the vuex commit object. Provides access to mutations
   * @param state the vuex state object. Provides access to current state
   * @param instrumentName the name of the instrument
   * if a key is passed set the instrument type based on the key
   * otherwise find the instrument type based on the instrument name
   * creates the plates based on the instrument type plate count if it is a new plate
   */
  setInstrumentData: ({ commit, state: { instrumentTypeList, run, runType } }, key) => {
    const instrumentType = key
      ? instrumentTypeList[key]
      : Object.values(instrumentTypeList).find(
          (instrumentType) => instrumentType.name === run.system_name,
        )
    commit('populateInstrumentType', { ...instrumentType })
    if (runType.type === RunTypeEnum.New) {
      commit('createPlates', instrumentType.plateCount)
    }
  },
}
