import Vue from 'vue'
import Vuex from 'vuex'
import Request from '@/api/Request'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    requests: [],
    samples: []
  },
  mutations: {
    addRequests (state, requests) {
      for (let request of requests) {
        if (state.requests.filter(r => r.id == request.id).length === 0) {
          state.requests.push(request)
        }
      }
    },
    addSamples (state, samples) {
      for (let sample of samples) {
        if (state.samples.filter(s => s.id == sample.id).length === 0) {
          state.samples.push(sample)
        }
      }
    },
    selectRequest (state, request) {
      state.requests.find(r => r.id === request.id).selected = !request.selected
    },
    selectSample (state, sample) {
      state.samples.find(s => s.id === sample.id).selected = !sample.selected
    },
    clear (state) {
      state.requests = []
      state.samples = []
    }
  },
  getters: {
    requests: state => {
      return state.requests
    },
    samples: state => {
      return state.samples
    },
    selectedRequests: state => () => {
      return state.requests.filter(request => request.selected)
    },
    selectedSamples: state => () => {
      return state.samples.filter(sample => sample.selected)
    }
  },
  actions: {
    get ({ commit }) {
      Request.get()
      .then(data => {
        commit('addRequests', data)
      }).catch(function(r) {
        // handle alerts
        console.log(r)
      })
    },
    post ({ commit }, data) {
      Request.post(data)
      .then(data => {
        // handle alerts
      }).catch(function(r) {
        // handle alerts
      })
    },
    patch ({ commit }, data) {
      Request.patch(data)
      .then(data => {
        // handle alerts
      }).catch(function(r) {
        // handle alerts
      })
    }
  }
})
