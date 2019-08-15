import handlePromise from '@/api/PromiseHelper'

const tubeModule = {
  // namespace everything so this would be 'store/saphyr/tube'
  namespaced: true,
  state: {
    tubes: []
  },
  mutations: {
    setTubes (state, tubes) {
      state.tubes = tubes
    }
  },
  actions: {
    async getTractionTubesForBarcodes ({ commit, getters }, barcodeString) {
      let request = getters.tubeRequest
      let promise = request.get({filter: { barcode: barcodeString} })
      let response = await handlePromise(promise)
      let tubes = response.deserialize.tubes
      commit('setTubes', tubes)
    }
  },
  getters: {
    tubeRequest: (state, getters, rootState) => rootState.api.traction.saphyr.tubes,
    tubes: state => state.tubes
  }
}

export default tubeModule
