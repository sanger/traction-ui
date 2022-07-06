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

/*
  return a set of labware by their barcodes
  the request is an executable api call
  the labware will be converted from json api to nested structure labware: { receptacles: ... }
  will throw any errors returned fromthe API
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

const labwareForReception = async ({ requests, barcodes, libraryType, costCode }) => {
  let request = requests.sequencescape.labware
  const { plates = [], tubes = [] } = await getLabware(request, barcodes.join(','))
  const requestAttributes = transformLabwareList({
    labwareList: [...plates, ...tubes],
    libraryType,
    costCode,
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

const transformLabwareList = ({ labwareList, libraryType, costCode } = {}) =>
  labwareList.flatMap((labware) => transformLabware({ ...labware, libraryType, costCode }))

// Transform a container to the correct format: for a well outputs
// eg. { type: 'wells', barcode: 'plate_barcode', position: 'A1' }
// For receptacle (ie. we have a tube)
// { type: 'tubes', barcode: 'tube_barcode' }
const container = ({ type, barcode, position }) =>
  type == 'wells' ? { type, barcode, position: position.name } : { type: 'tubes', barcode }

const transformLabware = ({
  labware_barcode: { machine_barcode: barcode },
  receptacles,
  libraryType,
  costCode,
}) =>
  receptacles.flatMap(({ aliquots, position, type }) =>
    aliquots.flatMap((aliquot) => ({
      request: {
        external_study_id: aliquot.study.uuid,
        library_type: libraryType === undefined ? aliquot.library_type : libraryType,
        cost_code: costCode,
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
