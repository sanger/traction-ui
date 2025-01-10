/**
 * Creates a request payload for PacBio requests.
 *
 * @param {Object} request - The request object.
 * @param {string} request.id - The ID of the request.
 * @param {string} request.library_type - The type of library.
 * @param {number} request.estimate_of_gb_required - The estimated gigabytes required.
 * @param {number} request.number_of_smrt_cells - The number of SMRT cells.
 * @param {string} request.cost_code - The cost code.
 * @returns {Object} The formatted request payload.
 *
 * @example
 * const request = {
 *   id: '123',
 *   library_type: 'Type A',
 *   estimate_of_gb_required: 10,
 *   number_of_smrt_cells: 2,
 *   cost_code: 'CC123'
 * }
 * const payload = createRequestPayload(request)
 * console.log(payload)
 * // {
 * //   data: {
 * //     id: '123',
 * //     type: 'requests',
 * //     attributes: {
 * //       library_type: 'Type A',
 * //       estimate_of_gb_required: 10,
 * //       number_of_smrt_cells: 2,
 * //       cost_code: 'CC123',
 * //     },
 * //   },
 * // }
 */

const createRequestPayload = ({
  id,
  library_type,
  estimate_of_gb_required,
  number_of_smrt_cells,
  cost_code,
}) => {
  return {
    data: {
      id,
      type: 'requests',
      attributes: {
        library_type,
        estimate_of_gb_required,
        number_of_smrt_cells,
        cost_code,
      },
    },
  }
}

export { createRequestPayload }
