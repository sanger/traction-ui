import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    samples: []
  },
  mutations: {
    addSamples (state, samples) {
      for (let i = 0; i < samples.length; i++) {
        let sample = samples[i]
        state.samples.push(sample)
      }
    },
    selectSample (state, sample) {
      state.samples.find(s => s.id === sample.id).selected = !sample.selected
    },
    clear (state) {
      state.samples = []
    }
  },
  getters: {
    samples: state => {
      return state.samples
    },
    selectedSamples: state => () => {
      return state.samples.filter(sample => sample.selected)
    }
  }
})
