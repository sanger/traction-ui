import { defineStore } from 'pinia'
import { handleResponse } from '@/api/v2/ResponseHelper'
import { dataToObjectById } from '@/api/JsonApi'
import useRootStore from '@/stores'

export const usePrintingStore = defineStore('printing', {
  state: () => ({
    resources: {
      printers: {},
    },
    tubeLabelTemplateName: import.meta.env.VITE_TUBE_LABEL_TEMPLATE_NAME,
  }),
  actions: {
    /**
     * Creates a print job in PrintMyBarcode
     * @param rootState the vuex rootState object. Provides access to current state
     * @param state Provides access to local state
     * @param {String} printerName The name of the printer to send the print job to
     * @param {Array} labels Should be of a standard structure. See relevant components.
     * @param {Integer} copies Number of copies of labels
     * @returns {Object {success: Boolean, message: String}} Is the print job successful? With a success or failure message
     **/
    async createPrintJob({ printerName, labels, copies }) {
      const rootStore = useRootStore()

      // extract the request from the rootState
      const request = rootStore.api.printMyBarcode.print_jobs

      const payload = {
        printer_name: printerName,
        label_template_name: this.tubeLabelTemplateName,
        labels,
        copies,
      }

      const promise = request.create({ data: payload })

      const response = await handleResponse(promise)

      const {
        success,
        body: { data = {} },
        errors,
      } = response

      // we need to create a final message
      const message = success
        ? // if it was success just send a simple message
          'Barcode(s) successfully printed'
        : // print my barcode does not return the errors in the correct format
          // so we need to extract the errors and turn them into something meaningful
          data?.errors?.length > 0
          ? data.errors.map((e) => e.source.pointer + ' ' + e.detail).join(', ')
          : // otherwise we can just return the errors
            errors

      return { success, message }
    },

    /**
     * fetches the list of printers from traction
     * @returns {Object {success: Boolean, data: Object, errors: Array}} Is the fetch successful? The data and any errors
     */
    async fetchPrinters() {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.printers
      const promise = request.get({})
      const response = await handleResponse(promise)

      const {
        success,
        body: { data },
        errors = [],
      } = response

      if (success) {
        // populate printers in store
        this.resources.printers = dataToObjectById({ data })
      }
      return { success, data, errors }
    },
  },
})
