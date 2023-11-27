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

/**
 * enum for field status in flowcell object
 * Valid - if field contains valid value
 * Invalid - if field contains invalid value
 * Empty - if field is empty
 */
const FieldStatusEnum = {
  Valid: 'Valid',
  Invalid: 'Invalid',
  Empty: 'Empty',
}

/**
 * flowcell object type with following attributes and methods
 * @property {string} type - The type of the object
 * @property {string} position - The position of the flowcell
 * @property {string} flowcell_id - The flowcell id
 * @property {string} tube_barcode - The tube barcode
 * @method validateFlowCellId - function to validate the flowcell_id field
 * @method validateBarcode - function to validate the tube_barcode field
 * @method validateFlowCell - function to validate the flowcell object
 */
const flowCellType = {
  type: 'FlowCell',
  position: '',
  flowcell_id: '',
  tube_barcode: '',

  /**
   * @method validateFlowCellId
   * @description Validates the flowcell_id field
   * @returns {Object} - An object containing the following properties:
   * @property {FieldStatusEnum} status - The status of flowcell_id which can be Valid, Invalid or Empty
   * @property {string} error - The error message if flowcell_id is invalid, empty string otherwise
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
    //Return the status and error
    return { status, error }
  },

  /**
   * @method validateBarcode
   * @description Validates the tube_barcode field
   * @returns {Object} - An object containing the following properties:
   * @property {FieldStatusEnum} status - The status of tube_barcode which can be Valid, Invalid or Empty
   * @property {string} error - The error message if tube_barcode is invalid, empty string otherwise
   */
  async validateBarcode() {
    //Check if tube_barcode is empty,null or undefined
    const containText = !!this.tube_barcode
    let error = ''
    //Initilise status to Empty or Valid based on whether tube_barcode is empty or not
    let status = containText ? FieldStatusEnum.Valid : FieldStatusEnum.Empty
    //If tube_barcode is not empty, check if the given barcode is valid
    if (containText) {
      //Validate the barcode using the validatePoolBarcode action
      //TODO: This need to be refactored to use the Pinia once ont/pools is migrated
      const response = await store.dispatch(
        'traction/ont/pools/validatePoolBarcode',
        this.tube_barcode,
      )
      //If the barcode is valid, then set status to Valid, otherwise set status to Invalid and set error message
      if (response.success) {
        status = FieldStatusEnum.Valid
      } else {
        status = FieldStatusEnum.Invalid
        error = 'Enter a valid Pool Library barcode'
      }
    }
    //Return the status and error
    return { status, error }
  },

  /**
   * @method validateBarcode
   * @description Validates the flowcell object
   * @param {boolean} validateFlowCellId - boolean to indicate if flowcell_id field should be validated
   * @param {boolean} validateBarcode - boolean to indicate if tube_barcode field should be validated
   * @param {Object} flowCellState - object  containing the status and error of the flowcell_id and tube_barcode fields
   *                 of type {statusId:FieldStatusEnum, errorId:string, statusBarcode:FieldStatusEnum, errorBarcode:string}
   *                 if this parameter is given, then the function will use the status and error of the flowcell_id and tube_barcode fields as initial state
   * @returns {Object} having following properties:
   * @property {FlowCellStateEnum} state - The state of FlowCell
   * @property {FieldStatusEnum} statusId - The status of flowcell_id field
   * @property {string} errorId - The error message of flowcell_id field
   * @property {FieldStatusEnum} statusBarcode - The status of tube_barcode field
   * @property {string} errorBarcode - The error message of tube_barcode field
   */
  async validateFlowCell(validateFlowCellId = false, validateBarcode = false, flowCellState) {
    //Fill initial values if flowCellState given
    let statusBarcode = flowCellState ? flowCellState.statusBarcode : FieldStatusEnum.Empty
    let errorBarcode = flowCellState ? flowCellState.errorBarcode : ''
    let statusId = flowCellState ? flowCellState.statusId : FieldStatusEnum.Empty
    let errorId = flowCellState ? flowCellState.errorId : ''

    //Validate tube_barcode field if required
    if (validateBarcode) {
      const result = await this.validateBarcode(validateBarcode)
      statusBarcode = result.status
      errorBarcode = result.error
    }
    //Validate flowcell_id field if required
    if (validateFlowCellId) {
      const result = this.validateFlowCellId()
      statusId = result.status
      errorId = result.error
    }
    //Create the return value object
    const retValue = { statusId, statusBarcode, errorId, errorBarcode }

    //Determine the state of the flowcell

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
