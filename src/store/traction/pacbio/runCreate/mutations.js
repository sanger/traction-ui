import {
  populateById,
  dataToObjectById,
  populateBy,
  dataToObjectByPlateNumber,
  splitDataByParent,
  dataToObjectByPosition,
} from '@/api/JsonApi'
import Vue from 'vue'
import defaultState from './state'

// Mutations handle synchronous update of state

// Helper function for setting pools data
const setData = (state, type, data, includeRelationships = false) => {
  Vue.set(state, type, {
    ...state[type],
    ...dataToObjectById({ data, includeRelationships }),
  })
}

export default {
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} smrtLinkVersions The SmrtLinkVersions to populate the store
   */
  populateSmrtLinkVersions: populateById('smrtLinkVersions'),

  /**
   * Populated via API calls from the actions
   * @param {Object} state The VueXState object
   * @param {Object} id The id of the current run
   * @param {Object} attributes The current runs attributes
   * @param {Object} plates The current runs plates
   */
  populateRun: (state, { id, attributes, plates }) => {
    state.run = {
      id,
      ...attributes,
      plates,
    }
  },

  /**
   * Populated the run type
   * @param {Object} state The VueXState object
   * @param {Object} runType The runType
   */
  populateRunType: (state, runType) => {
    state.runType = runType
  },

  /**
   * Populated the run smrtLinkVersion
   * @param {Object} state The VueXState object
   * @param {Object} smrtLinkVersion The smrtLinkVersion
   */
  populateSmrtLinkVersion: (state, smrtLinkVersion) => {
    state.smrtLinkVersion = smrtLinkVersion
  },

  /**
   * Populated via API calls from the actions
   * @param {Object} state The VueXState object
   */
  populatePools: populateById('pools', { includeRelationships: true, populateResources: false }),

  /**
   * @param {Object} state The VueXState object
   * @param {Object} defaultWellAttributes The default well attributes
   */
  populateDefaultWellAttributes: (state, defaultWellAttributes) => {
    state.defaultWellAttributes = defaultWellAttributes
  },

  setPools(state, pools) {
    Vue.set(state, 'pools', {
      ...state.pools,
      ...dataToObjectById({ data: pools, includeRelationships: true }),
    })
  },

  setTubes(state, tubes) {
    setData(state, 'tubes', tubes, false)
  },
  setLibraries(state, libraries) {
    setData(state, 'libraries', libraries, true)
  },
  setTags(state, tags) {
    setData(state, 'tags', tags, false)
  },
  setRequests(state, requests) {
    setData(state, 'requests', requests, false)
  },
  removePool(state, id) {
    Vue.delete(state.pools, id)
  },
  clearRunData(state) {
    const new_state = defaultState()
    Object.assign(state, new_state, { resources: state.resources })
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} well The well to update
   * @param {Number} plateNumber The number of the plate
   * Replaces the well in store with the updated well
   */
  updateWell: (state, { well, plateNumber }) => {
    const position = well.position
    Vue.set(
      state.run.plates[plateNumber].wells,
      position,
      Object.assign({}, state.run.plates[plateNumber].wells[position], well),
    )
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} well The well to delete
   * @param {Number} plateNumber The number of the plate
   * Adds _destroy key to the well in store so future wells
   * for the same position can be added
   */
  deleteWell: (state, { position, plateNumber }) => {
    const id = state.run.plates[plateNumber].wells[position].id

    Vue.delete(state.run.plates[plateNumber].wells, position)

    state.run.plates[plateNumber].wells['_destroy'].push({ _destroy: true, id })
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} instrumentType The instrumentType to add
   * Adds the instrumentType to state
   */
  populateInstrumentType: (state, instrumentType) => {
    state.instrumentType = instrumentType
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} plates The plates to add
   * Adds the plates to state by plate number
   */
  populatePlates: (state, plates) => {
    populateBy('plates', dataToObjectByPlateNumber, {
      includeRelationships: true,
      populateResources: false,
    })(state, plates)
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} plates The plates for the run
   * @param {Object} wells The wells for the run
   * Adds the wells to state by plate number and well position, two dimensional array
   */
  populateWells: (state, plates, wells) => {
    Vue.set(
      state,
      'wells',
      splitDataByParent({
        data: wells,
        fn: dataToObjectByPosition,
        includeRelationships: true,
        parent: { parentData: plates, children: 'wells', key: 'plate_number' },
      }),
    )
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} plate The plate to add
   * Adds the plate to state by plate number
   */
  addPlate: (state, plate) => {
    Vue.set(state.plates, plate.plate_number, plate)
  },
}
