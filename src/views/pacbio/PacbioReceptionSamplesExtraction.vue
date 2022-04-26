<template>
  <div class="reception">
    <b-modal v-model="busy" hide-footer hide-header no-close-on-backdrop>
      <spinner size="huge" message="Importing tubes..."></spinner>
    </b-modal>
    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <b-form-textarea
        id="barcodes"
        v-model="barcodes"
        placeholder="Scan barcodes to import..."
        rows="4"
        max-rows="10"
        name="barcodes"
      />
    </div>
    <b-row>
      <b-col>
        <LibraryTypeSelect
          v-model="libraryType"
          pipeline="pacbio"
          import-text="Import from Samples Extraction (where available)"
        />
      </b-col>
      <b-col>
        <b-button
          id="findSampleExtractionTubes"
          class="scanButton"
          block
          variant="success"
          :disabled="isDisabled"
          @click="handleSampleExtractionTubes"
          >Import {{ tubeCount }}</b-button
        >
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import { mapActions, mapState } from 'vuex'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import deserialize from '@/api/JsonApi'

export default {
  name: 'PacbioReceptionSamplesExtraction',
  components: {
    LibraryTypeSelect,
    Spinner,
  },
  props: {},
  data() {
    return {
      busy: false,
      barcodes: '',
      libraryType: undefined,
    }
  },
  computed: {
    ...mapState('sampleExtraction', {
      sampleExtractionTubes: (state) => state.sampleExtractionTubes,
    }),
    isDisabled() {
      return this.barcodeArray.length === 0 || this.busy
    },
    barcodeArray() {
      return this.barcodes.split('\n').filter(Boolean)
    },
    tubeCount() {
      if (this.barcodeArray.length == 1) {
        return '1 Sample Extraction Tube'
      } else {
        return `${this.barcodeArray.length} Sample Extraction Tubes`
      }
    },
  },
  methods: {
    ...mapActions('traction/pacbio/requests', ['exportSampleExtractionTubesIntoTraction']),
    ...mapActions('sampleExtraction', ['getSampleExtractionTubesForBarcodes']),
    async handleSampleExtractionTubes() {
      this.busy = true
      try {
        let getSETubeResponse = await this.getSampleExtractionTubesForBarcodes(this.barcodeArray)

        if (!getSETubeResponse.success) {
          throw { message: getSETubeResponse.errors }
        }

        let exportSampleTubesResponse = await this.exportSampleExtractionTubesIntoTraction({
          tubes: this.sampleExtractionTubes,
          libraryType: this.libraryType,
        })
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
        this.showAlert('Failed to create samples: ' + error.message, 'danger')
      }
      this.busy = false
    },
  },
}
</script>

<style scoped lang="scss"></style>
