import { handleResponse } from '@/api/ResponseHelper'
/*
  UPDATE
*/

const createQcResultsUploadResource = async (request, { csv, usedBySelected }) => {
  const { success, data, errors } = await handleResponse(
    // Why extra data {} needed ?
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
    // Currently `errors` doesn't include detail from service (todo)
    throw errors
    // throw data.errors[0].meta.exception
  }
}
export { createQcResultsUploadResource }
