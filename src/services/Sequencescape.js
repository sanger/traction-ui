import { handleResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

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
  return a set of plates by their barcodes
  the request is an executable api call
  the plates will be converted from json api to nested structure plates: { wells: ... }
  an array will always be returned.
*/
const getPlates = async (request, barcodes) => {
  let promise = request.get({
    filter: { barcode: barcodes },
    include: 'wells.aliquots.sample.sample_metadata,wells.aliquots.study',
  })

  let { success, data } = await handleResponse(promise)

  if (success) {
    return deserialize(data).plates || []
  } else {
    return []
  }
}

const extractBarcodes = ({ plates, tubes }) =>
  [...plates, ...tubes].flatMap((labware) => Object.values(labware.labware_barcode))

/*
  return a set of labware by their barcodes
  the request is an executable api call
  the labware will be converted from json api to nested structure labware: { receptacles: ... }
  an array will always be returned.
*/
const getLabware = async (request, barcodes) => {
  const promise = request.get({ filter: { barcode: barcodes }, ...labwareRequestConfig })

  const { success, data } = await handleResponse(promise)

  if (success) {
    // If the response contains no plates or tubes, then the corresponding key
    // will be missing. Here we provide a default of an empty array so that we
    // may handle it downstream
    return { plates: [], tubes: [], ...deserialize(data) }
  } else {
    return { plates: [], tubes: [] }
  }
}

const labwareForImport = async ({ request, barcodes, sampleType, libraryType, costCode }) => {
  const { plates, tubes } = await getLabware(request, barcodes.join(','))
  const platesPayload = transformPlates({ plates, sampleType, libraryType, costCode })
  const tubesPayload = transformTubes({ tubes, sampleType, libraryType, costCode })
  const foundBarcodes = extractBarcodes({ plates, tubes })

  return {
    plates: platesPayload,
    tubes: tubesPayload,
    foundBarcodes,
  }
}

/*
  this function would be better inside something that pertains to traction
  convert plates into the correct structure form importing into traction
  the sampleType is an object type so that the correct attributes are passed
*/
const transformPlates = ({
  plates = [],
  sampleType = OntSample,
  libraryType = null,
  costCode,
} = {}) => plates.map((plate) => transformPlate({ ...plate, sampleType, libraryType, costCode }))

const transformTubes = ({ tubes = [], sampleType, libraryType, costCode } = {}) =>
  tubes.map((tube) => transformTube({ ...tube, sampleType, libraryType, costCode }))

/*
  extract the barcode and wells by destructuring
  then transform the wells into the correct format
*/
const transformPlate = ({
  labware_barcode: { human_barcode: barcode },
  wells,
  receptacles,
  sampleType,
  libraryType,
  costCode,
}) => ({
  barcode,
  //destructure the wells to get the position and the first aliquot
  wells: (wells || receptacles).map(({ position: { name: position }, aliquots: [aliquot] }) => {
    return {
      position,
      // we only want to transform the aliquot if it has got something in it
      // the sample type will determine the attributes of the sample
      samples: aliquot ? [sampleType(aliquot, libraryType, costCode)] : undefined,
    }
  }),
})

/*
  Convert a tube to a traction request
*/
const transformTube = ({
  labware_barcode: { machine_barcode: barcode },
  receptacles: [
    {
      aliquots: [aliquot],
    },
  ],
  libraryType,
  costCode,
}) => ({
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
  tube: { barcode },
})

/*
  This is in camel case as the end point is graphQL
  An ONT sample needs:
  * external id - the sample uuid
  * name - the sample name
  * tagOligo - the oligo of the aliquot
  * external study id - the study uuid of the sample
*/
const OntSample = (aliquot) => ({
  externalId: aliquot.sample.uuid,
  name: aliquot.sample.name,
  tagOligo: aliquot.tag_oligo,
  externalStudyId: aliquot.study.uuid,
})

/*
  This is in snake case as the end point is JSON API
  A Pacbio sample needs:
  * external id - the sample uuid
  * name - the sample name
  * tagOligo - the oligo of the aliquot
  * external study id - the study uuid of the sample
*/
const PacbioSample = (aliquot, libraryType, costCode) => ({
  external_id: aliquot.sample.uuid,
  name: aliquot.sample.name,
  external_study_id: aliquot.study.uuid,
  species: aliquot.sample.sample_metadata.sample_common_name,
  library_type: libraryType === undefined ? aliquot.library_type : libraryType,
  cost_code: costCode,
})

const Sequencescape = {
  transformPlates,
  transformTubes,
  getPlates,
  OntSample,
  PacbioSample,
  extractBarcodes,
  labwareForImport,
}

export {
  transformPlates,
  getPlates,
  OntSample,
  PacbioSample,
  extractBarcodes,
  transformTubes,
  labwareForImport,
}

export default Sequencescape
