<template>
  <div class="reception">
    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <textarea
        id="barcodes"
        v-model="barcodes"
        type="text"
        class="form-control"
        rows="10"
        cols="10"
        name="barcodes"
      />
    </div>

    <b-button
      id="findSampleExtractionTubes"
      class="scanButton"
      variant="success"
      :disabled="barcodes.length === 0"
      @click="handleSampleExtractionTubes"
    >
      Import Sample Extraction Tubes
    </b-button>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Reception',
  mixins: [Helper],
  props: {},
  data() {
    return {
      barcodes: [],
    }
  },
  computed: {
    ...mapState('sampleExtraction', {
      sampleExtractionTubes: (state) => state.sampleExtractionTubes,
    }),
  },
  methods: {
    getBarcodes() {
      return this.barcodes.split('\n').filter(Boolean)
    },
    async handleSampleExtractionTubes() {
      try {
        let getSETubeResponse = await this.getSampleExtractionTubesForBarcodes(this.getBarcodes())
        if (!getSETubeResponse.successful || getSETubeResponse.empty) {
          throw getSETubeResponse.errors
        }

        let exportSampleTubesResponse = await this.exportSampleExtractionTubesIntoTraction(
          this.sampleExtractionTubes,
        )
        if (!exportSampleTubesResponse.successful || exportSampleTubesResponse.empty) {
          throw exportSampleTubesResponse.errors
        }
        let tractionTubesBarcodeList = exportSampleTubesResponse.deserialize.requests
          .map((r) => r.barcode)
          .join(', ')
        this.showAlert(
          'Samples have been created with barcodes: ' + tractionTubesBarcodeList,
          'success',
        )
      } catch (error) {
        this.showAlert('Failed to create samples: ' + error.message, 'danger')
      }
    },
    ...mapActions('traction/pacbio/requests', ['exportSampleExtractionTubesIntoTraction']),
    ...mapActions('sampleExtraction', ['getSampleExtractionTubesForBarcodes']),
  },
}
</script>

<style scoped lang="scss">
textarea {
  border: 1px solid;
}

.scanButton {
  margin: 0.5rem;
}
</style>
