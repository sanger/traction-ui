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
      >Import Sample Extraction Tubes</b-button
    >
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import deserialize from '@/api/JsonApi'

export default {
  name: 'SaphyrReception',
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

        if (!getSETubeResponse.success || getSETubeResponse.data.data.length === 0) {
          let errorMessage = 'Sample Extraction tubes failed to be imported'
          // Is this just for supporting the tests??
          if (getSETubeResponse.errors && getSETubeResponse.errors.length > 0) {
            errorMessage = getSETubeResponse.errors
          }
          throw { message: errorMessage }
        }

        let exportSampleTubesResponse = await this.exportSampleExtractionTubesIntoTraction(
          this.sampleExtractionTubes,
        )

        if (
          !exportSampleTubesResponse.success ||
          exportSampleTubesResponse.data.data.length === 0
        ) {
          throw { message: exportSampleTubesResponse.errors }
        }

        let tractionTubesBarcodeList = deserialize(exportSampleTubesResponse.data)
          .requests.map((r) => r.barcode)
          .join(', ')

        this.showAlert(
          'Samples have been created with barcodes: ' + tractionTubesBarcodeList,
          'success',
        )
      } catch (error) {
        this.showAlert(error.message, 'danger')
      }
    },
    ...mapActions('traction/saphyr/requests', ['exportSampleExtractionTubesIntoTraction']),
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
