<template>
  <div class="w-3/5 mx-auto">
    <div class="w-full mt-4 w-100 gap-4 space-x-4 bg-gray-100 rounded-md">
      <traction-form
        v-if="show"
        class="text-left flex flex-row"
        @submit="printLabels"
        @reset="onReset"
      >
        <div
          variants="variants.fadeInParent"
          initial="hidden"
          animate="visible"
          exit="hidden"
          class="w-full space-x-4 space-y-10 p-10"
        >
          <traction-form-group id="barcode-input-group" label-for="barcode-input">
            <traction-heading level="3" show-border>Barcodes</traction-heading>
            <traction-muted-text>A list of barcodes to create labels for</traction-muted-text>
            <div class="mt-2">
              <traction-textarea
                id="barcode-input"
                v-model="form.sourceBarcodeList"
                placeholder="Please scan the barcodes"
                required
                rows="6"
                max-rows="10"
              />
            </div>
          </traction-form-group>

          <traction-form-group id="suffix-selection-group" label-for="suffix-selection">
            <traction-heading level="3" show-border>Suffix</traction-heading>
            <traction-muted-text>The suffix used to increment the barcode</traction-muted-text>
            <div class="mt-2">
              <traction-select
                id="suffix-selection"
                v-model="form.suffix"
                :options="suffixOptions"
                placeholder="Please select a suffix"
              ></traction-select>
            </div>
          </traction-form-group>

          <traction-form-group id="number-of-labels-group" label-for="number-of-labels">
            <traction-heading level="3" show-border>Number of labels</traction-heading>
            <traction-muted-text>Number of labels to print (max 80)</traction-muted-text>
            <div class="mt-2">
              <traction-input
                id="number-of-labels"
                v-model="form.numberOfLabels"
                type="number"
                min="1"
                max="80"
                placeholder="Please enter a number"
              ></traction-input>
            </div>
          </traction-form-group>

          <traction-form-group id="printer-choice-group" label-for="printer-choice">
            <traction-heading level="3" show-border>Choice of Printer</traction-heading>
            <traction-muted-text>The printer to print the labels</traction-muted-text>
            <div class="mt-2">
              <traction-select
                id="printer-choice"
                v-model="form.printerName"
                :options="printerOptions"
                value-field="text"
                required
              ></traction-select>
            </div>
          </traction-form-group>
        </div>
        <div class="w-1/2 m-4 p-3 border-t-4 border-sp rounded-md space-y-4 bg-sdb-400">
          <traction-heading level="3" class-name="text-white italic" show-border>
            Barcodes to be printed
          </traction-heading>
          <div>
            <div class="space-x-4 pb-4 flex flex-row">
              <traction-button id="submit-button" class="grow" type="submit" theme="printRed"
                >Print Labels</traction-button
              >
              <traction-button id="reset-button" type="reset" theme="resetWhite"
                >Reset</traction-button
              >
            </div>
            <traction-card tag="article" class="mb-2 text-black text-left">
              <traction-card-text>
                <ul id="list-barcodes-to-print">
                  <li v-for="{ barcode } in labels" :key="barcode" class="text-sm">
                    {{ barcode }}
                  </li>
                </ul>
              </traction-card-text>
            </traction-card>
          </div>
        </div>
      </traction-form>
    </div>
  </div>
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
