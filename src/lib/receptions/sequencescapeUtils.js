// This module replaces by services.Sequencescape which can be removed
// when the pipeline-specific receptions are retired. While this change results
// in temporary code duplication, it allows for complete decoupling of old and
// new paths, greatly simplifying the removal.
import { handleResponse } from '@/api/ResponseHelper.js'

/**
 * Makes a request to the Sequencescape v2 API to retrieve the labware
 * associated with the provided barcodes. Uses the provided requestOptions to
 * construct a reception object that can be posted to the traction receptions
 * endpoint
 * @param { Object } { sequencescape: { labware: { get: Function } } } requests The API requests store ($store.getters.api)
 * @param { Array<String> } barcodes Array of barcodes to look up
 * @param { Object } requestOptions Additional request parameters, will over-ride any
 * @param { Object } labwareTypes Object containing the labware types and their attributes
 * @param { Object } labwareRequestConfig Request parameters for retrieval of labware from Sequencescape v2 API
 * imported from Sequencescape if present
 * @returns { Object } Reception object ready for import into traction includes attributes and foundBarcodes
 *
 */
const fetchLabwareFromSequencescape = async ({
  requests,
  barcodes,
  requestOptions,
  libraryOptions,
  labwareTypes,
  labwareRequestConfig,
}) => {
  const request = requests.sequencescape.labware
  const { data, included } = await getLabware(request, barcodes.join(','), labwareRequestConfig)
  //Transforms the provided list of Sequencescape labware into containerAttributes
  const containerAttributes = transformAllLabware({
    data,
    included,
    requestOptions,
    libraryOptions,
    labwareTypes,
  })

  let foundBarcodes = new Set()
  if (containerAttributes['pool_attributes']) {
    // If we have a pool we only want to show the pool barcode
    foundBarcodes = new Set([containerAttributes['pool_attributes']['barcode']])
  } else {
    // find all the barcodes in the containerAttributes by type - plates or tubes
    foundBarcodes = new Set(
      Object.keys(containerAttributes).reduce((result, type) => {
        return result.concat((containerAttributes[type] || []).map((item) => item.barcode))
      }, []),
    )
  }

  return {
    attributes: { source: 'traction-ui.sequencescape', ...containerAttributes },
    foundBarcodes,
  }
}

/**
 * Sends a request to the Sequencescape V2 API and return a set of labware by
 * their barcodes
 *
 * The labware will be converted from json api to nested structure labware: { receptacles: ... }
 * will throw any errors returned from the API
 * @param { Function } request Request object for the Sequencescape V2 labware API
 * @param { String } barcodes List of comma separated barcodes to look up
 * @param { Object } labwareRequestConfig Request parameters for retrieval of labware from Sequencescape v2 API
 * @returns { Array<Object> } Array of normalized labware objects
 */
const getLabware = async (request, barcodes, labwareRequestConfig) => {
  const promise = request.get({ filter: { barcode: barcodes }, ...labwareRequestConfig })

  const { success, body: { data, included = [] } = {}, errors } = await handleResponse(promise)

  if (success) {
    return { data, included }
  } else {
    throw new Error(`Problem talking to Sequencescape: ${errors}`)
  }
}

/**
 * Transforms the provided list of Sequencescape labware into containerAttributes
 * for import into traction
 * @param { Array<Object> } data Array of Sequencescape labware objects
 * @param { Array<Object> } included Array of Sequencescape included objects
 * @param { Object } requestOptions Additional request parameters
 * @param { Object } labwareTypes Object containing the labware types and their attributes
 * @returns { Object } Object of containerAttributes for import into traction
 */
const transformAllLabware = ({
  data,
  included,
  requestOptions,
  libraryOptions,
  labwareTypes,
} = {}) => {
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
    result[labwareType.attributes] = result[labwareType.attributes].concat(
      labwareType.transformFunction({
        labware,
        included,
        requestOptions,
        libraryOptions,
        barcodeAttribute: labwareType.barcodeAttribute,
      }),
    )

    if (labwareType.pool) {
      result['pool_attributes'] = buildPool({
        labware,
        included,
        libraryOptions,
        barcodeAttribute: labwareType.barcodeAttribute,
      })
    }

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

  // If the sample does not exist in Sequencescape, we need to err.
  if (!labware.relationships.aliquots?.data?.length) {
    throw new Error('Unable to find samples in sequencescape for labware barcode.')
  }

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
const buildRequestAndSample = ({
  aliquot,
  study,
  sample,
  sample_metadata,
  requestOptions,
  retention_instruction = null,
}) => {
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
      retention_instruction,
    },
  }
}

/**
 * @param {Object} aliquot Aliquot object from Sequencescape
 * @param {Object} study Study object from Sequencescape
 * @param {Object} sample Sample object from Sequencescape
 * @param {Object} sample_metadata Sample metadata object from Sequencescape
 * @param {Object} requestOptions Additional request parameters, will over-ride any current attributes
 * @returns {Object} Object containing the request and sample objects
 */
const buildKinnexRequestAndSample = ({
  aliquot,
  study,
  sample,
  sample_metadata,
  requestOptions,
  retention_instruction = null,
}) => {
  return {
    request: {
      external_study_id: study.attributes.uuid,
      library_type: aliquot.attributes.library_type,
      ...requestOptions,
    },
    sample: {
      external_id: sample.attributes.uuid,
      // For Kinnex tubes, use supplier_name as the sample name.
      // All samples in a Kinnex tube share the same supplier_name, which serves as a unique identifier
      // for the compound sample created in Traction to represent all samples in the tube.
      name: sample_metadata.attributes.supplier_name,
      species: sample_metadata.attributes.sample_common_name,
      donor_id: sample_metadata.attributes.donor_id,
      date_of_sample_collection: sample_metadata.attributes.date_of_sample_collection,
      retention_instruction,
    },
  }
}

/**
 * A function to build a reception library Object
 * Currently only includes data for ONT Libraries
 * @param {Object}  aliquot Aliquot object from Sequencescape
 * @param {Object} sample_metadata Sample metadata object from Sequencescape
 * @returns {Object} Object containing the library object
 */
const buildLibrary = ({ aliquot, sample_metadata, libraryOptions }) => {
  return {
    library: {
      volume: sample_metadata.attributes.volume,
      concentration: sample_metadata.attributes.concentration,
      insert_size: aliquot.attributes.insert_size_to,
      tag_sequence: aliquot.attributes.tag_oligo,
      kit_barcode: libraryOptions.kit_barcode,
    },
  }
}

/**
 * A function to build a reception pool Object
 * Currently only includes data for ONT pools
 * @param {Object}  aliquot Aliquot object from Sequencescape
 * @param {Object} sample_metadata Sample metadata object from Sequencescape
 * @returns {Object} Object containing the library object
 */
const buildPool = ({ labware, included, barcodeAttribute, libraryOptions }) => {
  // The sample metadata can be assumed to be the same from any sample_metadata object
  const sample_metadata = included.find((item) => item.type === 'sample_metadata')
  // The aliquot metadata can be assumed to be the same from any aliquot object
  const aliquot = included.find((item) => item.type === 'aliquots')

  return {
    barcode: labware.attributes.labware_barcode[barcodeAttribute],
    volume: sample_metadata.attributes.volume,
    concentration: sample_metadata.attributes.concentration,
    insert_size: aliquot.attributes.insert_size_to,
    kit_barcode: libraryOptions.kit_barcode,
  }
}

/**
 * Extracts retention instruction from labware.
 * @param {Object} labware - Labware object from Sequencescape.
 * @returns {string|null} Retention instruction.
 */
const getRetentionInstruction = (labware) => labware.attributes.retention_instruction ?? null

/**
 * Extracts and normalizes attributes for labware transformation.
 * @param {Object} attributes - Attributes containing labware data.
 * @returns {Object} Normalized attributes.
 */
const labwareTransformAttributes = ({
  labware,
  included,
  requestOptions,
  libraryOptions,
  barcodeAttribute,
}) => ({
  labware,
  included,
  requestOptions,
  libraryOptions,
  barcodeAttribute,
  retention_instruction: getRetentionInstruction(labware), // Call getRetentionInstruction here
})

/**
 *
 * @param {Object} labware Labware object from Sequencescape
 * @param {Array<Object>} included Included objects from Sequencescape
 * @param {Object} requestOptions Additional request parameters, will over-ride any
 * @returns {Object} tubes_attributes object ready for import into traction
 */
const transformTube = (attributes) => {
  // Use labwareTransformAttributes to extract and normalize the arguments
  const { labware, included, requestOptions, barcodeAttribute, retention_instruction } =
    labwareTransformAttributes(attributes)

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
    barcode: labware.attributes.labware_barcode[barcodeAttribute],
    // build the request and sample objects
    ...buildRequestAndSample({
      aliquot,
      study,
      sample,
      sample_metadata,
      requestOptions,
      retention_instruction,
    }),
  }
}

/**
 *
 * @param {Object} labware Labware object from Sequencescape
 * @param {Array<Object>} included Included objects from Sequencescape
 * @param {Object} requestOptions Additional request parameters, will over-ride any
 * @returns {Object} tubes_attributes object ready for import into traction
 */
const transformKinnexTube = (attributes) => {
  // Use labwareTransformAttributes to extract and normalize the arguments
  const { labware, included, requestOptions, barcodeAttribute, retention_instruction } =
    labwareTransformAttributes(attributes)

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
    barcode: labware.attributes.labware_barcode[barcodeAttribute],
    // build the request and sample objects
    ...buildKinnexRequestAndSample({
      aliquot,
      study,
      sample,
      sample_metadata,
      requestOptions,
      retention_instruction,
    }),
  }
}

const transformMultiplexedLibraryTube = ({
  included,
  requestOptions,
  barcodeAttribute,
  libraryOptions,
}) => {
  const included_labware = included.filter((item) => item.type === 'labware')
  const child_library_tubes = included_labware.map((child_library_tube) => {
    const receptacle = findIncluded({
      included,
      data: child_library_tube.relationships.receptacles.data[0],
      type: 'receptacles',
    })

    const { aliquot, study, sample, sample_metadata } = getIncludedData({
      labware: receptacle,
      included,
    })

    return {
      barcode: child_library_tube.attributes.labware_barcode[barcodeAttribute],
      // build the request and sample objects
      ...buildRequestAndSample({
        aliquot,
        study,
        sample,
        sample_metadata,
        requestOptions,
      }),
      ...buildLibrary({ aliquot, sample_metadata, libraryOptions }),
    }
  })

  return child_library_tubes
}

/**
 *
 * @param { Object } labware Labware object from Sequencescape
 * @param { Array<Object> } included Included objects from Sequencescape
 * @param { Object } requestOptions Additional request parameters, will over-ride any
 * @returns { Object } plates_attributes object ready for import into traction
 */
const transformPlate = (attributes) => {
  // Use labwareTransformAttributes to extract and normalize the arguments
  const { labware, included, requestOptions, barcodeAttribute, retention_instruction } =
    labwareTransformAttributes(attributes)
  return {
    barcode: labware.attributes.labware_barcode[barcodeAttribute],
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
          ...buildRequestAndSample({
            aliquot,
            study,
            sample,
            sample_metadata,
            requestOptions,
            retention_instruction,
          }),
        }
        // filter out any wells that don't have aliquots
      })
      .filter((item) => item !== undefined),
  }
}

const labwareTypes = {
  tubes: {
    type: 'tubes',
    attributes: 'tubes_attributes',
    transformFunction: transformTube,
    barcodeAttribute: 'machine_barcode',
  },
  multiplexed_library_tubes: {
    type: 'tubes',
    attributes: 'tubes_attributes',
    pool: true,
    transformFunction: transformMultiplexedLibraryTube,
    barcodeAttribute: 'human_barcode',
  },
  plates: {
    type: 'plates',
    attributes: 'plates_attributes',
    transformFunction: transformPlate,
    barcodeAttribute: 'machine_barcode',
  },
  kinnex_tubes: {
    type: 'tubes',
    attributes: 'tubes_attributes',
    transformFunction: transformKinnexTube,
    barcodeAttribute: 'human_barcode',
  },
}

export {
  fetchLabwareFromSequencescape,
  getIncludedData,
  buildRequestAndSample,
  buildLibrary,
  buildPool,
  findIncluded,
  labwareTypes,
}
