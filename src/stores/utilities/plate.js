import { dataToObjectById, groupIncludedByResource } from '@/api/JsonApi'

/**
 *
 * @param {Object} plate - The plate object
 * @param {Object} wells - The wells object
 * @param {Object} requests - The requests object
 * @returns {Object} The plate object with wells and requests added
 */
const addWellsAndRequestsToPlate = (plate, wells, requests) => {
  return {
    ...plate,
    wells: plate.wells.map((id) => {
      const wellData = wells[id]
      return {
        ...wellData,
        requests: wellData.requests.map((id) => requests[id]),
      }
    }),
  }
}

/**
 * @param {Object} data - The data object - plate and included data
 * @returns {Object} The plate object with wells and requests added
 * Extracts the plate object from the data and adds the wells and requests to the plate
 */
const extractPlatefromData = (data) => {
  if (!data?.data?.[0]) {
    return {}
  }
  const plate = Object.values(dataToObjectById({ data: data.data, includeRelationships: true }))[0]
  const { wells, requests } = groupIncludedByResource(data.included)
  return addWellsAndRequestsToPlate(
    plate,
    dataToObjectById({ data: wells, includeRelationships: true }),
    dataToObjectById({ data: requests }),
  )
}

export { extractPlatefromData }
