import {
  fetchLabwareFromSequencescape,
  findIncluded,
  getIncludedData,
  buildRequestAndSample,
} from './sequencescapeUtils.js'
// This module replaces by services.Sequencescape which can be removed
// when the pipeline-specific receptions are retired. While this change results
// in temporary code duplication, it allows for complete decoupling of old and
// new paths, greatly simplifying the removal.

/**
 * Request parameters for retrieval of labware from Sequencescape v2 API
 */
const labwareRequestConfig = {
  include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
  fields: {
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
 *
 * @param {Object} labware Labware object from Sequencescape
 * @param {Array<Object>} included Included objects from Sequencescape
 * @param {Object} requestOptions Additional request parameters, will over-ride any
 * @returns {Object} tubes_attributes object ready for import into traction
 */
const transformTube = ({ labware, included, requestOptions }) => {
  // find the receptacle in the included data
  const receptacle = findIncluded({
    included,
    data: labware.relationships.receptacles.data[0],
    type: 'receptacles',
  })

  // get the aliquot, study, sample and sample_metadata from the included data
  const { aliquot, study, sample, sample_metadata } = getIncludedData({
    labware: receptacle,
    included,
  })

  return {
    barcode: labware.attributes.labware_barcode.human_barcode,
    // build the request and sample objects
    ...buildRequestAndSample({ aliquot, study, sample, sample_metadata, requestOptions }),
  }
}
const labwareTypes = {
  tubes: {
    type: 'tubes',
    attributes: 'tubes_attributes',
    transformFunction: transformTube,
  },
}

/**
 * Makes a request to the Sequencescape v2 API to retrieve the labware
 * associated with the provided barcodes. Uses the provided requestOptions to
 * construct a reception object that can be posted to the traction receptions
 * endpoint
 * @param { sequencescape: { labware: { get: Function } } } requests The API requests store ($store.getters.api)
 * @param { Array<String> } barcodes Array of barcodes to look up
 * @param { Object } requestOptions Additional request parameters, will over-ride any
 * imported from Sequencescape if present
 * @returns { Object } Reception object ready for import into traction includes attributes and foundBarcodes
 *
 */
const fetchLabwareForReception = async ({ requests, barcodes, requestOptions }) => {
  return fetchLabwareFromSequencescape({
    requests,
    barcodes,
    requestOptions,
    labwareTypes,
    labwareRequestConfig,
  })
}
/**
 *
 * @returns {Array} Array of attribute keys
 */
const getAttributeKeys = () => ['tubes_attributes']

const SequencescapeTubes = {
  fetchLabwareForReception,
  getAttributeKeys,
}

export { fetchLabwareForReception, getAttributeKeys }

export default SequencescapeTubes
