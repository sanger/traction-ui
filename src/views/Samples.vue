<template>
  <div class="samples">
    <sample-list ref:sample-list v-bind:samples="samples"></sample-list>
  </div>
</template>

<script>
import SampleList from '@/components/SampleList'
import axios from 'axios'

export default {
  name: 'Samples',

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
      axios.get(`${process.env.VUE_APP_TRACTION_API}/v1/samples`)
      .then(function (response) {
        let samples = self.buildSamplesFromResponseHelper(response.data.data)
        self.$store.commit('addSamples', samples)
      })
    },
    buildSamplesFromResponseHelper(data) {
      let samples = []
      for (let i = 0; i < data.length; i++) {
        let sample = {
          id: data[i].id,
          name: data[i].attributes.name,
          species: data[i].attributes.species
        }
        samples.push(sample)
      }
      return samples
    },
  },
  components: {
    SampleList
  },
  computed: {
  }
}
</script>
