
const transformPlates = (plates) => {
  return plates.map(plate => {
    return {barcode: plate.labware_barcode.human_barcode, wells: transformWells(plate.wells) }
  })
}

const transformWells = (wells) => {
  return wells.map(well => {
    return {position: well.position.name, samples: transformSamples(well.samples) }
  })
}

const transformSamples = (samples) => {
  return samples.map(sample => {
    return {externalId: sample.uuid, name: sample.sanger_sample_id}
  })
}

export default function sequencescapeToTraction (plate) {
  return transformPlates(plate)
}