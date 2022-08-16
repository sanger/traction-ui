<template>
  <div class="display-contents">
    <traction-section title="Labware" >
      <traction-field-group
        label="Barcode"
        attribute="barcode"
        for="barcode">
          <traction-textarea
            id="barcode"
            v-model="barcode"
            placeholder="Scan barcode to manage QC results..."
            rows="1"
            max-rows="1"
            name="barcode"
            class="text-base"
            :disabled="displayForm"
          />
      </traction-field-group>

      <traction-button
        id="searchBarcode"
        :disabled="isDisabled || displayForm"
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
      isDisabled: false,
      barcodeDisabled: false,
    }
  },
  computed: {
  },
  methods: {
    // Retrieve the QC assays that we know about (configured in Traction Service), for user to enter data against.
    retrieveQCAssays() {
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
      return mockAssays
    },
    // See if we recognise the user-entered barcode and loads data if so.
    // Currently only checks if in Traction, but could also check Sequencescape and Samples Extraction
    async searchBarcode() {
      this.isDisabled = true
      if(!this.barcode) {
        this.isDisabled = false
        return
      }

      this.preprocessBarcode()

      const tractionData = await this.loadExistingTractionData()
      this.existingData = tractionData

      this.displayForm = true
      this.barcodeDisabled = true
      this.isDisabled = false
    },
    // Do any validation or formatting required on the user-entered barcode
    preprocessBarcode() {
      this.barcode = this.barcode.trim()
    },
    async loadExistingTractionData() {
      return {
        tissueMass: 5,
      }
    },
    // Reset the form, to look at QC results of a new labware
    async searchNewBarcode() {
      let goAhead = false
      if(!this.isObjEmpty(this.formData)){
        goAhead = confirm("There is unsaved data in the form. Are you sure you want to discard it?")
      } else {
        goAhead = true
      }
      if(goAhead) {
        this.resetForm()
      }
    },
    // Send user-entered QC data to Traction Service to be saved
    async save() {
      this.isDisabled = true

      this.existingData = this.formData
      this.formData = {}

      this.isDisabled = false
    },
    isObjEmpty(obj) {
      return Object.keys(obj).length === 0
    },
    resetForm() {
      this.barcode = ''
      this.formData = {}
      this.existingData = {}
      this.displayForm = false
    }
  },
}
</script>
