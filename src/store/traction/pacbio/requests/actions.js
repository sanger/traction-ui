import handlePromise from '@/api/PromiseHelper'
import { handleResponse } from '@/api/ResponseHelper'

const setRequests = async ({ commit, getters }, filter) => {
  const request = getters.requestsRequest
  const promise = request.get({ filter })
  const response = await handlePromise(promise)

  if (response.successful) {
    const requests = response.deserialize.requests
    commit('setRequests', requests)
    return { success: true, errors: [] }
  }

  return { success: false, errors: response.errors }
}

const updateRequest = async ({ getters }, payload) => {
  const request = getters.requestsRequest
  const sample = getters.requests.find((r) => r.id == payload.id)

  const requestPayload = createRequestPayload(sample)
  const promise = request.update(requestPayload)
  const response = await handlePromise(promise)

  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const createRequestPayload = (sample) => {
  return {
    data: {
      id: sample.id,
      type: 'requests',
      attributes: {
        library_type: sample.library_type,
        estimate_of_gb_required: sample.estimate_of_gb_required,
        number_of_smrt_cells: sample.number_of_smrt_cells,
        cost_code: sample.cost_code,
      },
    },
  }
}

const exportSampleExtractionTubesIntoTraction = async (
  { getters },
  { tubes, libraryType = undefined },
) => {
  const body = {
    data: {
      type: 'requests',
      attributes: {
        requests: sampleExtractionTubeJson(tubes, libraryType),
      },
    },
  }

  const request = getters.requestsRequest
  const promise = request.create({ data: body })
  const response = await handleResponse(promise)
  return response
}

const sampleExtractionTubeJson = (tubes, libraryType) => {
  return tubes.map(
    ({
      library_type,
      estimate_of_gb_required,
      number_of_smrt_cells,
      barcode,
      study_uuid: external_study_id,
      sample_uuid: external_id,
      cost_code,
      fields: { sanger_sample_id: name, sample_common_name: species },
    }) => ({
      sample: { name, species, external_id },
      request: {
        external_study_id,
        library_type: libraryType === undefined ? library_type : libraryType,
        estimate_of_gb_required,
        number_of_smrt_cells,
        ...(cost_code ? { cost_code } : null),
      },
      tube: { barcode },
    }),
  )
}

const actions = {
  setRequests,
  updateRequest,
  exportSampleExtractionTubesIntoTraction,
}

export {
  setRequests,
  updateRequest,
  createRequestPayload,
  exportSampleExtractionTubesIntoTraction,
  sampleExtractionTubeJson,
}

export default actions
