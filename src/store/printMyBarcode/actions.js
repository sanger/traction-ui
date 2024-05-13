import { handleResponse } from '@/api/v1/ResponseHelper'

/*
  TODO. The only action we have is createPrintJob
  Question: Do we need this in the store at all?
  The action does not relate to the store so is maybe better as a service.
*/

/**
 * Creates a print job in PrintMyBarcode
 * @param rootState the vuex rootState object. Provides access to current state
 * @param state Provides access to local state
 * @param {String} printerName The name of the printer to send the print job to
 * @param {Array} labels Should be of a standard structure. See relevant components.
 * @param {Integer} copies Number of copies of labels
 * @returns {Object {success: Boolean, message: String}} Is the print job successful? With a success or failure message
 **/
const createPrintJob = async (
  { rootState, state: { tubeLabelTemplateName } },
  { printerName, labels, copies },
) => {
  // extract the request from the rootState
  const request = rootState.api.printMyBarcode.print_jobs

  const payload = {
    printer_name: printerName,
    label_template_name: tubeLabelTemplateName,
    labels,
    copies,
  }

  const promise = request.create({ data: payload })

  const response = await handleResponse(promise)

  const { success, data, errors } = response

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
}

const actions = {
  createPrintJob,
}

export default actions
