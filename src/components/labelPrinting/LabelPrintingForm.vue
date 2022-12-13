<template>
  <traction-container>
    <traction-row>
      <traction-col>
        <traction-form v-if="show" class="text-left" @submit="printLabels" @reset="onReset">
          <traction-form-group
            id="barcode-input-group"
            label="Barcodes:"
            label-for="barcode-input"
            description="A list of barcodes to create labels for."
          >
            <traction-textarea
              id="barcode-input"
              v-model="form.sourceBarcodeList"
              placeholder="Please scan the barcodes"
              required
              rows="6"
              max-rows="10"
            />
          </traction-form-group>

          <traction-form-group
            id="suffix-selection-group"
            label="Suffix:"
            label-for="suffix-selection"
            description="The suffix used to increment the barcode."
          >
            <traction-select
              id="suffix-selection"
              v-model="form.suffix"
              :options="suffixOptions"
              placeholder="Please select a suffix"
              value-field="text"
            ></traction-select>
          </traction-form-group>

          <traction-form-group
            id="number-of-labels-group"
            label="Number of labels:"
            label-for="number-of-labels"
            description="Number of labels to print (max 9)"
          >
            <traction-input
              id="number-of-labels"
              v-model="form.numberOfLabels"
              type="number"
              min="1"
              max="9"
              placeholder="Please enter a number"
            ></traction-input>
          </traction-form-group>

          <traction-form-group
            id="printer-choice-group"
            label="Choice of Printer:"
            label-for="printer-choice"
            description="The printer to print the labels."
          >
            <traction-select
              id="printer-choice"
              v-model="form.printerName"
              :options="printerOptions"
              value-field="text"
              required
            ></traction-select>
          </traction-form-group>

          <traction-button id="submit-button" type="submit" theme="print"
            >Print Labels</traction-button
          >
          <traction-button id="reset-button" type="reset" theme="default" class="float-left"
            >Reset</traction-button
          >
        </traction-form>
      </traction-col>
      <traction-col>
        <div>
          <traction-card
            title="List of barcodes to be printed:"
            tag="article"
            style="max-width: 20rem"
            class="mb-2"
          >
            <traction-card-text>
              <ul id="list-barcodes-to-print">
                <li v-for="{ barcode } in labels" :key="barcode">{{ barcode }}</li>
              </ul>
            </traction-card-text>
          </traction-card>
        </div>
      </traction-col>
    </traction-row>
  </traction-container>
</template>

<script>
import SuffixList from '@/config/SuffixList'
import {
  createSuffixDropdownOptions,
  createSuffixItems,
  createLabelsFromBarcodes,
} from '@/lib/LabelPrintingHelpers'
import { getCurrentDate } from '@/lib/DateHelpers'
import { mapActions } from 'vuex'

const defaultForm = () => ({
  sourceBarcodeList: null,
  suffix: null,
  numberOfLabels: null,
  printerName: null,
  copies: 1,
})

export default {
  name: 'LabelPrintingForm',
  data() {
    return {
      form: defaultForm(),
      show: true,
    }
  },
  computed: {
    printerOptions() {
      return this.$store.getters.printers.map((name) => ({
        text: name,
      }))
    },
    suffixOptions() {
      return createSuffixDropdownOptions(SuffixList)
    },
    suffixItems() {
      return createSuffixItems(SuffixList)
    },
    labels() {
      const date = getCurrentDate()
      const suffixItem = this.suffixItems[this.form.suffix]

      // it is possible for there to be no barcodes so we need to add a guard
      // we filter to remove an nulls
      const splitSourceBarcodeList =
        this.form.sourceBarcodeList?.split(/\r?\n|\r|\n/g).filter((b) => b) || []

      return createLabelsFromBarcodes({
        sourceBarcodeList: splitSourceBarcodeList,
        date,
        suffixItem,
        numberOfLabels: this.form.numberOfLabels,
      })
    },
  },
  methods: {
    /*
      Creates the print job and shows a success or failure alert
      @param {event}
    */
    async printLabels(event) {
      event.preventDefault()

      const { success, message = {} } = await this.createPrintJob({
        printerName: this.form.printerName,
        labels: this.labels,
        copies: this.form.copies,
      })

      this.showAlert(message, success ? 'success' : 'danger')

      return { success, message }
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
    ...mapActions('printMyBarcode', ['createPrintJob']),
  },
}
</script>
