import { handleResponse } from '@/api/ResponseHelper'
/*
  Generates a reception resource in traction
  @param request: {Function} Function to make a request to the taction
  receptions controller
  @param source: {string} The source from which the samples were imported.
  Usually prefixed with traction-ui to disambiguate from any potential direct import
  @param requestAttributes: {Array} Array of request attribute objects to create
*/
const createReception = async (request, { source, requestAttributes }) => {
  if (requestAttributes.length < 1) {
    throw 'No labware to import'
  }

  const { success, data, errors } = await handleResponse(
    request({ data: { data: { attributes: { source, requestAttributes } } } }),
  )

  if (success) {
    return data
  } else {
    throw errors
  }
}
export { createReception }
