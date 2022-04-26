<template>
  <div>
    <b-form v-if="show" @reset="onReset">
      <b-form-group
          id="barcode_input_group"
          label="Barcode:"
          label-for="barcode_input"
          description="Please scan the barcode you wish to create labels for."
        >
        <b-form-input id="barcode_input" v-model="form.barcode" placeholder="Please scan the barcode" required></b-form-input>
      </b-form-group>

      <b-form-group
          id="suffix_selection_group"
          label="Suffix:"
          label-for="suffix_selection"
          description="Please select the suffix you want to use from the list."
        >
        <b-form-select
          id="suffix_selection"
          v-model="form.selected_suffix"
          :options="suffix_options"
          placeholder="Please select a suffix"
          required>
        </b-form-select>
      </b-form-group>

      <b-form-group
          id="number_of_labels_group"
          label="Number of labels:"
          label-for="number_of_labels"
          description="Please enter the number of labels to make (with incrementing suffixes)."
        >
        <b-form-input
          id="number_of_labels_input"
          v-model="form.selected_number_of_labels"
          type="number" min="1" max="9"
          placeholder="Please enter a number"
          required>
        </b-form-input>
      </b-form-group>

      <b-form-group
          id="printer_choice_group"
          label="Choice of Printer:"
          label-for="printer_choice"
          description="Please select which printer you wish to use to print the labels."
        >
        <b-form-select
          id="printer_of_choice_input"
          v-model="form.selected_printer"
          :options="printer_options"
          placeholder="Please select a printer"
          required>
        </b-form-select>
      </b-form-group>

      <b-button type="reset" variant="danger" class="float-left">Reset</b-button>
      <labelPrintingModal
          ref="labelPrintingModal"
          class="float-right"
          :disabled="suffixedBarcodes.length === 0"
          @listBarcodes="suffixedBarcodes"
      >
      </labelPrintingModal>
    </b-form>

  </div>
</template>

<script>
  import LabelPrintingModal from '@/components/label_printing/LabelPrintingModal'

  export default {
    name: "LabelPrintingForm",
    components: {
      LabelPrintingModal,
    },
    data() {
      return {
        form: {
          barcode: null,
          selected_suffix: null,
          selected_number_of_labels: null,
          selected_printer: null,
        },
        suffix_options: [{ text: 'Please select a suffix', value: null }, 'AA', 'BB'],
        printer_options: [{ text: 'Please select a printer', value: null }, 'ab1234', 'cd5678'],
        show: true
      }
    },
    computed: {
      suffixedBarcodes() {
        if(this.form.barcode === null || this.form.selected_suffix === null || this.form.selected_number_of_labels === null) {
          return []
        }
        var listSuffixedBarcodes = []
        for (let i = 0; i < this.form.selected_number_of_labels; i++) {
          listSuffixedBarcodes.push(this.form.barcode.concat("-", this.form.selected_suffix, (i + 1)))
        }
        alert(JSON.stringify(listSuffixedBarcodes))
        return listSuffixedBarcodes
      },
    },
    methods: {
      // onSubmit(event) {
      //   event.preventDefault()
      //   alert(JSON.stringify(this.suffixedBarcodes))
      //   alert(JSON.stringify(this.form))
      // },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.barcode = null
        this.form.selected_suffix = null
        this.form.selected_number_of_labels = null
        this.form.selected_printer = null
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>