import sequencescapeToTractionPlates from '@/api/PlateTransformer'

const Plates = [{ id: '26473471',
      type: 'plates',
      uuid: '9efbfcc6-7293-11ea-bb92-fa163eac8e97',
      name: 'Plate DN623718C',
      labware_barcode:
       { ean13_barcode: '1220623718673',
         machine_barcode: 'DN623718C',
         human_barcode: 'DN623718C' },
      state: 'passed',
      number_of_rows: 8,
      number_of_columns: 12,
      created_at: '2020-03-30T15:34:54+01:00',
      updated_at: '2020-03-30T15:34:54+01:00',
      wells:
       [ 
        { type: 'wells',
        id: '26504150',
        uuid: '9f068696-7293-11ea-bb92-fa163eac8e97',
        name: 'DN623718C:A1',
        position: { name: 'A1' },
        state: 'unknown',
        samples:
        [ { type: 'samples',
           id: '4176889',
           name: 'Heron8044826',
           sanger_sample_id: 'Heron8044826',
           uuid: '87b3226a-728e-11ea-8955-fa163e68e77d' },
           { type: 'samples',
           id: '4176889',
           name: 'Heron8044826',
           sanger_sample_id: 'Heron8044826',
           uuid: '87b3226a-728e-11ea-8955-fa163e68e77d'} ] },
{ type: 'wells',
      id: '26504151',
      uuid: '9f13a218-7293-11ea-bb92-fa163eac8e97',
      name: 'DN623718C:A2',
      position: { name: 'A2' },
      state: 'unknown',
      samples:
       [ { type: 'samples',
           id: '4176890',
           name: 'Heron8044827',
           sanger_sample_id: 'Heron8044827',
           uuid: '87d04d5e-728e-11ea-8955-fa163e68e77d' } ] },
{ type: 'wells',
      id: '26504245',
      uuid: '9f699e5c-7293-11ea-bb92-fa163eac8e97',
      name: 'DN623718C:H12',
      position: { name: 'H12' },
      state: 'unknown',
      samples: [] }
] }]

describe('PlateTransformer', () => {

  describe('sequencescape to traction', () => {

    let transformedPlates, transformedPlate

    beforeEach(() => {
      transformedPlates = sequencescapeToTractionPlates(Plates)
      transformedPlate = transformedPlates[0]
    })

    it('plate should only have a barcode and wells', () => {
      expect(Object.keys(transformedPlate)).toEqual(['barcode','wells'])
      expect(transformedPlate.barcode).toEqual('DN623718C')
      expect(transformedPlate.wells.length).toEqual(3)
    })

    it('wells should have a position and samples', () => {
      let well = transformedPlate.wells[0]
      expect(Object.keys(well)).toEqual(['position', 'samples'])
      expect(well.position).toEqual('A1')
      expect(well.samples.length).toEqual(2)
    })

    it('samples should have an id and name', () => {
      let sample = transformedPlate.wells[0].samples[0]
      expect(Object.keys(sample)).toEqual(['externalId', 'name'])
      expect(sample.externalId).toEqual('87b3226a-728e-11ea-8955-fa163e68e77d')
      expect(sample.name).toEqual('Heron8044826')
    })

    it('samples will be empty if there arent any', () => {
      let samples = transformedPlate.wells[2].samples
      expect(samples.length).toEqual(0)
    })

  })

})
