import { fetchLabwareFromSequencescape, labwareTypes } from './sequencescapeUtils.js'

/**
 * Request parameters for retrieval of labware from Sequencescape v2 API
 */

const labwareRequestConfig = {
  include:
    'receptacles.aliquots.library.aliquots.sample.sample_metadata,receptacles.aliquots.library.aliquots.study,receptacles.aliquots.library.aliquots,receptacles.aliquots.library.labware.receptacles',
  fields: {
    tubes: 'labware_barcode,receptacles',
    labware: 'labware_barcode,receptacles',
    receptacles: 'aliquots',
    samples: 'sample_metadata,name,uuid',
    sample_metadata: 'sample_common_name,volume,concentration',
    studies: 'uuid',
    aliquots: 'study,library_type,sample,insert_size_to,tag_oligo',
  },
}

/**
 * Makes a request to the Sequencescape v2 API to retrieve the labware
 * associated with the provided barcodes. Uses the provided requestOptions to
 * construct a reception object that can be posted to the traction receptions
 * endpoint
 * @param { Object } { sequencescape: { labware: { get: Function } } } requests The API requests store ($store.getters.api)
 * @param { Array<String> } barcodes Array of barcodes to look up
 * @param { Object } requestOptions Additional request parameters, will over-ride any
 * imported from Sequencescape if present
 * @returns { Object } Reception object ready for import into traction includes attributes and foundBarcodes
 *
 */
const fetchLabwareForReception = async ({ requests, barcodes, requestOptions, libraryOptions }) => {
  return fetchLabwareFromSequencescape({
    requests,
    barcodes,
    requestOptions,
    libraryOptions,
    labwareTypes: { tubes: { ...labwareTypes.multiplexed_library_tubes } },
    labwareRequestConfig,
  })
}

const SequencescapeMultiplexedLibraries = {
  fetchLabwareForReception,
}

export { fetchLabwareForReception }

export default SequencescapeMultiplexedLibraries
