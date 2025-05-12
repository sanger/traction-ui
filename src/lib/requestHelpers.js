import { locationBuilder } from '@/services/labwhere/helpers.js'
import { humanise } from '@/lib/stringHumanisation'

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
