// This module replaces by services.Sequencescape which can be removed
// when the pipeline-specific receptions are retired. While this change results
// in temporary code duplication, it allows for complete decoupling of old and
// new paths, greatly simplifying the removal.
import { handleResponse } from '@/api/ResponseHelper'

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

  const { success, data: { data, included = [] } = {}, errors } = await handleResponse(promise)

  if (success) {
    return { data, included }
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
 * imported from Sequencescape if present
 * @returns { Object } Reception object ready for import into traction
 *
 */
const labwareForReception = async ({ requests, barcodes, requestOptions }) => {
  const request = requests.sequencescape.labware
  const { data, included } = await getLabware(request, barcodes.join(','))

  const containerAttributes = transformLabwareList({
    data,
    included,
    requestOptions,
  })

  // count the number of labware
  const labwareCount = Object.keys(labwareTypes).reduce((result, type) => {
    return result + (containerAttributes[labwareTypes[type].attributes]?.length || 0)
  }, 0)

  return {
    attributes: { source: 'traction-ui.sequencescape', ...containerAttributes },
    labwareCount,
  }
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
    type: 'plates',
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
    type: 'tubes',
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
 * Transforms the provided list of Sequencescape labware into containerAttributes
 * for import into traction
 * @param { Array<Object> } data Array of Sequencescape labware objects
 * @param { Array<Object> } included Array of Sequencescape included objects
 * @param { Object } requestOptions Additional request parameters
 * @returns { Object } Object of containerAttributes for import into traction
 */
const transformLabwareList = ({ data, included, requestOptions } = {}) => {
  return data.reduce((result, labware) => {
    // find the labware type
    const labwareType = labwareTypes[labware.type]

    // if we don't have a labware type, we can't import it
    if (!labwareType) {
      return result
    }

    // create the attributes object if it doesn't exist
    if (!result[labwareType.attributes]) {
      result[labwareType.attributes] = []
    }
    // add the transformed labware to the attributes object
    result[labwareType.attributes].push(
      labwareType.transformFunction({ labware, included, requestOptions }),
    )

    return result
  }, {})
}

/**
 *
 * @param {Array<Object>} included Included objects from Sequencescape
 * @param {Object} data Data object from Sequencescape
 * @param {String} type JSON API type
 * @returns { Object } Included object matching the provided data and type
 */
const findIncluded = ({ included, data, type }) => {
  return included.find((i) => i.id === data.id && i.type === type)
}

/**
 * @param {Object} labware Labware object from Sequencescape
 * @param {Array<Object>} included Included objects from Sequencescape
 * @returns {Object} Object containing the aliquot, study, sample and sample_metadata
 */
const getIncludedData = ({ labware, included }) => {
  // could we use closures?
  const aliquot = findIncluded({
    included,
    data: labware.relationships.aliquots.data[0],
    type: 'aliquots',
  })
  const study = findIncluded({ included, data: aliquot.relationships.study.data, type: 'studies' })
  const sample = findIncluded({
    included,
    data: aliquot.relationships.sample.data,
    type: 'samples',
  })
  const sample_metadata = findIncluded({
    included,
    data: sample.relationships.sample_metadata.data,
    type: 'sample_metadata',
  })

  return { aliquot, study, sample, sample_metadata }
}

/**
 * @param {Object} aliquot Aliquot object from Sequencescape
 * @param {Object} study Study object from Sequencescape
 * @param {Object} sample Sample object from Sequencescape
 * @param {Object} sample_metadata Sample metadata object from Sequencescape
 * @param {Object} requestOptions Additional request parameters, will over-ride any current attributes
 * @returns {Object} Object containing the request and sample objects
 */
const buildRequestAndSample = ({ aliquot, study, sample, sample_metadata, requestOptions }) => {
  return {
    request: {
      external_study_id: study.attributes.uuid,
      library_type: aliquot.attributes.library_type,
      ...requestOptions,
    },
    sample: {
      external_id: sample.attributes.uuid,
      name: sample.attributes.name,
      species: sample_metadata.attributes.sample_common_name,
    },
  }
}

const Sequencescape = {
  labwareForReception,
}

export { labwareForReception }

export default Sequencescape
