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
              @click="findTractionTubes"
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
      } catch (error) {
        this.showAlert(error.message, 'danger')
      }
    },
    async getSequencescapeTubes () {
      let response = await getTubesForBarcodes(this.barcodes, this.sequencescapeTubeRequest)

      if (response.successful && !response.empty) {
        return response.deserialize.tubes
      } else {
        throw Error(consts.MESSAGE_ERROR_FIND_TUBES_FAILED)
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
        throw Error(consts.MESSAGE_ERROR_CREATE_TUBES_FAILED + response.errors.message)
      }
    },
    async findTractionTubes() {
      try {
        await this.handleTractionTubes()
      } catch (error) {
        this.showAlert(error.message, 'danger')
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        throw Error(consts.MESSAGE_WARNING_NO_BARCODES)
      }

      let response = await getTubesForBarcodes(this.barcodes, this.tractionSaphyrTubeRequest)
      this.log(response)

      if (response.successful && !response.empty) {
        let tubes = response.deserialize.tubes
        let barcodesList = this.barcodes.split('\n')
        // check that all barcodes are valid
        this.checkBarcodes(tubes, barcodesList)

        // check that all the barcodes are either samples (requests) or libraries
        this.checkMaterialTypes(tubes, barcodesList)
      } else {
        throw Error(consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
      }
    },
    /**
     * Check that the list of barcodes provided match barcodes we have available and alert those
     * which are invalid
     * @param {*} barcodesList A list of barcodes which a user has entered/scanned
     */
    checkBarcodes(tubes, barcodesList) {
      if (tubes.length !== barcodesList.length) {
        let validBarcodes = tubes.map((tube) => tube.barcode)
        let invalidBarcodes = barcodesList.filter(
          scannedBarcode => !validBarcodes.includes(scannedBarcode))
        throw Error(consts.MESSAGE_ERROR_INVALID_BARCODES.concat(invalidBarcodes.join(', ')))
      }
    },
    /**
     * To be directed to the correct view, either samples or libraries, we need to ensure that all
     * the tubes are of the same material type
     * @param {*} tubes All the tubes returned from the query
     * @param {*} barcodesList A list of barcodes which a user has entered/scanned
     */
    checkMaterialTypes(tubes, barcodesList) {
      let isAllRequests = tubes.every(t => t.material.type == 'requests')
      let isAllLibraries = tubes.every(t => t.material.type == 'libraries')

      if (isAllRequests) {
        this.$router.push({ name: 'SaphyrSamples', query: { barcode: barcodesList } })
      } else if (isAllLibraries) {
        this.$router.push({ name: 'SaphyrLibraries', query: { barcode: barcodesList } })
      } else {
        // We only want barcodes of the same type
      throw Error(consts.MESSAGE_ERROR_SINGLE_TYPE)
      }
    }
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
