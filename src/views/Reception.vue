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

      // const response = await axios({
      //   url: '/v1/samples',
      //   method: 'post',
      //   baseURL: `${process.env.VUE_APP_TRACTION_API}`,
      //   headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/vnd.api+json'},
      //   data: {
      //     attributes: 'Fred'
      //   }
      // })

      let data = { attributes: {}}
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/vnd.api+json'
        }
      }

      const response = await axios.post(`${process.env.VUE_APP_TRACTION_API}/v1/samples`, data, config)
      this.postSelectedSamplesResponse = response.data
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
