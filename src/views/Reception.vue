<template>
  <div class="reception">
    <alert ref='alert'></alert>
    <sample-list ref:sample-list v-bind:samples="samples"></sample-list>
    <b-button id="exportSamplesButton" @click="postSelectedSamples">Import Samples</b-button>
  </div>
</template>

<script>
import SampleList from '@/components/SampleList'
import axios from 'axios'
import Alert from '@/components/Alert'

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
    // Export the selected samples to Traction backend service
    async postSelectedSamples () {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_TRACTION_API}/v1/samples`,
          { data: { attributes: { samples: this.getSelectedSamples() }}},
          this.config
        )
        this.$refs.alert.show(response.data, 'success')
      } catch (error) {
        let errors = error.response.data.errors
        this.$refs.alert.show(errors, 'danger')
      }
    },
    // Update the status of samples in SS from pending to started
    async updateSampleStatusInSS () {
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`,
          { data: { attributes: { requests: this.updateStatusJson() }}},
          this.config
        )
        this.$refs.alert.show(response.data, 'success')
      } catch (error) {
        let errors = error.response.data.errors
        this.$refs.alert.show(errors, 'danger')
      }
    },
    getSelectedSamples() {
      return this.$store.getters.selectedSamples()
    },
    updateStatusJson () {
      return this.getSelectedSamples().map(
        sample => ({ id: sample.id, state: 'started'}))
    }
  },
  components: {
    SampleList,
    Alert
  },
  computed: {
    config () {
       return { headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      } }
    }
  }
}
</script>
