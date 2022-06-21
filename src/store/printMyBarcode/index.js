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
