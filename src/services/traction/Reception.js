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

  console.log(attributes)

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
export { createReceptionResource }
