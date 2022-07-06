import { handleResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

const checkBarcodes = (barcodes, foundBarcodes) =>
  barcodes.filter((barcode) => !foundBarcodes.includes(barcode))
const extractBarcodes = (assets) => assets.map((labware) => labware.barcode)

/*
  return a set of labware by their barcodes
  the request is an executable api call
  the labware will be converted from json api to nested structure labware: { receptacles: ... }
  will throw any errors returned fromthe API
*/
const getLabware = async (request, barcodes) => {
  const promise = request.get({ filter: { barcode: barcodes } })

  const { success, data, errors } = await handleResponse(promise)

  if (success) {
    return deserialize(data)
  } else {
    throw new Error(`Problem talking to Samples Extraction: ${errors}`)
  }
}

const labwareForReception = async ({ requests, barcodes, libraryType, costCode }) => {
  const { assets = [] } = await getLabware(requests.sampleExtraction.assets, barcodes.join(','))
  const requestAttributes = transformLabwareList({
    labwareList: assets,
    libraryType,
    costCode,
  })

  const foundBarcodes = extractBarcodes(assets)
  const missing = checkBarcodes(barcodes, foundBarcodes)

  if (missing.length > 0) {
    throw new Error(`Labware could not be retrieved from Samples Extraction: ${missing}`)
  }

  return {
    source: 'samples-extraction',
    requestAttributes,
  }
}

const transformLabwareList = ({ labwareList, libraryType, costCode } = {}) =>
  labwareList.flatMap((labware) => transformLabware({ labware, libraryType, costCode }))

const transformLabware = ({ labware, libraryType, costCode }) => ({
  request: {
    external_study_id: labware.study_uuid,
    library_type: libraryType === undefined ? labware.library_type : libraryType,
    cost_code: costCode,
  },
  sample: {
    name: labware.fields.sanger_sample_id,
    external_id: labware.sample_uuid,
    species: labware.fields.sample_common_name,
  },
  container: { type: 'tubes', barcode: labware.barcode },
})

const SamplesExtraction = {
  extractBarcodes,
  labwareForReception,
}

export { extractBarcodes, labwareForReception }

export default SamplesExtraction
