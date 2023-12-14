import {
  fetchLabwareFromSequencescape,
  findIncluded,
  getIncludedData,
  buildRequestAndSample,
} from './sequencescapeUtils.js'

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
 *
 * @param { Object } labware Labware object from Sequencescape
 * @param { Array<Object> } included Included objects from Sequencescape
 * @param { Object } requestOptions Additional request parameters, will over-ride any
 * @returns { Object } plates_attributes object ready for import into traction
 */
const transformPlate = ({ labware, included, requestOptions }) => {
  return {
    barcode: labware.attributes.labware_barcode.machine_barcode,
    // for the receptacle data, we need to map over the wells and build a request for each
    wells_attributes: labware.relationships.receptacles.data
      .map((receptacle) => {
        // find the well in the included data
        const well = findIncluded({ included, data: receptacle, type: 'wells' })

        // if the well doesn't have any aliquots, we can't import it
        if (well.relationships.aliquots.data.length === 0) {
          return
        }

        // get the aliquot, study, sample and sample_metadata from the included data
        const { aliquot, study, sample, sample_metadata } = getIncludedData({
          labware: well,
          included,
        })

        return {
          position: well.attributes.position.name,
          // build the request and sample objects
          ...buildRequestAndSample({ aliquot, study, sample, sample_metadata, requestOptions }),
        }
        // filter out any wells that don't have aliquots
      })
      .filter((item) => item !== undefined),
  }
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
    barcode: labware.attributes.labware_barcode.machine_barcode,
    // build the request and sample objects
    ...buildRequestAndSample({ aliquot, study, sample, sample_metadata, requestOptions }),
  }
}

const labwareTypes = {
  plates: {
    type: 'plates',
    attributes: 'plates_attributes',
    transformFunction: transformPlate,
  },
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
const getAttributeKeys = () => {
  const values = Object.keys(labwareTypes).flatMap((type) => labwareTypes[type].attributes)
  return values
}

const Sequencescape = {
  fetchLabwareForReception,
  getAttributeKeys,
}

export { fetchLabwareForReception, getAttributeKeys }

export default Sequencescape
