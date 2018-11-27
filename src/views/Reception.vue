<template>
  <div class="reception">
    <sample-list ref:sample-list v-bind:samples="samples"></sample-list>
    <b-button @click="postSelectedSamples">Import Samples</b-button>
  </div>
</template>

<script>
import SampleList from '@/components/SampleList'
import axios from 'axios'

export default {
  name: 'Reception',

  data () {
    return {
      samples: this.$store.getters.samples,
      postSelectedSamplesResponse: null
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
    async postSelectedSamples () {

      let body = {
         data: {
            attributes: {
               samples: [
                  {
                     name: "sample2"
                  }
               ]
            }
         }
      }
      let config = {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        }
      }

      try {
        const response = await axios.post(`${process.env.VUE_APP_TRACTION_API}/v1/samples`, { data: { attributes: { samples: this.getSelectedSamples() }}}, config)
        this.postSelectedSamplesResponse = response.data
      } catch (error) {
        this.postSelectedSamplesResponse = error.data
      }

    },
    getSelectedSamples() {
      return this.$store.state.samples.filter(sample => sample.selected)
    }
  },
  components: {
    SampleList,
  }
}
</script>
