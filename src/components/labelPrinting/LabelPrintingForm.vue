<template>
  <div class="w-full md:w-3/4 mx-auto">
    <traction-form
      v-if="show"
      classes="flex flex-col md:flex-row px-10 gap-4"
      @submit="printLabels"
      @reset="onReset"
    >
      <div class="w-full md:w-3/5 p-4 gap-4 bg-gray-100 rounded-md">
        <div class="space-y-10">
          <fieldset>
            <BarcodeIcon class="float-left mr-2 mt-3" />
            <traction-heading level="3" show-border>Barcodes</traction-heading>
            <traction-muted-text>A list of barcodes to create labels for</traction-muted-text>
            <div class="mt-2">
              <textarea
                id="barcode-input"
                v-model="form.sourceBarcodeList"
                class="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:bg-gray-200 disabled:cursor-not-allowed"
                placeholder="Please scan the barcodes"
                required
                rows="6"
                max-rows="10"
              />
            </div>
          </fieldset>

          <fieldset>
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
          </fieldset>

          <fieldset>
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
          </fieldset>

          <fieldset>
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
          </fieldset>
        </div>
      </div>
      <div class="w-full md:w-2/5 p-4 space-y-4 bg-sdb-400 rounded-md border-t-4 border-sp">
        <traction-heading level="3" class-name="text-white italic" show-border>
          Preview Barcodes
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
          <div tag="article" class="mb-2 text-black text-left">
            <div class="flex flex-col bg-white rounded p-4">
              <ul id="list-barcodes-to-print">
                <li v-for="{ barcode } in labels" :key="barcode" class="text-sm">
                  {{ barcode }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </traction-form>
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
import BarcodeIcon from '@/icons/BarcodeIcon.vue'
import { nextTick } from 'vue'

const defaultForm = () => ({
  sourceBarcodeList: null,
  suffix: null,
  numberOfLabels: null,
  printerName: null,
  copies: 1,
})

export default {
  name: 'LabelPrintingForm',
  components: {
    BarcodeIcon,
  },
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
    async printLabels() {
      const { success, message = {} } = await this.createPrintJob({
        printerName: this.form.printerName,
        labels: this.labels,
        copies: this.form.copies,
      })

      this.showAlert(message, success ? 'success' : 'danger')

      return { success, message }
    },
    onReset() {
      // Reset our form values
      this.form = defaultForm()

      // Trick to reset/clear native browser form validation state
      this.show = false
      nextTick(() => {
        this.show = true
      })
    },
    ...mapActions('printMyBarcode', ['createPrintJob']),
  },
}
</script>
