import handlePromise from '@/api/PromiseHelper'

const getPlates = async (request, barcodes) => {
  let plates
  let promise = request.get({filter: { barcode: barcodes} })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    plates = response.deserialize.plates
  }
  
  return plates
}

const transformPlates = (plates) => {
  return plates.map(plate => {
    return {barcode: plate.labware_barcode.human_barcode, wells: transformWells(plate.wells) }
  })
}

const transformWells = (wells) => {
  return wells.map(well => {
    return {position: well.position.name, sample: transformAliquots(well.aliquots) }
  })
}

const transformAliquots = (aliquots) => {
  let aliquot = aliquots[0]
  if (aliquot === undefined) return
  return {externalId: aliquot.sample.uuid, name: aliquot.sample.name, tagOligo: aliquot.tag_oligo }
}

export {
  transformPlates,
  getPlates
}