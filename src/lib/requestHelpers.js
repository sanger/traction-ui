import { locationBuilder } from '@/services/labwhere/helpers.js'
import { humanise } from '@/lib/stringHumanisation'

/**
 * Formats an array of request objects and associates them with labware locations.
 *
 * @param {Array<Object>} requests - An array of request objects. Each object may contain a `sample_retention_instruction` field.
 * @param {Object} labwareLocation - An object representing the labware location data to be associated with the formatted requests.
 * @returns {Array<Object>} - A new array of formatted request objects with labware location data applied.
 *
 * @example
 * import { formatRequests } from '@/lib/requestHelpers';
 *
 * const requests = [
 *   { id: 1, sample_retention_instruction: 'destroy_after_two_years' },
 *   { id: 2 }
 * ];
 *
 * const labwareLocation = { id:1, location: 'Freezer A' };
 *
 * const formattedRequests = formatRequests(requests, labwareLocation);
 *
 * console.log(formattedRequests);
 * // [
 * //   {
 * //     id: 1,
 * //     sample_retention_instruction: 'Destroy after two years',
 * //     location: 'Freezer A'
 * //   },
 * //   {
 * //     id: 2,
 * //     sample_retention_instruction: '-',
 * //     location: 'Freezer A'
 * //   }
 * // ]
 */
const formatRequests = (requests, labwareLocation) => {
  const formattedRequestsArray = requests.map((request) => {
    return {
      ...request,
      sample_retention_instruction: request.sample_retention_instruction
        ? humanise(request.sample_retention_instruction)
        : '-',
    }
  })
  return locationBuilder(formattedRequestsArray, labwareLocation)
}

export { formatRequests }
