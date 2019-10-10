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
import Helper from '@/mixins/Helper'
import * as consts from '@/consts/consts'

import { mapActions, mapState } from 'vuex'

export default {
  name: 'Reception',
  mixins: [Helper],
  props: {
  },
  data () {
    return {
      barcodes: []
    }
  },
  components: {
    Alert
  },
  methods: {
    getBarcodes () {
      return this.barcodes.split('\n').filter(Boolean)
    },
    async handleSequencescapeTubes () {
      try {
        let getSSTubeResponse = await this.getSequencescapeTubesForBarcodes(this.getBarcodes())
        if (!getSSTubeResponse.successful || getSSTubeResponse.empty) {
          throw getSSTubeResponse.errors
        }

        let exportSampleTubesResponse = await this.exportSampleTubesIntoTraction(this.sequencescapeTubes)
        if (!exportSampleTubesResponse.successful || exportSampleTubesResponse.empty) {
          throw exportSampleTubesResponse.errors
        }

        let tractionTubesBarcodeList = exportSampleTubesResponse.deserialize.requests.map(r => r.barcode)
        await this.handleTractionTubes(tractionTubesBarcodeList)

      } catch (error) {
        this.showAlert(error.message, 'danger')
      }
    },
    async findTractionTubes() {
      try {
        await this.handleTractionTubes(this.getBarcodes())
      } catch (error) {
        this.showAlert(error.message, 'danger')
      }
    },
    async handleTractionTubes (barcodeList) {
      if (barcodeList === undefined || !barcodeList.length) {
        throw Error(consts.MESSAGE_WARNING_NO_BARCODES)
      }

      let response = await this.getTractionTubesForBarcodes(barcodeList)

      if (response.successful && !response.empty) {
        let tubes = this.tractionTubes

        // check that all barcodes are valid
        this.checkBarcodes(tubes, barcodeList)

        // check that all the barcodes are either samples (requests) or libraries
        this.checkMaterialTypes(tubes, barcodeList)
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
        this.$router.push({ name: 'PacbioSamples', query: { barcode: barcodesList } })
      } else if (isAllLibraries) {
        this.$router.push({ name: 'PacbioLibraries', query: { barcode: barcodesList } })
      } else {
        // We only want barcodes of the same type
      throw Error(consts.MESSAGE_ERROR_SINGLE_TYPE)
      }
    },
    ...mapActions('traction/pacbio/tubes', [
      'getTractionTubesForBarcodes',
      'exportSampleTubesIntoTraction'
    ]),
    ...mapActions('sampleExtraction', [
      'getSequencescapeTubesForBarcodes'
    ])
  },
  computed: {
    ...mapState('traction/pacbio/tubes', {
      tractionTubes: state => state.tractionTubes
    }),
    ...mapState('sequencescape', {
      sequencescapeTubes: state => state.sequencescapeTubes
    })
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
