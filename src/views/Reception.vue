<template>
  <div class="reception">
    <sample-list ref:sample-list v-bind:samples="samples"></sample-list>
    <b-button v-on:click="importSamples">Import Samples</b-button>
  </div>
</template>

<script>
import SampleList from '@/components/SampleList'
import axios from 'axios'

export default {
  name: 'Reception',

  data () {
    return {
      samples: this.$store.getters.samples
    }
  },
  created() {
    this.getSamples()
  },
  methods: {
    getSamples() {
      let self = this
      axios.get(`${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`)
        .then(function (response) {
          self.$store.commit('addSamples', response.data.data.attributes.requests)
        })
    },
    importSamples() {
      let selectedSamples = this.$store.state.samples.filter(sample => sample.selected)
      return selectedSamples.map(s => s.name)

      // return axios.post(`${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`, {})
      //   .then(function (response) {
      //     response.data
      //   })
    }
  },
  components: {
    SampleList,
  }
}
</script>
