<template>
  <div class="reception">
    <sample-list v-ref:sample-list v-bind:samples="samples"></sample-list>
    <b-button>Import Samples</b-button>
  </div>
</template>

<script>
import SampleList from '@/components/SampleList'
import axios from 'axios'

export default {
  name: 'Reception',

  data () {
    return {
      samples: []
    }
  },
  created() {
    this.getSamples()
  },
  methods: {
    getSamples() {
      let self = this

      axios.get('http://localhost:3000/api/v2/requests')
        .then(function (response) {
          self.samples = response.data.data.attributes.requests
        })
    },
    importSamples() {
      return axios.post('http://localhost:3000/api/v2/requests', {})
        .then(function (response) {
          response.data
        })
    }
  },
  components: {
    SampleList,
  }
}
</script>
