import handlePromise from '@/api/PromiseHelper'
import { handleResponse } from '@/api/ResponseHelper'

const setRequests = async ({ commit, getters }) => {
  let request = getters.requestsRequest
  let promise = request.get()
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let requests = response.deserialize.requests
    commit('setRequests', requests)
  }
}

const exportSampleExtractionTubesIntoTraction = async ({ getters }, tubes) => {
  const body = {
    data: {
      type: 'requests',
      attributes: {
        requests: sampleExtractionTubeJson(tubes),
      },
    },
  }

  const request = getters.requestsRequest
  const promise = request.create({ data: body })
  const response = await handleResponse(promise)
  return response
}

const sampleExtractionTubeJson = (tubes) => {
  return tubes.map(
    ({
      barcode,
      study_uuid: external_study_id,
      sample_uuid: external_id,
      fields: { sanger_sample_id: name, sample_common_name: species },
    }) => ({
      sample: { name, species, external_id },
      request: {
        external_study_id,
      },
      tube: { barcode },
    }),
  )
}

const actions = {
  setRequests,
  exportSampleExtractionTubesIntoTraction,
}

export { setRequests, exportSampleExtractionTubesIntoTraction, sampleExtractionTubeJson }

export default actions
