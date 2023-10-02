import { handleResponse } from '@/api/ResponseHelper'
/**
 * Generates a reception resource in traction
 * @param request: {Function} Function to make a request to the Traction
 * receptions controller
 * @param source: {string} The source from which the samples were imported.
 * Usually prefixed with traction-ui to disambiguate from any potential direct import
 * @param attributes: {Array} Array of request attribute objects to create
 */
const createReceptionResource = async (request, labwareCount, attributes) => {
  if (labwareCount < 1) {
    throw 'No labware to import'
  }

  const { success, data, errors } = await handleResponse(
    request({
      data: {
        data: { type: 'receptions', attributes },
      },
    }),
  )

  if (success) {
    return data
  } else {
    throw errors
  }
}

/**
 * Generates messages to display to the user after importing labware
 * @param barcodes: {Array} Array of barcodes that were imported
 * @param response: {Object} Response from the Traction
 * @param reception: {Object} Reception object
 * @returns {Array} Array of messages to display to the user
 */
const createMessages = ({ barcodes, response, reception }) => {
  const labwares = response.labwares

  // which barcodes have been found in the response
  const foundBarcodes = Object.keys(labwares)

  // generate messages for each barcode
  const messages = foundBarcodes.map((barcode) => {
    const labware = labwares[barcode]

    switch (labware.imported) {
      // if it was imported successfully add a success message
      case 'success':
        return {
          type: 'success',
          message: `${barcode} imported from ${reception.text}.`,
        }
      // if it was not imported successfully add a danger message
      case 'failure':
        return {
          type: 'danger',
          message: `${barcode} could not be imported from ${
            reception.text
          } because: ${labware.errors.join(', ')}.`,
        }
      // if it was partially imported add a danger message with the errors
      case 'partial':
        return {
          type: 'danger',
          message: `${barcode} imported from ${reception.text} with errors: ${labware.errors.join(
            ', ',
          )}.`,
        }
    }
  })

  // find any barcodes that were not found in the response
  const missingBarcodes = barcodes.filter((x) => !foundBarcodes.includes(x))

  // add a danger message for all missing barcode
  if (missingBarcodes.length > 0) {
    messages.push({
      type: 'danger',
      message: `${missingBarcodes.join(', ')} could not be found in ${reception.text}.`,
    })
  }

  return messages
}

export { createReceptionResource, createMessages }
