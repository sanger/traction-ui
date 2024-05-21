import state from './state'
import getters from './getters'
import actions from './actions'

const printMyBarcode = {
  namespaced: true,
  state,
  getters,
  actions,
}

export default printMyBarcode

// TODO: Once users of this store are refactored to use the new store, this file can be deleted.
