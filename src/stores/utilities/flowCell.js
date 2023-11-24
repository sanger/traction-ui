import store from '@/store'
/**
 * enum for flowcell state
 * Success - if both flowcellId and barcode fields contain valid values
 * Failure - if any of flowcellId and barcode fields contain invalid values
 * Warning - if one of flowcellId and barcode fields are valid and other is empty
 * None - if both flowcellId and barcode fields are empty
 */
const FlowCellStateEnum = {
  Success: 'Success',
  Failure: 'Failure',
  Warning: 'Warning',
  None: 'None',
}

const FieldStatusEnum = {
  Valid: 'Valid',
  Invalid: 'Invalid',
  Empty: 'Empty',
}

const flowCellType = {
  type: 'FlowCell',
  position: '',
  flowcell_id: '',
  tube_barcode: '',
  /**
   * This function validates the flowcell_id field of a flowcell object
   * @returns {Object}
   * status - status of flowcell_id of type FieldStatusEnum
   * idError - error message if flowcell_id is invalid, empty string otherwise
   */
  validateFlowCellId() {
    //Check if flowcell_id is empty,null or undefined
    const containText = !!this.flowcell_id
    let error = ''
    let status = containText ? FieldStatusEnum.Valid : FieldStatusEnum.Empty
    //If flowcell_id is not empty, check if it contains a valid string
    if (containText && !this.flowcell_id.match(/^[a-zA-Z]{3}[0-9]{3,}$/)) {
      status = FieldStatusEnum.Invalid
      error = 'Enter a valid Flowcell ID (3 letters then at least 3 numbers)'
    }
    return { status, error }
  },

  /**
   * This function validates the tube_barcode field of a flowcell object
   * @returns {Object}
   * status - status of tube_barcode of type FieldStatusEnum
   * barcodeError - error message if tube_barcode is invalid, empty string otherwise
   */

  async validateBarcode() {
    const containText = !!this.tube_barcode
    let error = ''
    let status = containText ? FieldStatusEnum.Valid : FieldStatusEnum.Empty
    if (containText) {
      const response = await store.dispatch(
        'traction/ont/pools/validatePoolBarcode',
        this.tube_barcode,
      )
      if (response.success) {
        status = FieldStatusEnum.Valid
      } else {
        status = FieldStatusEnum.Invalid
        error = 'Enter a valid Pool Library barcode'
      }
    }
    return { status, error }
  },

  /**
   * This function validates the flowcell object
   * @param {*}
   * validateFlowCellId - boolean to indicate if flowcell_id field should be validated
   * validateBarcode - boolean to indicate if tube_barcode field should be validated
   * validationResult - object containing the status and error of the flowcell_id and tube_barcode fields
   * @returns
   * state - state of FlowCell of type FlowCellStateEnum
   * statusId - status of flowcell_id field of type FieldStatusEnum
   * errorId - error message of flowcell_id field
   * statusBarcode - status of tube_barcode field of type FieldStatusEnum
   * errorBarcode - error message of tube_barcode field
   */
  async validateFlowCell(validateFlowCellId = false, validateBarcode = false, flowCellState) {
    //Fill initial state if given
    let statusBarcode = flowCellState ? flowCellState.statusBarcode : FieldStatusEnum.Empty
    let errorBarcode = flowCellState ? flowCellState.errorBarcode : ''
    let statusId = flowCellState ? flowCellState.statusId : FieldStatusEnum.Empty
    let errorId = flowCellState ? flowCellState.errorId : ''

    //Validate flowcell_id and tube_barcode fields if required
    if (validateBarcode) {
      const result = await this.validateBarcode(validateBarcode)
      statusBarcode = result.status
      errorBarcode = result.error
    }
    if (validateFlowCellId) {
      const result = this.validateFlowCellId()
      statusId = result.status
      errorId = result.error
    }

    //Determine the state of the flowcell
    const retValue = { statusId, statusBarcode, errorId, errorBarcode }
    //If either flowcell_id or tube_barcode is valid, and the other field is empty then the state is Warning
    if (
      (statusBarcode === FieldStatusEnum.Empty && statusId === FieldStatusEnum.Valid) ||
      (statusBarcode === FieldStatusEnum.Valid && statusId === FieldStatusEnum.Empty)
    ) {
      return { ...retValue, state: FlowCellStateEnum.Warning }
    }
    //If either flowcell_id or tube_barcode is invalid, then the state is Failure
    if (errorId.length > 0 || errorBarcode.length > 0) {
      return { ...retValue, state: FlowCellStateEnum.Failure }
    }
    //If both flowcell_id and tube_barcode are empty, then the state is None
    if (statusBarcode === FieldStatusEnum.Empty && statusId === FieldStatusEnum.Empty) {
      return { ...retValue, state: FlowCellStateEnum.None }
    }
    //If both flowcell_id and tube_barcode are valid, then the state is Success
    return { ...retValue, state: FlowCellStateEnum.Success }
  },
}

export { FlowCellStateEnum, FieldStatusEnum, flowCellType }
