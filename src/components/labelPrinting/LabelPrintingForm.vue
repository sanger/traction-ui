<template>
  <div class="w-3/5 mx-auto">
    <div class="w-full mt-4 w-100 gap-4 space-x-4 bg-gray-100 rounded-md">
      <traction-form v-if="show" classes="flex flex-row" @submit="printLabels" @reset="onReset">
        <div class="w-full space-x-4 space-y-10 p-10">
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

          <DataFetcher :fetcher="fetchPrinters">
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
          </DataFetcher>
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
import BarcodeIcon from '@/icons/BarcodeIcon.vue'
import { nextTick } from 'vue'
import { usePrintingStore } from '@/stores/printing.js'
import { mapActions, mapState } from 'pinia'
import DataFetcher from '@/components/DataFetcher.vue'

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
    DataFetcher,
  },
  data() {
    return {
      form: defaultForm(),
      show: true,
    }
  },
  computed: {
    ...mapState(usePrintingStore, ['printers']),
    printerOptions() {
      return this.printers('tube').map(({ name }) => ({
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
    ...mapActions(usePrintingStore, ['createPrintJob', 'fetchPrinters']),
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
  },
}
</script>
