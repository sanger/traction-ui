import handleResponse from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

const setPlates = async ({ commit, getters }, filter) => {
  const request = getters.getPlates
  const promise = request.get({ filter, include: 'wells.requests' })
  const response = await handleResponse(promise)
  let { success, data: { data, included = [] } = {}, errors = [] } = response
  const { wells, requests } = groupIncludedByResource(included)

  if (success) {
    /*
      Here we build plate objects to include necessary relational data
      for the pacbio plates page
    */
    const plates = data.map((plate) => {
      return {
        id: plate.id,
        ...plate.attributes,
        // Map the wells to the plate
        wells: plate.relationships.wells.data?.map((well) => {
          let w = wells?.find((w1) => w1.id == well.id)
          // Map the requests to each well
          let reqs = w.relationships.requests.data?.map((request) => {
            let req = requests?.find((r) => r.id == request.id)
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
    })

    commit('setPlates', plates)
  }

  return { success, errors }
}

const actions = {
  setPlates,
}

export { setPlates }

export default actions
