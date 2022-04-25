<template>
  <div>
    <b-form @submit="onSubmit">
      <b-container fluid>
        <b-row class="form-group form-row">
          <b-form-group
            id="barcode_input_group"
            label="Barcode:"
            label-for="barcode_input"
            description="Scan the barcode you wish to create labels for."
          >
            <b-form-input
              id="barcode_input"
              placeholder="Scan barcode"
              required
            ></b-form-input>
          </b-form-group>
        </b-row>
        <b-row class="form-group form-row">
          <b-form-select v-model="selected_suffix" :options="suffix_options" required></b-form-select>
        </b-row>
        <b-row class="form-group form-row">
          <b-form-select v-model="selected_number_of_labels_to_print" :options="number_of_suffixes_options" required></b-form-select>
        </b-row>
        <b-row class="form-group form-row">
          <b-form-select v-model="selected_printer" :options="printer_options" required></b-form-select>
        </b-row>

        <b-row class="form-group form-row">
          <b-button type="submit" variant="primary">Print</b-button>
        </b-row>
      </b-container>
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
        number_of_suffixes_options: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
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
