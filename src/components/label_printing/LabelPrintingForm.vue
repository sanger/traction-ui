<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group
          id="barcode_input_group"
          label="Barcode:"
          label-for="barcode_input"
          description="Please scan the barcode you wish to create labels for."
        >
        <b-form-input
          id="barcode_input"
          placeholder="Scan barcode"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="suffix_selection_group"
          label="Suffix:"
          label-for="suffix_selection"
          description="Please select the suffix you want to use from the list."
        >
        <b-form-select id="suffix_selection" v-model="selected_suffix" :options="suffix_options" required></b-form-select>
      </b-form-group>

      <b-form-group
          id="number_of_labels_group"
          label="Number of labels:"
          label-for="number_of_labels"
          description="Please enter the number of labels to make (with incrementing suffixes)."
        >
        <b-form-input v-model="selected_number_of_labels_to_print" type="number" min="1" max="9" required></b-form-input>
      </b-form-group>

      <b-form-group
          id="printer_choice_group"
          label="Choice of Printer:"
          label-for="printer_choice"
          description="Please select which printer you wish to use to print the labels."
        >
        <b-form-select v-model="selected_printer" :options="printer_options" required></b-form-select>
      </b-form-group>

      <b-button type="submit" variant="primary">Print</b-button>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: "LabelPrintingForm",
    data() {
      return {
        selected_suffix: null,
        suffix_options: [
          { value: null, text: 'Please select a suffix' },
          { value: 'AA', text: 'AA suffix desc' },
          { value: 'BB', text: 'BB suffix desc' },
        ],
        selected_number_of_labels_to_print: null,
        selected_printer: null,
        printer_options: [
          { value: null, text: 'Please select a printer' },
          { value: 'ab1234', text: 'Toshiba printer 1' },
          { value: 'cd5678', text: 'Toshiba printer 2' },
        ],
      }
    },
    computed: {
      suffixedBarcodes() {
        if(this.barcode_input === null || this.selected_suffix === null || this.selected_number_of_labels_to_print === null) {
          return null
        }
        var listSuffixedBarcodes = []
        for (let step = 0; step < this.selected_number_of_labels_to_print; step++) {
          listSuffixedBarcodes << this.barcode_input.concat("-", step.toString);
        }
        return listSuffixedBarcodes
      },
    },
  }
</script>

//  To the form component, add a Print button which has a stub function
