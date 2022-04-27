<template>
  <div>
    <b-form v-if="show" @reset="onReset">
      <b-form-group
        id="barcode_input_group"
        label="Barcode:"
        label-for="barcode_input"
        description="Please scan the barcode you wish to create labels for."
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
        description="Please select the suffix you want to use from the list."
      >
        <b-form-select
          id="suffix_selection"
          v-model="form.selectedSuffixId"
          :options="suffixOptions"
          placeholder="Please select a suffix"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="number_of_labels_group"
        label="Number of labels:"
        label-for="number_of_labels"
        description="Please enter the number of labels to make (with incrementing suffixes)."
      >
        <b-form-input
          id="number_of_labels_input"
          v-model="form.selectedNumberOfLabels"
          type="number"
          min="1"
          max="9"
          placeholder="Please enter a number"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="printer_choice_group"
        label="Choice of Printer:"
        label-for="printer_choice"
        description="Please select which printer you wish to use to print the labels."
      >
        <b-form-select
          id="printer_of_choice_input"
          v-model="form.selectedPrinterId"
          :options="printerOptions"
          placeholder="Please select a printer"
          required
        ></b-form-select>
      </b-form-group>

      <b-button id="resetButton" type="reset" variant="danger" class="float-left">Reset</b-button>

      <labelPrintingModal
        id="labelPrintingModal"
        ref="labelPrintingModal"
        class="float-right"
        :disabled="suffixedBarcodes.length === 0"
        :list-barcodes="suffixedBarcodes"
        :printer-name="printerName"
      ></labelPrintingModal>
    </b-form>
  </div>
</template>

<script>
import LabelPrintingModal from '@/components/labelPrinting/LabelPrintingModal'
const MESSAGE_SELECT = 'Please select a option'

export default {
  name: 'LabelPrintingForm',
  components: {
    LabelPrintingModal,
  },
  data() {
    return {
      form: {
        barcode: null,
        selectedSuffixId: null,
        selectedNumberOfLabels: null,
        selectedPrinterId: null,
      },
      suffixOptions: [],
      printerOptions: [],
      show: true,
    }
  },
  computed: {
    suffixedBarcodes() {
      if (
        this.form.barcode === null ||
        this.form.selectedSuffixId === null ||
        this.form.selectedNumberOfLabels === null
      ) {
        return []
      }
      var listSuffixedBarcodes = []
      let suffixString = this.suffixOptions[this.form.selectedSuffixId].char

      for (let i = 0; i < this.form.selectedNumberOfLabels; i++) {
        listSuffixedBarcodes.push(this.form.barcode.concat('-', suffixString, i + 1))
      }
      return listSuffixedBarcodes
    },
    printerName() {
      if (this.form.selectedPrinterId === null) {
        return ''
      }
      return this.printerOptions[this.form.selectedPrinterId].text
    },
  },
  created() {
    this.setSuffixOptions()
    this.setPrinterNames()
  },
  methods: {
    setSuffixOptions() {
      let suffixOptions = this.$store.getters.suffixes.map((obj, index) => ({
        value: index + 1,
        text: obj['one_character_name'] + ' (' + obj['potential_label_name'] + ')',
        char: obj['one_character_name'],
      }))
      suffixOptions.unshift({ value: null, text: MESSAGE_SELECT })
      this.suffixOptions = suffixOptions
    },
    setPrinterNames() {
      let printerOptions = this.$store.getters.printers.map((printer, index) => ({
        value: index + 1,
        text: printer,
      }))
      printerOptions.unshift({ value: null, text: MESSAGE_SELECT })
      this.printerOptions = printerOptions
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.barcode = null
      this.form.selectedSuffixId = null
      this.form.selectedNumberOfLabels = null
      this.form.selectedPrinterId = null
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
}
</script>
