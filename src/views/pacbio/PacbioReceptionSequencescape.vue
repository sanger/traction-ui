<template>
  <div class="reception">
    <b-modal v-model="busy" hide-footer hide-header no-close-on-backdrop>
      <spinner size="huge" message="Importing labware..."></spinner>
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
      <b-col><LibraryTypeSelect v-model="libraryType" pipeline="pacbio" /></b-col>
      <b-col>
        <b-button
          id="createTractionPlates"
          class="scanButton"
          variant="success"
          block
          :disabled="isDisabled"
          @click="createTractionPlates"
        >
          Import {{ barcodeCount }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import Api from '@/mixins/Api'
import { createLabware } from '@/services/traction/Pacbio'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'

export default {
  name: 'PacbioReceptionSequencescape',
  components: {
    Spinner,
    LibraryTypeSelect,
  },
  mixins: [Api],
  data() {
    return {
      barcodes: '',
      busy: false,
      libraryType: undefined,
    }
  },
  computed: {
    barcodeArray() {
      return this.barcodes.split(/\s/).filter(Boolean)
    },
    isDisabled() {
      return this.barcodeArray.length === 0 || this.busy
    },
    sequencescapeRequest() {
      return this.api.sequencescape.labware
    },
    tractionRequest() {
      return this.api.traction.pacbio
    },
    requests() {
      return {
        traction: this.tractionRequest,
        sequencescape: this.sequencescapeRequest,
      }
    },
    barcodeCount() {
      return `${this.barcodeArray.length} labware`
    },
  },
  methods: {
    async createTractionPlates() {
      this.busy = true
      const response = await createLabware({
        requests: this.requests,
        barcodes: this.barcodeArray,
        libraryType: this.libraryType,
      })
      this.showAlert(response.message, response.status)
      this.busy = false
    },
  },
}
</script>

<style scoped lang="scss"></style>
