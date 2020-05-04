import handlePromise  from '@/api/PromiseHelper'

// TODO: check this still works??
// TODO: this should be moved to requests
const exportSampleExtractionTubesIntoTraction = async ({ getters }, tubes)  => {
  let body = {
    data: {
      type: "requests",
      attributes: {
        requests: sampleExtractionTubeJson(tubes)
      }
    }
  }

  let request = getters.requestsRequest
  let promise = request.create(body)
  let response = await handlePromise(promise)

  return response
}

const processCostCode = (tube) => {
  if (tube.cost_code !== null) {
    return tube.cost_code
  }
  if (/\bDTOL/.test(tube.fields.sanger_sample_id)) {
    return 'S4773'
  } else {
    return tube.cost_code
  }
}

const sampleExtractionTubeJson = (tubes) => {
  return tubes.map(t => ({
    name: t.fields.sanger_sample_id,
    species: t.fields.sample_common_name,
    external_id: t.sample_uuid,
    external_study_id: t.study_uuid,
    library_type: t.library_type,
    estimate_of_gb_required: t.estimate_of_gb_required,
    number_of_smrt_cells: t.number_of_smrt_cells,
    cost_code: processCostCode(t),
    source_barcode: t.barcode
  }))
}

const actions = {
  exportSampleExtractionTubesIntoTraction
}

export {
  exportSampleExtractionTubesIntoTraction,
  sampleExtractionTubeJson,
  processCostCode
}

export default actions
