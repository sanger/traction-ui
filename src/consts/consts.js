/*
  Store constants here which can be used throughout the app.
*/
const PIPELINE_SAPHYR = 'saphyr'
const PIPELINE_PACBIO = 'pacbio'
const PIPELINE_ONT = 'ont'

const MAT_TYPE_REQUESTS = 'requests'
const MAT_TYPE_LIBRARIES = 'libraries'

const MESSAGE_ERROR_GET_TRACTION_TUBES = 'Failed to get Traction tubes'
const MESSAGE_ERROR_SINGLE_TYPE = 'Please only scan sample or library barcodes, not both'
const MESSAGE_ERROR_INVALID_BARCODES = 'The following barcodes are invalid: '
const MESSAGE_ERROR_DELETION_FAILED = 'Failed to delete: '
const MESSAGE_ERROR_FIND_TAGS_FAILED = 'Failed to find tags in Traction'
const MESSAGE_ERROR_CREATE_LIBRARY_FAILED = 'Failed to create library in Traction: '
const MESSAGE_ERROR_CREATE_RUN_FAILED = 'Failed to create run in Traction: '
const MESSAGE_ERROR_INTERNAL = 'Internal error - please contact support'

const MESSAGE_WARNING_NO_BARCODES = 'There are no barcodes'

const MESSAGE_SUCCESS_PRINTER = 'Printed successfully'

export {
  PIPELINE_SAPHYR,
  PIPELINE_PACBIO,
  PIPELINE_ONT,
  MAT_TYPE_REQUESTS,
  MAT_TYPE_LIBRARIES,
  MESSAGE_ERROR_GET_TRACTION_TUBES,
  MESSAGE_ERROR_SINGLE_TYPE,
  MESSAGE_ERROR_INVALID_BARCODES,
  MESSAGE_ERROR_DELETION_FAILED,
  MESSAGE_ERROR_FIND_TAGS_FAILED,
  MESSAGE_ERROR_CREATE_LIBRARY_FAILED,
  MESSAGE_ERROR_INTERNAL,
  MESSAGE_WARNING_NO_BARCODES,
  MESSAGE_SUCCESS_PRINTER,
  MESSAGE_ERROR_CREATE_RUN_FAILED
}
