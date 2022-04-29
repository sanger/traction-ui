<template>
  <div class="reception">
    <b-modal v-model="busy" hide-footer hide-header no-close-on-backdrop>
      <spinner size="huge" message="Importing labware..."></spinner>
    </b-modal>
    <div class="form-group">
      <div class="flex flex-col gap-y-5">
        <Heading level="2" show-border="true">Scan Barcodes</Heading>
        <div class="px-10">
          <b-form-textarea
            id="barcodes"
            v-model="barcodes"
            placeholder="Scan barcodes to import..."
            rows="4"
            max-rows="10"
            name="barcodes"
          />
        </div>
      </div>
      <div class="flex flex-col gap-y-10 mt-10">
        
        <div class="flex grid grid-cols-2 w-full gap-x-6 justify-left contents-centre">
          <LibraryTypeSelect v-model="libraryType" pipeline="pacbio" show-label="false"/>
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            description="When not provided default is ToL (S4773)"
            label="Cost Code"
            label-for="cost_code"
          >
            <b-form-input id="cost_code" v-model="costCode"></b-form-input>
          </b-form-group>
        </div>
        <div>
          <b-button
            id="createTractionPlates"
            class="scanButton"
            variant="success"
            block
            :disabled="isDisabled"
            @click="createTractionPlates"
            >Import {{ barcodeCount }}</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import Api from '@/mixins/Api'
import { createLabware } from '@/services/traction/Pacbio'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import Heading from '@/components/Heading'

export default {
  name: 'PacbioReceptionSequencescape',
  components: {
    Spinner,
    LibraryTypeSelect,
    Heading,
  },
  mixins: [Api],
  data() {
    return {
      barcodes: '',
      busy: false,
      libraryType: undefined,
      costCode: undefined,
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
        costCode: this.costCode,
      })
      this.showAlert(response.message, response.status)
      this.busy = false
    },
  },
}
</script>

<style scoped lang="scss"></style>
