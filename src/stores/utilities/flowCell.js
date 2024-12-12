import { useOntRunsStore } from '@/stores/ontRuns.js'

/**
 * flowcell object type with following attributes and methods
 * @property {string} type - The type of the object
 * @property {string} position - The position of the flowcell
 * @property {string} flowcell_id - The flowcell id
 * @property {string} tube_barcode - The tube barcode
 * @property {Object} errors - An object containing key value pairs of errors
 * @method validateFlowCellId - function to validate the flowcell_id field
 * @method validateBarcode - function to validate the tube_barcode field
 */
function flowCellType() {
  return {
    type: 'FlowCell',
    position: '',
    flowcell_id: '',
    tube_barcode: '',
    errors: {},

    /**
     * @method validateFlowCellId
     * @description Validates the flowcell_id field
     * @returns {Boolean} - A boolean value indicating if the flowcell_id is valid
     */
    validateFlowcellId() {
      //If flowcell_id is not empty, check if it contains a valid string
      if (this.flowcell_id && !this.flowcell_id.match(/^[a-zA-Z]{3}[0-9]{3,}$/)) {
        this.errors['flowcell_id'] = 'Enter a valid Flowcell ID (3 letters then at least 3 numbers)'
        return false
      }

      delete this.errors['flowcell_id']
      return true
    },

    /**
     * @method validateBarcode
     * @description Validates the tube_barcode field
     * @returns {Boolean} - A boolean value indicating if the tube_barcode is valid
     */
    async validateBarcode() {
      // Here we want to make sure the barcode exists
      // If it doesn't, set success to null for component validation
      if (this.tube_barcode.trim() === '') {
        delete this.errors['tube_barcode']
        return true
      }

      const store = useOntRunsStore()
      const storeBarcode = Object.values(store.pools).find(
        (p) => store.tubes[p.tube].barcode == this.tube_barcode,
      )

      // We will be returned a successful empty list if no pools match the barcode
      // Therefore we want to return success false, if we don't have any pools
      if (!storeBarcode) {
        this.errors.tube_barcode = 'Pool not found with this barcode'
        return false
      }

      delete this.errors['tube_barcode']
      return true
    },
  }
}

export { flowCellType }
