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

const isLibraryBarcodeValid = async ({ dispatch }, barcode) => {
  if (!barcode) { return false }
  let libraryTube = await dispatch('getTubeForBarcode', barcode)
  return validateLibraryTube(libraryTube)
}

const getTubeForBarcode = async ({ rootGetters }, barcode) => {
  let request = rootGetters["traction/pacbio/tubes/tubeRequest"]
  let promise = request.get({ filter: { barcode: barcode } })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    return response.deserialize.tubes[0]
  }
}

const validateLibraryTube = (tube) => {
  if (!tube) { return false }
  if (!tube.materials) { return false }
  if (!tube.materials.every(m => m.library_kit_barcode)) { return false }
  // a way to validation libraries, as type is now container_material
  // update test l.145
  // if (tube.material.type != 'libraries') { return false }

  return true
}

const actions = {
  exportSampleExtractionTubesIntoTraction,
  isLibraryBarcodeValid,
  getTubeForBarcode,
}

export {
  exportSampleExtractionTubesIntoTraction,
  sampleExtractionTubeJson,
  processCostCode,
  isLibraryBarcodeValid,
  getTubeForBarcode,
  validateLibraryTube,
}

export default actions
