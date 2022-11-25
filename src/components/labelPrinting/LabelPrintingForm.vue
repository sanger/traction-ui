<template>
  <traction-container>
    <traction-row>
      <traction-col>
        <traction-form v-if="show" class="text-left" @submit="onSubmit" @reset="onReset">
          <traction-form-group
            id="barcode-input-group"
            label="Barcodes:"
            label-for="barcode-input"
            description="A list of barcodes to create labels for."
          >
            <traction-textarea
              id="barcode-input"
              v-model="form.barcode"
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
              v-model="form.selectedSuffix"
              :options="suffixOptions"
              value-field="text"
              placeholder="Please select a suffix"
              required
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
              v-model="form.selectedNumberOfLabels"
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
              v-model="form.selectedPrinterName"
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
                <li v-for="(item, index) in suffixedBarcodes()" :key="index + 1">{{ item }}</li>
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
import { mapActions } from 'vuex'

const defaultForm = () => ({
  barcode: null,
  selectedSuffix: null,
  selectedNumberOfLabels: null,
  selectedPrinterName: null,
  copies: '1',
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
      return SuffixList.map((item) => ({
        label: item.workflow,
        options: item.options.map((option) => ({
          text: option.suffix.concat(' - ', option.stage),
        })),
      })).concat([{ text: 'No suffix' }])
    },
  },
  methods: {
    suffixedBarcodes() {
      let listSuffixedBarcodes = []
      let noOfLabels = this.form.selectedNumberOfLabels
      let applyLabels = noOfLabels > 1 && noOfLabels <= 9

      //Append the four letter suffix and/or the label number, if given to the barcodes
      if (this.form.barcode && this.form.selectedSuffix) {
        let barcodes = this.form.barcode.split(/\r?\n|\r|\n/g)
        switch (true) {
          case this.suffix() && applyLabels:
            //Add both suffix and label number to the barcodes to be printed
            listSuffixedBarcodes = this.appendSuffixWithLabels(
              barcodes,
              listSuffixedBarcodes,
              noOfLabels,
            )
            break
          case this.suffix() && !applyLabels:
            //Add only suffix to the barcodes to be printed
            listSuffixedBarcodes = this.appendSuffix(barcodes, listSuffixedBarcodes)
            break
          case applyLabels && !this.suffix():
            //Add only label number to the barcodes to be printed
            listSuffixedBarcodes = this.appendLabels(barcodes, listSuffixedBarcodes, noOfLabels)
            break
          case !applyLabels && !this.suffix():
            //Just the plain barcodes list to be printed
            for (let barcode of barcodes) {
              listSuffixedBarcodes.push(barcode)
            }
            break
        }
      }
      return listSuffixedBarcodes
    },
    appendSuffix(barcodes, listSuffixedBarcodes) {
      for (let barcode of barcodes) {
        listSuffixedBarcodes.push(barcode.concat('-', this.suffix()))
      }
      return listSuffixedBarcodes
    },
    appendLabels(barcodes, listSuffixedBarcodes, noOfLabels) {
      for (let barcode of barcodes) {
        for (let i = 0; i < noOfLabels; i++) {
          listSuffixedBarcodes.push(barcode.concat('-', i + 1))
        }
      }
      return listSuffixedBarcodes
    },
    appendSuffixWithLabels(barcodes, listSuffixedBarcodes, noOfLabels) {
      for (let barcode of barcodes) {
        for (let i = 0; i < noOfLabels; i++) {
          listSuffixedBarcodes.push(barcode.concat('-', this.suffix(), '-', i + 1))
        }
      }
      return listSuffixedBarcodes
    },
    suffix() {
      return this.form.selectedSuffix === 'No suffix' ? '' : this.form.selectedSuffix.slice(0, 4)
    },
    printerName() {
      return this.form.selectedPrinterName
    },
    onSubmit(event) {
      event.preventDefault()
      this.sendPrintRequest()
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
    async sendPrintRequest() {
      const params = {
        printerName: this.printerName(),
        barcodesList: this.suffixedBarcodes(),
        copies: this.form.copies,
        suffix: this.suffix(),
      }
      const printJobResponse = await this.printJob(params)
      this.showAlert(printJobResponse.data.message, printJobResponse.success ? 'success' : 'danger')
    },
    ...mapActions('printMyBarcode', ['printJob']),
  },
}
</script>
