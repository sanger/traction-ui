import {
  populateById,
  dataToObjectById,
  populateBy,
  dataToObjectByPlateNumber,
  splitDataByParent,
  dataToObjectByPosition,
} from '@/api/JsonApi'
import defaultState from './state'
import { newPlate } from './run'

// Mutations handle synchronous update of state

// Helper function for setting pools data
const setData = (state, type, data, includeRelationships = false) => {
  state[type] = {
    ...state[type],
    ...dataToObjectById({ data, includeRelationships }),
  }
}

export default {
  /**
   * Populated with resources via API calls from the actions
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
  populateRun: (state, { id, attributes }) => {
    state.run = {
      id,
      ...attributes,
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
    state['pools'] = {
      ...state.pools,
      ...dataToObjectById({ data: pools, includeRelationships: true }),
    }
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
    delete state.pools[id]
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
    // TODO: is Object.assign necessary here?
    state.wells[plateNumber][well.position] = Object.assign(
      {},
      state.wells[plateNumber][well.position],
      well,
    )
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} well The well to delete
   * @param {Number} plateNumber The number of the plate
   * Adds _destroy key to the well in store so future wells
   * for the same position can be added
   */
  deleteWell: (state, { well, plateNumber }) => {
    const id = state.wells[plateNumber][well.position].id

    delete state.wells[plateNumber][well.position]
    state.wells[plateNumber]['_destroy'].push({ _destroy: true, id })
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
   * Adds the _destroy key to each well plate
   */
  populateWells: (state, { plates, wells }) => {
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
    state.wells = wellsByPlate
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} plateNumber The number of plates to add
   * Adds the plates to state by plate number
   * Adds the wells to state by plate number
   * Warning: this is a destructive action
   * Firstly removes wells and plates from state
   */
  createPlatesAndWells: (state, plateNumber) => {
    // empty the wells and plates
    // we need to do this as we may be going from 2 plates to 1 plate
    state.plates = {}
    state.wells = {}

    for (let i = 1; i <= plateNumber; i++) {
      state.plates[i] = newPlate(i)
      state.wells[i] = { _destroy: [] }
    }
  },
}
