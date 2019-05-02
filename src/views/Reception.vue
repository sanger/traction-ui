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
import Api from '@/mixins/Api'
import getTubesForBarcodes from '@/api/TubeRequests'

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
    //TODO: Find a better way to extract information from responses.
    sampleTubesJson (tubes) {
      return tubes.map(t => ({
        external_id: t.samples[0].uuid,
        external_study_id: t.studies[0].uuid,
        name: t.name,
        species: t.samples[0].sample_metadata.sample_common_name
      }))
    },
    async handleSequencescapeTubes () {
      let response = await getTubesForBarcodes(this.barcodes, this.sequencescapeTubeRequest)
      let tubes

      if (response.successful && !response.empty) {
        tubes = response.deserialize.tubes
      } else {
        this.message = 'There was an error'
        return
      }

      await this.exportSampleTubesIntoTraction(tubes)
      await this.handleTractionTubes()
    },
    async exportSampleTubesIntoTraction (tubes) {
      let body = { data: { attributes: { samples: this.sampleTubesJson(tubes) }}}

      let promise = this.sampleRequest.create(body)
      let response = await handlePromise(promise)

      if (response.successful) {
        this.barcodes = response.deserialize.samples.map(s=> s.barcode).join('\n')
        return response
      } else {
        this.message = response.errors.message
        return response
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        this.message = 'There are no barcodes'
        return
      }

      let response = await getTubesForBarcodes(this.barcodes, this.tractionTubeRequest)
      if (response.successful && !response.empty) {
        let tubes = response.deserialize.tubes
        let table = tubes.every(t => t.material.type == "samples") ? "Samples" : "Libraries"
        if (table) {
          this.$router.push({name: table, params: {items: tubes}})
        }
      } else {
        this.message = 'There was an error'
      }
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  computed: {
    sequencescapeTubeRequest () {
      return this.api.sequencescape.tubes
    },
    tractionTubeRequest () {
      return this.api.traction.tubes
    },
    sampleRequest () {
      return this.api.traction.samples
    }
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
