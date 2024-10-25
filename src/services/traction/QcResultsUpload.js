import { handleResponse } from '@/api/v2/ResponseHelper'

/**
 * Creates a QC results upload resource.
 *
 * @param {Function} request - The request function to be called.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.csv - The CSV data to be uploaded.
 * @param {boolean} params.usedBySelected - Indicates if the resource is used by the selected entity.
 * @returns {Promise<Object>} The data from the response if successful.
 * @throws {Object} The errors from the response if unsuccessful.
 */
const createQcResultsUploadResource = async (request, { csv, usedBySelected }) => {
  const {
    success,
    body: { data = {} },
    errors = [],
  } = await handleResponse(
    request({
      data: {
        data: {
          type: 'qc_results_uploads',
          attributes: {
            csv_data: csv,
            used_by: usedBySelected,
          },
        },
      },
    }),
  )

  return { success, data, errors }
}
export { createQcResultsUploadResource }
