import { handleResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

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

/**
 * Makes a request to the Samples Extraction API to retrieve the asset
 * associated with the provided barcodes. Uses the provided requestOptions to
 * construct a reception object that can be posted to the traction receptions
 * endpoint
 * @param { sampleExtraction: { assets: { get: Function } } } requests The API requests store ($store.getters.api)
 * @param { Array<String> } barcodes Array of barcodes to look up
 * @param { Object } requestOptions Additional request parameters, will over-ride any
 * imported from SS if present
 * @returns { Object } Reception object ready for import into traction
 *
 */
const labwareForReception = async ({ requests, barcodes, requestOptions }) => {
  const { assets = [] } = await getLabware(requests.sampleExtraction.assets, barcodes.join(','))
  const requestAttributes = transformLabwareList({
    labwareList: assets,
    requestOptions,
  })

  const foundBarcodes = extractBarcodes(assets)

  // number of labwares to be imported
  const labwareCount = new Set(foundBarcodes).size

  return {
    attributes: {
      source: 'traction-ui.samples-extraction',
      request_attributes: requestAttributes,
    },
    labwareCount,
  }
}

/**
 * Transforms the provided list of samples extraction assets into requestAttributes
 * for import into traction
 */
const transformLabwareList = ({ labwareList, requestOptions } = {}) =>
  labwareList.flatMap((labware) => transformLabware({ labware, requestOptions }))

/**
 * Takes a deserialized asset object and extracts the request, sample and
 * container information for import into traction via a reception resource.
 */
const transformLabware = ({ labware, requestOptions }) => ({
  request: {
    external_study_id: labware.study_uuid,
    library_type: labware.library_type,
    ...requestOptions,
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
