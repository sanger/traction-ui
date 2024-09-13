import { defineStore } from 'pinia'
import { handleResponse, parsePrintMyBarcodeErrors } from '@/api/v2/ResponseHelper'
import { includesRelationshipAttributes, dataToObjectById } from '@/api/JsonApi'
import useRootStore from '@/stores'

export const usePrintingStore = defineStore('printing', {
  state: () => ({
    resources: {
      workflows: [],
      printers: {},
    },
  }),
  getters: {
    /**
     *
     * @param {Object} state
     * @param {String} labwareType the type of labware to filter printers by
     * @returns {Array} Array of printers that match the labwareType
     */
    printers: (state) => (labwareType) => {
      const printerValues = Object.values(state.resources.printers)
      if (labwareType) {
        return printerValues.filter((printer) => printer.labware_type === labwareType)
      }
      return printerValues
    },
    /**
     *
     * @param {Object} resources
     * @returns {Array} Array of workflows
     */
    workflows: ({ resources }) => {
      return resources.workflows
    },
  },
  actions: {
    /**
     * Creates a print job in PrintMyBarcode
     * @param rootState the vuex rootState object. Provides access to current state
     * @param {String} printerName The name of the printer to send the print job to
     * @param {Array} labels Should be of a standard structure. See relevant components.
     * @param {Integer} copies Number of copies of labels
     * @returns {Object}  {success: Boolean, message: String}} Is the print job successful? With a success or failure message
     * we should probably move this to the PrintJobType. Need to work out how to make payload reactive.
     **/
    async createPrintJob({
      printerName,
      labels,
      copies,
      labelTemplateName = 'traction_tube_label_template',
    }) {
      const rootStore = useRootStore()

      const request = rootStore.api.v2.printMyBarcode.print_jobs

      const payload = {
        printer_name: printerName,
        label_template_name: labelTemplateName,
        labels,
        copies,
      }

      const promise = request.create({ data: payload })

      const response = await handleResponse(promise, parsePrintMyBarcodeErrors)

      const { success, errors } = response

      // we need to create a final message
      const message = success
        ? // if it was success just send a simple message
          'Barcode(s) successfully printed'
        : errors
      return { success, message }
    },

    /**
     * fetches the list of printers from traction
     * @returns {Object}  {success: Boolean, data: Object, errors: Array}} Is the fetch successful? The data and any errors
     */
    async fetchPrinters() {
      const rootStore = useRootStore()

      const request = rootStore.api.v2.traction.printers

      const promise = request.get()
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

    /**
     * fetches the list of workflows from traction
     * @returns {Object}  {success: Boolean, data: Object, errors: Array} Is the fetch successful? The data and any errors
     */
    async fetchWorkflows() {
      const rootStore = useRootStore()
      const request = rootStore.api.v2.traction.workflows
      const response = await handleResponse(request.get({ include: 'workflow_steps' }))
      const { success, body } = response
      if (success) {
        this.resources.workflows = includesRelationshipAttributes(body)
      }
      return response
    },
  },
})
