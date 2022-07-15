<template>
  <flagged-feature name="dpl_277_disable_saphyr_specific_reception">
    <template #disabled>
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

        <traction-button
          id="findSampleExtractionTubes"
          class="scanButton"
          theme="create"
          :disabled="barcodes.length === 0"
          @click="handleSampleExtractionTubes"
          >Import Sample Extraction Tubes</traction-button
        >
      </div>
    </template>
    Saphyr receptions are disabled, please use the general reception. Link in the menu bar at the
    top
  </flagged-feature>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import deserialize from '@/api/JsonApi'
import FlaggedFeature from '../../components/shared/FlaggedFeature.vue'

export default {
  components: { FlaggedFeature },
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

        if (!getSETubeResponse.success) {
          throw { message: getSETubeResponse.errors }
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
