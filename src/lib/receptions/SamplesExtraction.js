import { handleResponse } from '@/api/v2/ResponseHelper.js'

/*
  return a set of labware by their barcodes
  the request is an executable api call
  the labware will be converted from json api to nested structure labware: { receptacles: ... }
  will throw any errors returned fromthe API
*/
const getLabware = async (request, barcodes) => {
  const promise = request.get({ filter: { barcode: barcodes } })

  const {
    success,
    body: { data },
    errors,
  } = await handleResponse(promise)

  if (success) {
    return data
  } else {
    throw new Error(`Problem talking to Samples Extraction: ${errors}`)
  }
}

/**
 * Makes a request to the Samples Extraction API to retrieve the asset
 * associated with the provided barcodes. Uses the provided requestOptions to
 * construct a reception object that can be posted to the traction receptions
 * endpoint
 * @param { Object } { sampleExtraction: { assets: { get: Function } } } requests The API requests store ($store.getters.api)
 * @param { Array<String> } barcodes Array of barcodes to look up
 * @param { Object } requestOptions Additional request parameters, will over-ride any
 * imported from SS if present
 * @returns { Object } Reception object ready for import into traction including attributes and foundBarcodes
 *
 */
const fetchLabwareForReception = async ({ requests, barcodes, requestOptions }) => {
  const labwareList = await getLabware(requests.sampleExtraction.assets, barcodes.join(','))
  const containerAttributes = transformLabwareList({
    labwareList,
    requestOptions,
  })

  const foundBarcodes = new Set(containerAttributes.tubes_attributes.map((tube) => tube.barcode))

  return {
    attributes: { source: 'traction-ui.samples-extraction', ...containerAttributes },
    foundBarcodes,
  }
}

/**
 * Transforms the provided list of samples extraction assets into requestAttributes
 * for import into traction
 */
const transformLabwareList = ({ labwareList, requestOptions } = {}) => ({
  tubes_attributes: labwareList.flatMap((labware) => transformLabware({ labware, requestOptions })),
})

/**
 * Takes a deserialized asset object and extracts the request, sample and
 * container information for import into traction via a reception resource.
 */
const transformLabware = ({ labware, requestOptions }) => ({
  barcode: labware.attributes.barcode,
  type: 'tubes',
  request: {
    external_study_id: labware.attributes.study_uuid,
    library_type: labware.attributes.library_type,
    ...requestOptions,
  },
  sample: {
    name: labware.attributes.fields.sanger_sample_id,
    external_id: labware.attributes.sample_uuid,
    species: labware.attributes.fields.sample_common_name,
  },
})
/**
 *
 * @returns {Array} Array of attribute keys
 */
const getAttributeKeys = () => {
  return ['tubes_attributes']
}

const SamplesExtraction = {
  fetchLabwareForReception,
  getAttributeKeys,
}

export { fetchLabwareForReception, getAttributeKeys }

export default SamplesExtraction
