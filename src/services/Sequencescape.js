import handlePromise from '@/api/PromiseHelper'

/* 
  return a set of plates by their barcodes
  the request is an executable api call
  the plates will be converted from json api to nested structure plates: { wells: ... }
  an array will always be returned.
*/
const getPlates = async (request, barcodes) => {
  let plates = []
  let promise = request.get({ filter: { barcode: barcodes } })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    plates = response.deserialize.plates
  }
  return plates
}

/* 
  this function would be better inside something that pertains to traction
  convert plates into the correct structure form importing into traction
  the sampleType is an object type so that the correct attributes are passed
*/
const transformPlates = ({ plates = [], sampleType = OntSample } = {}) => {
  return plates.map((plate) => transformPlate({ ...plate, sampleType }))
}

/*
  extract the barcode and wells by destructuring
  then transform the wells into the correct format
*/
const transformPlate = ({ labware_barcode: { human_barcode: barcode }, wells, sampleType }) => ({
  barcode,
  //destructure the wells to get the position and the first aliquot
  wells: wells.map(({ position: { name: position }, aliquots: [aliquot] }) => {
    return {
      position,
      // we only want to transform the aliquot if it has got something in it
      // the sample type will determine the attributes of the sample
      samples: aliquot ? [sampleType(aliquot)] : undefined,
    }
  }),
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
  This is in camel case as the end point is JSON API
  A Pacbio sample needs:
  * external id - the sample uuid
  * name - the sample name
  * tagOligo - the oligo of the aliquot
  * external study id - the study uuid of the sample
*/
const PacbioSample = (aliquot) => ({
  external_id: aliquot.sample.uuid,
  name: aliquot.sample.name,
  external_study_id: aliquot.study.uuid,
  species: aliquot.sample.sample_metadata.sample_common_name,
})

const Sequencescape = {
  transformPlates,
  getPlates,
  OntSample,
  PacbioSample,
}

export { transformPlates, getPlates, OntSample, PacbioSample }

export default Sequencescape
