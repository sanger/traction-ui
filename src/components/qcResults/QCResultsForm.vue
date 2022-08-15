<template>
  <div class="display-contents">
    <traction-section title="Scan Barcode" v-if="!displayForm">
      <template #icon><BarcodeIcon /></template>
      <traction-textarea
        id="barcode"
        v-model="barcode"
        placeholder="Scan barcode to add QC results..."
        rows="1"
        max-rows="1"
        name="barcode"
        class="text-base"
      />

      <br/>

      <traction-button
        id="searchBarcode"
        :disabled="isDisabled"
        class="ml-8 mr-8"
        theme="create"
        @click="searchBarcode"
      >
        Go
      </traction-button>
    </traction-section>


    <traction-section title="QC Results" v-if="displayForm">
      <traction-field-group
        v-for="qcAssay in qcAssays"
        :key="qcAssay.key"
        :label="`${qcAssay.name} (${qcAssay.units})`"
        :attribute="qcAssay.key"
        :for="qcAssay.key">
          <traction-input
            :id="qcAssay.key"
            v-model="formData[qcAssay.key]"
            :type="qcAssay.dataType"
          ></traction-input>
          <br/>
          Existing value: {{ existingData[qcAssay.key] }}
      </traction-field-group>

      <br/>

      <traction-button
        id="save"
        :disabled="isDisabled"
        class="ml-8 mr-8"
        theme="create"
        @click="save"
      >
        Save
      </traction-button>

      <traction-button
        id="searchNewBarcode"
        :disabled="isDisabled"
        class="ml-8 mr-8"
        theme="create"
        @click="searchNewBarcode"
      >
        Search new barcode
      </traction-button>
    </traction-section>
  </div>
</template>

<script>
import Api from '@/mixins/Api'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'

export default {
  name: 'QCResultsForm',
  components: {
    BarcodeIcon
  },
  mixins: [Api],
  props: {

  },
  data() {
    return {
      barcode: '',
      qcAssays: this.retrieveQCAssays(),
      existingData: {},
      displayForm: false,
      formData: {},
    }
  },
  computed: {
    isDisabled: () => false,
  },
  methods: {
    retrieveQCAssays() {
      console.log("retrieving QC Assays...")
      const mockAssays = [
        {
          'key': 'tissueMass',
          'name': 'Tissue mass',
          'dataType': 'number',
          'units': 'mg',
        },
        {
          'key': 'qubit',
          'name': 'Qubit',
          'dataType': 'number',
          'units': 'ng/μl',
        },
      ]
      console.log(mockAssays)
      return mockAssays
    },
    async searchBarcode() {
      console.log("searching by barcode...", this.barcode)
      const tractionData = await this.loadExistingTractionData()
      console.log("retrieved traction data...", tractionData)
      this.existingData = tractionData
      this.displayForm = true
    },
    async loadExistingTractionData() {
      console.log("searching Traction for barcode...")
      return {
        tissueMass: 5,
      }
    },
    async searchNewBarcode() {
      this.displayForm = false
    },
    async save() {
      console.log('saving...')
      console.log(this.formData)
      this.existingData = this.formData
      this.formData = {}
    },
  },
}
</script>
