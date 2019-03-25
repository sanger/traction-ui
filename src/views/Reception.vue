<template>
  <div class="reception">
    <alert ref='alert'></alert>

    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <textarea type="text" v-model="barcodes" class="form-control" rows="10" cols="10" name="barcodes" id="barcodes" />
    </div>
    <b-button class="scanButton" id="findSequencescapeTubes" variant="success" @click="handleSequencescapeTubes" :disabled="this.barcodes.length === 0">Import Sequencescape Tubes</b-button>
    <b-button class="scanButton" id="findTractionTubes" variant="success" @click="handleTractionTubes" :disabled="this.barcodes.length === 0">Find Traction Tubes</b-button>

  </div>
</template>

<script>
import Alert from '@/components/Alert'
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/api'

export default {
  name: 'Reception',
  mixins: [Api],
  props: {
  },
  data () {
    return {
      barcodes: [],
      message: ''
    }
  },
  components: {
    Alert
  },
  methods: {
    async handleSequencescapeTubes () {
      let tubes = await this.findTubes(this.sequencescapeTubeRequest)
      await this.exportSampleTubesIntoTraction(tubes)
      await this.handleTractionTubes()
      this.showAlert()
    },
    async handleTractionTubes () {
      let tubes = await this.findTubes(this.tractionTubeRequest)
      if (tubes.some(t => t.material)) {
          this.$router.push({name: 'Table', params: {items: tubes}})
      }
      this.showAlert()
    },
    async findTubes (request) {
      if(!this.queryString) return

      let promise = request.get({filter: { barcode: this.queryString} })
      let response = await handlePromise(promise)

      if (response.successful) {
        if (response.empty) {
          this.message = 'No tubes found'
          return response
        } else {
          this.message = 'Tubes successfully found'
          return response.deserialize.tubes
        }
      } else {
        this.message = 'There was an error'
        return response
      }
    },
    async exportSampleTubesIntoTraction (tubes) {
      let sampleTubeJSON = tubes.map(t => Object.assign(
        {
          external_id: t.samples[0].id,
          name: t.name,
          species: t.samples[0].sample_metadata.sample_common_name
        }
      ))

      let body = { data: { attributes: { samples: sampleTubeJSON }}}

      let promise = this.sampleRequest.create(body)
      let response = await handlePromise(promise)

      if (response.successful) {
        this.barcodes = response.deserialize.samples.map(s=> s.barcode).join('\n')
        return response
      } else {
        this.message = response.errors.message
        // throw
        return response
      }
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  computed: {
    queryString () {
      if (this.barcodes === undefined || !this.barcodes.length) return ''
      return this.barcodes.split('\n').filter(Boolean).join(',')
    },
    sequencescapeTubeRequest () {
      return this.api.sequencescape.tubes
    },
    tractionTubeRequest () {
      return this.api.traction.tubes
    },
    sampleRequest () {
      return this.api.traction.samples
    },

  }
}

</script>

<style lang="scss">
  textarea {
    border: 1px solid;
  }

  .scanButton {
    margin: 0.5rem;
  }
</style>
