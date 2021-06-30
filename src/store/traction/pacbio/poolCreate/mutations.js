// Mutations handle synchronous update of state.
export default {
  /**
   * Flags plate with `id` as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the plate
   * @param {Boolean} selected Whether the plate is selected (defaults to true)
   */
  selectPlate: (state, { id, selected = true }) => {
    let plate = state.selected.plates.find((p) => p.id === id)
    plate.selected = selected
  },
  /**
   * Flags requests from a plate as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {String} barcode The plate barcode
   */
  selectPlateRequests: (state, { barcode, selected = true }) => {
    let requests = state.resources.requests.filter((req) =>
      req.attributes.source_identifier.includes(`${barcode}:`),
    )
    state.selected.requests.map((request) => {
      if (requests.find((req) => req.id === request.id)) {
        request.selected = selected
      }
    })
  },
  /**
   * Flags plates in the array as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {Array.<{id: String, selected: Boolean}>} plates An array of plate id objects to be selected
   * @param {Boolean} selected Whether the plate is selected (defaults to true)
   */
  selectPlates: (state, plates) => {},
  /**
   * Flags tagSet with `id` as selected.
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the plate
   */
  selectTagSet: (state, { id }) => {},
  /**
   * Flags request with `id` as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {String} id The id of the plate
   */
  selectRequest: (state, { id }) => {},
  /**
   * Flags requests in the Array as selected. (Or unselected if selected is false)
   * @param {Object} state The Vuex state object
   * @param {Array.<{id: String, selected: Boolean}>} requests An array of plate id objects to be selected
   * @param {Boolean} selected Whether the plate is selected (defaults to true)
   */
  selectRequests: (state, requests) => {},

  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} plates The plate resources to populate the store
   */
  populatePlates: (state, plates) => {
    state.resources.plates = plates
    plates.forEach((plate) => state.selected.plates.push({ id: plate.id, selected: false }))
  },
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} wells The well resources to populate the store
   */
  populateWells: (state, wells) => {},
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} requests The request resources to populate the store
   */
  populateRequests: (state, requests) => {
    state.resources.requests = requests
    requests.forEach((request) => state.selected.requests.push({ id: request.id, selected: false }))
  },
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} tagSets The tagSet resources to populate the store
   */
  populateTagSets: (state, tagSets) => {},
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} tags The tag resources to populate the store
   */
  populateTags: (state, tags) => {},
}
