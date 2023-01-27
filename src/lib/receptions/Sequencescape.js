// This module replaces by services.Sequencescape which can be removed
// when the pipeline-specific receptions are retired. While this change results
// in temporary code duplication, it allows for complete decoupling of old and
// new paths, greatly simplifying the removal.
import { handleResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

const checkBarcodes = (barcodes, foundBarcodes) =>
  barcodes.filter((barcode) => !foundBarcodes.includes(barcode))
const extractBarcodes = ({ plates, tubes }) =>
  [...plates, ...tubes].flatMap((labware) => Object.values(labware.labware_barcode))

/**
 * Request parameters for retrieval of labware from Sequencescape v2 API
 */
const labwareRequestConfig = {
  include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
  fields: {
    plates: 'labware_barcode,receptacles',
    tubes: 'labware_barcode,receptacles',
    wells: 'position,aliquots',
    receptacles: 'aliquots',
    samples: 'sample_metadata,name,uuid',
    sample_metadata: 'sample_common_name',
    studies: 'uuid',
    aliquots: 'study,library_type,sample',
  },
}

/**
 * Sends a request to the Sequencescape V2 API and return a set of labware by
 * their barcodes
 *
 * The labware will be converted from json api to nested structure labware: { receptacles: ... }
 * will throw any errors returned from the API
 * @param { get: Function } request Request object for the Sequencescape V2
 * labware API
 * @param { String } barcodes List of comma separated barcodes to look up
 * @returns { Array<Object> } Array of normalized labware objects
 */
const getLabware = async (request, barcodes) => {
  const promise = request.get({ filter: { barcode: barcodes }, ...labwareRequestConfig })

  const { success, data, errors } = await handleResponse(promise)

  if (success) {
    return deserialize(data)
  } else {
    throw new Error(`Problem talking to Sequencescape: ${errors}`)
  }
}

/**
 * Makes a request to the Sequencescape v2 API to retrieve the labware
 * associated with the provided barcodes. Uses the provided requestOptions to
 * construct a reception object that can be posted to the traction receptions
 * endpoint
 * @param { sequencescape: { labware: { get: Function } } } requests The API requests store ($store.getters.api)
 * @param { Array<String> } barcodes Array of barcodes to look up
 * @param { Object } requestOptions Additional request parameters, will over-ride any
 * imported from SS if present
 * @returns { Object } Reception object ready for import into traction
 *
 */
const labwareForReception = async ({ requests, barcodes, requestOptions }) => {
  const request = requests.sequencescape.labware
  const { plates = [], tubes = [] } = await getLabware(request, barcodes.join(','))
  const requestAttributes = transformLabwareList({
    labwareList: [...plates, ...tubes],
    requestOptions,
  })
  const foundBarcodes = extractBarcodes({ plates, tubes })

  const missing = checkBarcodes(barcodes, foundBarcodes)

  if (missing.length > 0) {
    throw `Labware could not be retrieved from Sequencescape: ${missing}`
  }

  return {
    source: 'sequencescape',
    requestAttributes,
  }
}

/**
 * Transforms the provided list of Sequencescape labware into requestAttributes
 * for import into traction
 */
const transformLabwareList = ({ labwareList, requestOptions } = {}) =>
  labwareList.flatMap((labware) => transformLabware({ ...labware, requestOptions }))

// Transform a container to the correct format: for a well outputs
// eg. { type: 'wells', barcode: 'plate_barcode', position: 'A1' }
// For receptacle (ie. we have a tube)
// { type: 'tubes', barcode: 'tube_barcode' }
const container = ({ type, barcode, position }) =>
  type == 'wells' ? { type, barcode, position: position.name } : { type: 'tubes', barcode }

/**
 * Takes a deserialized labware object and extracts the request, sample and
 * container information for import into traction via a reception resource.
 */
const transformLabware = ({
  labware_barcode: { machine_barcode: barcode },
  receptacles,
  requestOptions,
}) =>
  receptacles.flatMap(({ aliquots, position, type }) =>
    aliquots.flatMap((aliquot) => ({
      request: {
        external_study_id: aliquot.study.uuid,
        library_type: aliquot.library_type,
        ...requestOptions,
      },
      sample: {
        name: aliquot.sample.name,
        external_id: aliquot.sample.uuid,
        species: aliquot.sample.sample_metadata.sample_common_name,
      },
      container: container({ type, barcode, position }),
    })),
  )

const Sequencescape = {
  extractBarcodes,
  labwareForReception,
}

export { extractBarcodes, labwareForReception }

export default Sequencescape
