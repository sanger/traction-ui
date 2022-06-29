<template>
  <div>
    <loading-full-screen-modal
      :visible="busy"
      message="Importing labware..."
    ></loading-full-screen-modal>
    <div class="form-group">
      <div class="flex flex-col gap-y-4">
        <TractionHeading level="4" :show-border="true">
          <div class="flex flex-row gap-x-2"><BarcodeIcon />Scan Barcodes</div></TractionHeading
        >
        <div class="sm:px-6 lg:px-8">
          <b-form-textarea
            id="barcodes"
            v-model="barcodes"
            placeholder="Scan barcodes to import..."
            rows="4"
            max-rows="10"
            name="barcodes"
            class="text-base"
          />
        </div>
      </div>
      <div class="flex flex-col gap-y-4 mt-10">
        <TractionHeading level="4" :show-border="true">Request Options</TractionHeading>
        <div class="flex grid grid-cols-2 sm:px-6 lg:px-8 gap-x-8 justify-left contents-centre">
          <LibraryTypeSelect v-model="libraryType" pipeline="pacbio" :label-cols="0" />
          <b-form-group
            label-cols="0"
            description="When not provided default is ToL (S4773)"
            label="Cost Code"
            label-for="cost_code"
            label-align="left"
            label-size="sm"
            class="text-base"
          >
            <b-form-input id="cost_code" v-model="costCode"></b-form-input>
          </b-form-group>
        </div>
        <b-button
          id="createTractionPlates"
          class="text-sm ml-8 mr-8 text-white border-sdb-400 bg-sdb-400 shadow-sm hover:bg-sdb focus:border-sdb focus:shadow-outline-sdb active:bg-sdb-600"
          variant="success"
          :disabled="isDisabled"
          @click="createTractionPlates"
          >Import {{ barcodeCount }}</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/mixins/Api'
import { createLabware } from '@/services/traction/Pacbio'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import TractionHeading from '@/components/TractionHeading'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'

export default {
  name: 'PacbioReceptionSequencescape',
  components: {
    LibraryTypeSelect,
    TractionHeading,
    BarcodeIcon,
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
