import { handleResponse } from '@/api/v1/ResponseHelper'
/*
  UPDATE
*/

const createQcResultsUploadResource = async (request, { csv, usedBySelected }) => {
  const { success, data, errors } = await handleResponse(
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

  if (success) {
    return data
  } else {
    throw errors
  }
}
export { createQcResultsUploadResource }
