<template>
  <div class="reception">
    <alert ref='alert'></alert>

    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <textarea type="text"
                v-model="barcodes"
                class="form-control"
                rows="10"
                cols="10"
                name="barcodes"
                id="barcodes"/>
    </div>

    <b-button class="scanButton"
              id="findSequencescapeTubes"
              variant="success"
              @click="handleSequencescapeTubes"
              :disabled="this.barcodes.length === 0">
      Import Sequencescape Tubes
    </b-button>
    <b-button class="scanButton"
              id="findTractionTubes"
              variant="success"
              @click="handleTractionTubes"
              :disabled="this.barcodes.length === 0">
      Find Traction Tubes
    </b-button>
  </div>
</template>

<script>
import Alert from '@/components/Alert'
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'
import Helper from '@/mixins/Helper'
import getTubesForBarcodes from '@/api/TubeRequests'
import * as consts from '@/consts/consts'

export default {
  name: 'Reception',
  mixins: [Api, Helper],
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
      try {
        let tubes = await this.getSequencescapeTubes()
        await this.exportSampleTubesIntoTraction(tubes)
        await this.handleTractionTubes()
      } catch (err) {
        this.showAlert(err, 'danger')
      }
    },
    async getSequencescapeTubes () {
      let response = await getTubesForBarcodes(this.barcodes, this.sequencescapeTubeRequest)

      if (response.successful && !response.empty) {
        return response.deserialize.tubes
      } else {
        throw consts.MESSAGE_ERROR_FIND_TUBES_FAILED
      }
    },
    async exportSampleTubesIntoTraction (tubes) {
      let body = {
        data: {
          type: "requests",
          attributes: {
            requests: this.sampleTubesJson(tubes)
          }
        }
      }

      let promise = this.tractionSaphyrRequestsRequest.create(body)
      let response = await handlePromise(promise)

      if (response.successful) {
        this.barcodes = response.deserialize.requests.map(r => r.barcode).join('\n')
      } else {
        throw consts.MESSAGE_ERROR_CREATE_TUBES_FAILED + response.errors.message
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        this.showAlert(consts.MESSAGE_WARNING_NO_BARCODES, 'warning')
        return
      }

      let response = await getTubesForBarcodes(this.barcodes, this.tractionSaphyrTubeRequest)

      if (response.successful && !response.empty) {
        let tubes = response.deserialize.tubes
        let barcodesList = this.barcodes.split('\n')
        // check that all barcodes are valid
        if (tubes.length !== barcodesList.length) {
          let validBarcodes = tubes.map((tube) => tube.barcode)
          let invalidBarcodes = barcodesList.filter(
            scannedBarcode => !validBarcodes.includes(scannedBarcode))
          this.showAlert(
            consts.MESSAGE_ERROR_INVALID_BARCODES.concat(invalidBarcodes.join(', ')),
            'danger')
          return
        }

        // check that all the barcodes are either samples (requests) or libraries
        let isAllRequests = tubes.every(t => t.material.type == 'requests')
        let isAllLibraries = tubes.every(t => t.material.type == 'libraries')

        if (isAllRequests) {
          this.$router.push({ path: 'samples', query: { barcode: barcodesList } })
        } else if (isAllLibraries) {
          this.$router.push({ path: 'libraries', query: { barcode: barcodesList } })
        } else {
          // We only want barcodes of the same type
          this.showAlert(consts.MESSAGE_ERROR_SINGLE_TYPE, 'danger')
        }
      } else {
        this.showAlert(consts.MESSAGE_ERROR_GET_TRACTION_TUBES, 'danger')
      }
    },
  },
  computed: {
    sequencescapeTubeRequest () {
      return this.api.sequencescape.tubes
    },
    tractionSaphyrTubeRequest () {
      return this.api.traction.saphyr.tubes
    },
    tractionSaphyrRequestsRequest () {
      return this.api.traction.saphyr.requests
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
