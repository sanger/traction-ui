import sequencescapeToTractionPlates from '@/api/PlateTransformer'
import Response from '@/api/Response'
import { Data } from '../testHelper'

const Plates = [
  { id: '23811789',
  type: 'plates',
  uuid: '6a3a2dc6-f48d-11e8-aed5-68b59976a384',
  name: 'Plate DN550065I',
  labware_barcode:
   { ean13_barcode: '1220550065734',
     machine_barcode: '1220550065734',
     human_barcode: 'DN550065I' },
  state: 'passed',
  number_of_rows: 8,
  number_of_columns: 12,
  created_at: '2018-11-30T10:48:04+00:00',
  updated_at: '2019-11-22T06:23:01+00:00',
  wells:
   [
    { type: 'wells',
    id: '23811790',
    uuid: '6a3eb7ce-f48d-11e8-aed5-68b59976a384',
    name: 'DN550065I:A1',
    position: { name: 'A1' },
    state: 'passed',
    aliquots:
     [ { type: 'aliquots',
         id: '29205292',
         tag_oligo: 'GGGATCCT',
         tag_index: 1,
         tag2_oligo: 'CCATCCAA',
         tag2_index: 1,
         suboptimal: false,
         sample: { type: 'samples',
         id: '4189723',
         name: '4463STDY8091171',
         sanger_sample_id: '4463STDY8091171',
         uuid: '03e6d65e-c283-11e9-9453-68b59976a384' } },
         { type: 'aliquots',
         id: '29205292',
         tag_oligo: 'GGGATCCT',
         tag_index: 1,
         tag2_oligo: 'CCATCCAA',
         tag2_index: 1,
         suboptimal: false,
         sample: { type: 'samples',
         id: '4189723',
         name: '4463STDY8091171',
         sanger_sample_id: '4463STDY8091171',
         uuid: '03e6d65e-c283-11e9-9453-68b59976a384' } }
     ] },
    { type: 'wells',
    id: '23811791',
    uuid: '6a41efac-f48d-11e8-aed5-68b59976a384',
    name: 'DN550065I:A2',
    position: { name: 'A2' },
    state: 'passed',
    aliquots:
    [ { type: 'aliquots',
        id: '29205293',
        tag_oligo: 'CGGCTTCT',
        tag_index: 9,
        tag2_oligo: 'TAGGTCTA',
        tag2_index: 9,
        suboptimal: false,
        sample: { type: 'samples',
        id: '4189731',
        name: '4463STDY8091179',
        sanger_sample_id: '4463STDY8091179',
        uuid: '04571568-c283-11e9-9453-68b59976a384' } } ] },
    { type: 'wells',
      id: '23811885',
      uuid: '6b3e0558-f48d-11e8-aed5-68b59976a384',
      name: 'DN550065I:H12',
      position: { name: 'H12' },
      state: 'passed',
      aliquots:
        [ ] }
   ]
  }
]


describe('PlateTransformer', () => {

  describe('sequencescape to traction', () => {

    let transformedPlates, transformedPlate

    beforeEach(() => {
      transformedPlates = sequencescapeToTractionPlates(Plates)
      transformedPlate = transformedPlates[0]
    })

    it('plate should only have a barcode and wells', () => {
      expect(Object.keys(transformedPlate)).toEqual(['barcode','wells'])
      expect(transformedPlate.barcode).toEqual('DN550065I')
      expect(transformedPlate.wells.length).toEqual(3)
    })

    it('wells should have a position and samples', () => {
      let well = transformedPlate.wells[0]
      expect(Object.keys(well)).toEqual(['position', 'samples'])
      expect(well.position).toEqual('A1')
      expect(well.samples.length).toEqual(2)
    })

    it('samples should have an id, name and tag', () => {
      let sample = transformedPlate.wells[0].samples[0]
      expect(Object.keys(sample)).toEqual(['externalId', 'name', 'tags'])
      expect(sample.externalId).toEqual('03e6d65e-c283-11e9-9453-68b59976a384')
      expect(sample.name).toEqual('4463STDY8091171')
      expect(sample.tags[0]).toEqual({ oligo: 'GGGATCCT', index: 1})
    })

    it('samples will be empty if there arent any', () => {
      let samples = transformedPlate.wells[2].samples
      expect(samples.length).toEqual(0)
    })
  })

})
