<template>
  <div>
    <b-form v-if="show" class="w-50 text-left" @submit="onSubmit" @reset="onReset">
      <b-form-group
        id="barcode_input_group"
        label="Barcode:"
        label-for="barcode_input"
        description="A single barcode to create labels for."
      >
        <b-form-input
          id="barcode_input"
          v-model="form.barcode"
          placeholder="Please scan the barcode"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="suffix_selection_group"
        label="Suffix:"
        label-for="suffix_selection"
        description="The suffix used to increment the barcode."
      >
        <b-form-select
          id="suffix_selection"
          v-model="form.selectedSuffix"
          :options="suffixOptions"
          value-field="text"
          placeholder="Please select a suffix"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="number_of_labels_group"
        label="Number of labels:"
        label-for="number_of_labels"
        description="Number of labels to print (max 9)"
      >
        <b-form-input
          id="number_of_labels"
          v-model="form.selectedNumberOfLabels"
          type="number"
          :min="1"
          :max="9"
          placeholder="Please enter a number"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="printer_choice_group"
        label="Choice of Printer:"
        label-for="printer_choice"
        description="The printer to print the labels."
      >
        <b-form-select
          id="printer_choice"
          v-model="form.selectedPrinterName"
          :options="printerOptions"
          value-field="text"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="copies_group"
        label="Number of copies per label:"
        label-for="copies"
        description="Number of copies of each label you would like to print."
      >
        <b-form-input
          id="copies"
          v-model="form.copies"
          type="number"
          :min="1"
          :max="10"
          placeholder="Please select a number"
          required
        ></b-form-input>
      </b-form-group>

      <b-button id="submitButton" type="submit" variant="primary">Print Labels</b-button>

      <b-button id="resetButton" type="reset" variant="danger" class="float-left">Reset</b-button>

      <labelPrintingModal
        id="labelPrintingModal"
        ref="labelPrintingModal"
        class="float-right"
        v-bind="propsToPass()"
      ></labelPrintingModal>
    </b-form>
  </div>
</template>

<script>
import LabelPrintingModal from '@/components/labelPrinting/LabelPrintingModal'
import SuffixList from '@/config/SuffixList'

const defaultForm = () => ({
  barcode: null,
  selectedSuffix: null,
  selectedNumberOfLabels: null,
  selectedPrinterName: null,
  copies: null,
})

export default {
  name: 'LabelPrintingForm',
  components: {
    LabelPrintingModal,
  },
  data() {
    return {
      form: defaultForm(),
      suffixOptions: [],
      printerOptions: [],
      show: true,
    }
  },
  created() {
    this.setSuffixOptions()
    this.setPrinterNames()
  },
  methods: {
    setSuffixOptions() {
      let suffixOptions = SuffixList.map((obj) => ({
        text: obj.one_character_name,
      }))
      this.suffixOptions = suffixOptions
    },
    setPrinterNames() {
      let printerOptions = this.$store.getters.printers.map((name) => ({
        text: name,
      }))
      this.printerOptions = printerOptions
    },
    propsToPass() {
      const props = {}

      props.barcodesList = this.suffixedBarcodes()
      props.printerName = this.printerName()
      props.copies = this.form.copies

      return props
    },
    suffixedBarcodes() {
      var listSuffixedBarcodes = []

      for (let i = 0; i < this.form.selectedNumberOfLabels; i++) {
        listSuffixedBarcodes.push(this.form.barcode.concat('-', this.form.selectedSuffix, i + 1))
      }
      return listSuffixedBarcodes
    },
    printerName() {
      return this.form.selectedPrinterName
    },
    onSubmit(event) {
      event.preventDefault()
      this.$bvModal.show('labelPrintingModal')
    },
    onReset(event) {
      event.preventDefault()

      // Reset our form values
      this.form = defaultForm()

      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
}
</script>
