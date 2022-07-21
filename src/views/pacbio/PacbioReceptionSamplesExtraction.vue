<template>
  <flagged-feature name="dpl_277_disable_pacbio_specific_reception">
    <template #disabled>
      <div class="reception">
        <loading-full-screen-modal
          :visible="busy"
          message="Importing labware..."
        ></loading-full-screen-modal>
        <div class="form-group">
          <label for="barcodes">Barcodes:</label>
          <traction-textarea
            id="barcodes"
            v-model="barcodes"
            placeholder="Scan barcodes to import..."
            rows="4"
            max-rows="10"
            name="barcodes"
          />
        </div>
        <traction-row>
          <traction-col>
            <LibraryTypeSelect
              v-model="libraryType"
              pipeline="pacbio"
              import-text="Import from Samples Extraction (where available)"
            />
          </traction-col>
          <traction-col>
            <traction-button
              id="findSampleExtractionTubes"
              class="scanButton"
              full-width
              theme="create"
              :disabled="isDisabled"
              @click="handleSampleExtractionTubes"
              >Import {{ tubeCount }}</traction-button
            >
          </traction-col>
        </traction-row>
      </div>
    </template>
    Pacbio receptions are disabled, please use the general reception. Link in the menu bar at the
    top
  </flagged-feature>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import deserialize from '@/api/JsonApi'

export default {
  name: 'PacbioReceptionSamplesExtraction',
  components: {
    LibraryTypeSelect,
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
