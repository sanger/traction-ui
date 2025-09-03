/**
 * Creates a request payload for ONT requests.
 *
 * @param {Object} request - The request object.
 * @param {string|number} request.id - The ID of the request.
 * @param {string} request.library_type - The type of library.
 * @param {string} request.data_type - The type of data.
 * @param {string} request.cost_code - The cost code.
 * @param {string|number} request.external_study_id - The external study ID.
 * @param {number} request.number_of_flowcells - The number of flowcells.
 * @returns {Object} The formatted ONT request payload.
 *
 * @example
 * const request = {
 *   id: '123',
 *   library_type: 'Type A',
 *   data_type: 'Data X',
 *   cost_code: 'CC123',
 *   external_study_id: 'STUDY1',
 *   number_of_flowcells: 2,
 * }
 * const payload = createRequestPayload(request)
 * console.log(payload)
 * // {
 * //   data: {
 * //     id: '123',
 * //     type: 'requests',
 * //     attributes: {
 * //       library_type: 'Type A',
 * //       data_type: 'Data X',
 * //       cost_code: 'CC123',
 * //       external_study_id: 'STUDY1',
 * //       number_of_flowcells: 2,
 * //     },
 * //   },
 * // }
 */

const createRequestPayload = ({
  id,
  library_type,
  data_type,
  cost_code,
  external_study_id,
  number_of_flowcells,
}) => {
  return {
    data: {
      id,
      type: 'requests',
      attributes: {
        library_type,
        data_type,
        cost_code,
        external_study_id,
        number_of_flowcells,
      },
    },
  }
}

export { createRequestPayload }
