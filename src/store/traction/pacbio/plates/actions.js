import handleResponse from '@/api/v2/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

const setPlates = async ({ commit, getters }, options) => {
  const request = getters.getPlates
  const promise = request.get({ ...options })
  const response = await handleResponse(promise)

  const {
    body: { data = {}, meta = {} },
    success,
    errors = {},
  } = response
  if (success) {
    commit('setPlates', data)
  }

  return { success, errors, meta }
}

const findPlate = async ({ getters }, filter) => {
  const request = getters.getPlates
  const promise = request.get({ filter, include: 'wells.requests' })
  const response = await handleResponse(promise)
  const {
    success,
    body: { data, included = [] },
  } = response
  const { wells, requests } = groupIncludedByResource(included)

  if (success && data.length) {
    const plate = data[0]
    return {
      id: plate.id,
      ...plate.attributes,
      // Map the wells to the plate
      wells: plate.relationships.wells.data?.map((well) => {
        const w = wells?.find((w1) => w1.id == well.id)
        // Map the requests to each well
        const reqs = w.relationships.requests.data?.map((request) => {
          const req = requests?.find((r) => r.id == request.id)
          return {
            id: req.id,
            ...req.attributes,
          }
        })
        return {
          ...w.attributes,
          requests: reqs,
        }
      }),
    }
  }

  return {}
}

const actions = {
  setPlates,
  findPlate,
}

export { setPlates, findPlate }

export default actions
