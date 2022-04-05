import {
  getPlates,
  transformPlates,
  transformTubes,
  OntSample,
  PacbioSample,
  labwareForImport,
} from '@/services/Sequencescape'
import { Data } from 'testHelper'
import Response from '@/api/Response'

describe('SequencescapePlates', () => {
  describe('#getPlates', () => {
    let barcodes, failedResponse, emptyResponse, request, expectedResponse, plates

    beforeEach(() => {
      request = { get: jest.fn() }
      barcodes = 'DN1234567'

      emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
      failedResponse = {
        data: { errors: [{ title: 'error1', detail: 'There was an error.' }] },
        status: 500,
        statusText: 'Internal Server Error',
      }
    })

    it('successfully', async () => {
      request.get.mockResolvedValue(Data.SequencescapePlates)

      expectedResponse = new Response(Data.SequencescapePlates)
      let expectedPlates = expectedResponse.deserialize.plates
      let plates = await getPlates(request, barcodes)

      expect(request.get).toHaveBeenCalledWith({
        filter: { barcode: barcodes },
        include: 'wells.aliquots.sample.sample_metadata,wells.aliquots.study',
      })
      expect(plates).toEqual(expectedPlates)
    })

    it('unsuccessfully', async () => {
      request.get.mockRejectedValue(failedResponse)

      plates = await getPlates(request, barcodes)

      expect(request.get).toHaveBeenCalled()
      expect(plates).toEqual([])
    })

    it('when no plates exist', async () => {
      request.get.mockResolvedValue(emptyResponse)

      plates = await getPlates(request, barcodes)

      expect(request.get).toHaveBeenCalled()
      expect(plates).toEqual([])
    })
  })

  describe('#labwareForImport', () => {
    const barcodes = ['DN1234567']
    const emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
    const failedResponse = {
      data: { errors: [{ title: 'error1', detail: 'There was an error.' }] },
      status: 500,
      statusText: 'Internal Server Error',
    }
    let request

    beforeEach(() => {
      request = { get: jest.fn() }
    })

    it('successfully', async () => {
      request.get.mockResolvedValue(Data.SequencescapeLabware)

      const expectedPlates = [
        {
          barcode: 'DN9000002A',
          wells: expect.arrayContaining([
            {
              position: 'A1',
              samples: [
                {
                  external_id: 'd5008026-94c9-11ec-a9e3-acde48001122',
                  name: '2STDY1',
                  external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
                  species: 'Dragon',
                  library_type: 'Example',
                  cost_code: 'aCostCodeExample',
                },
              ],
            },
            {
              position: 'B1',
              samples: [
                {
                  external_id: 'd50bad48-94c9-11ec-a9e3-acde48001122',
                  name: '2STDY2',
                  external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
                  species: 'Unicorn',
                  library_type: 'Example',
                  cost_code: 'aCostCodeExample',
                },
              ],
            },
          ]),
        },
      ]
      const expectedTubes = [
        {
          request: {
            external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
            library_type: 'Example',
            cost_code: 'aCostCodeExample',
          },
          sample: {
            name: '2STDY97',
            external_id: '0db37dd8-94ca-11ec-a9e3-acde48001122',
            species: 'Gryphon',
          },
          tube: { barcode: '3980000001795' },
        },
      ]
      let { plates, tubes, foundBarcodes } = await labwareForImport({
        request,
        barcodes,
        sampleType: PacbioSample,
        libraryType: 'Example',
        costCode: 'aCostCodeExample',
      })

      expect(request.get).toHaveBeenCalledWith({
        filter: { barcode: barcodes[0] },
        include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
        fields: {
          aliquots: 'study,library_type,sample',
          plates: 'labware_barcode,receptacles',
          receptacles: 'aliquots',
          sample_metadata: 'sample_common_name',
          samples: 'sample_metadata,name,uuid',
          studies: 'uuid',
          tubes: 'labware_barcode,receptacles',
          wells: 'position,aliquots',
        },
      })

      expect(plates).toEqual(expectedPlates)
      expect(tubes).toEqual(expectedTubes)
      expect(foundBarcodes).toEqual([
        '1229000002657',
        'DN9000002A',
        'DN9000002A',
        '3980000001795',
        '3980000001795',
        'NT1O',
      ])
    })

    it('unsuccessfully', async () => {
      request.get.mockRejectedValue(failedResponse)

      const { plates, tubes } = await labwareForImport({ request, barcodes })

      expect(request.get).toHaveBeenCalled()
      expect(plates).toEqual([])
      expect(tubes).toEqual([])
    })

    it('when no plates exist', async () => {
      request.get.mockResolvedValue(emptyResponse)

      const { plates, tubes } = await labwareForImport({ request, barcodes })

      expect(request.get).toHaveBeenCalled()
      expect(plates).toEqual([])
      expect(tubes).toEqual([])
    })
  })

  describe('PacbioSample', () => {
    const aliquot = {
      sample: {
        uuid: 'sample-uuid',
        name: 'sample-name',
        sample_metadata: {
          sample_common_name: 'species',
        },
      },
      study: { uuid: 'study-uuid', name: 'sample-name' },
      library_type: 'imported',
    }
    it('allows libraryType to be specified', () => {
      expect(PacbioSample(aliquot, 'selected')).toEqual(
        expect.objectContaining({ library_type: 'selected' }),
      )
    })

    it('allows libraryType to be imported', () => {
      expect(PacbioSample(aliquot, undefined)).toEqual(
        expect.objectContaining({ library_type: 'imported' }),
      )
    })

    it('allows libraryType to be removed', () => {
      expect(PacbioSample(aliquot, null)).toEqual(expect.objectContaining({ library_type: null }))
    })
  })

  describe('#transformPlates', () => {
    const plates = [
      {
        id: '27210587',
        type: 'plates',
        uuid: '7747e988-a73a-11eb-b642-fa163eea3084',
        name: 'Plate DN803958S',
        labware_barcode: {
          ean13_barcode: '1220803958837',
          machine_barcode: 'DN803958S',
          human_barcode: 'DN803958S',
        },
        state: 'pending',
        number_of_rows: 8,
        number_of_columns: 12,
        size: 96,
        created_at: '2021-04-27T10:25:11+01:00',
        updated_at: '2021-04-30T13:41:38+01:00',
        wells: [
          {
            type: 'wells',
            id: '41656842',
            uuid: '77f9e3e0-a73a-11eb-a305-fa163e8a206d',
            name: 'DN803958S:A1',
            position: { name: 'A1' },
            state: 'unknown',
            pcr_cycles: null,
            submit_for_sequencing: null,
            sub_pool: null,
            coverage: null,
            diluent_volume: null,
            aliquots: [
              {
                type: 'aliquots',
                id: '38486117',
                tag_oligo: 'GGGATCCT',
                tag_index: 1,
                tag2_oligo: 'CCATCCAA',
                tag2_index: 1,
                suboptimal: false,
                study: {
                  type: 'studies',
                  id: '5901',
                  name: 'DTOL_Darwin Tree of Life',
                  uuid: 'cf04ea86-ac82-11e9-8998-68b599768938',
                },
                sample: {
                  type: 'samples',
                  id: '5709173',
                  name: 'DTOL10233354',
                  sanger_sample_id: 'DTOL10233354',
                  uuid: '64e065a4-a9b0-11eb-991b-fa163eac3af7',
                  control: false,
                  control_type: null,
                  sample_metadata: {
                    type: 'sample_metadata',
                    id: '5707375',
                    sample_common_name: 'Orgyia antiqua',
                    supplier_name: 'FD21636035',
                  },
                },
              },
            ],
          },
          {
            type: 'wells',
            id: '41656845',
            uuid: '780088b2-a73a-11eb-a305-fa163e8a206d',
            name: 'DN803958S:D1',
            position: { name: 'D1' },
            state: 'unknown',
            pcr_cycles: null,
            submit_for_sequencing: null,
            sub_pool: null,
            coverage: null,
            diluent_volume: null,
            aliquots: [
              {
                type: 'aliquots',
                id: '38486120',
                tag_oligo: 'GGGATCCT',
                tag_index: 1,
                tag2_oligo: 'CCATCCAA',
                tag2_index: 1,
                suboptimal: false,
                study: {
                  type: 'studies',
                  id: '5901',
                  name: 'DTOL_Darwin Tree of Life',
                  uuid: 'cf04ea86-ac82-11e9-8998-68b599768938',
                },
                sample: {
                  type: 'samples',
                  id: '5709176',
                  name: 'DTOL10233357',
                  sanger_sample_id: 'DTOL10233357',
                  uuid: '64f86c9e-a9b0-11eb-991b-fa163eac3af7',
                  control: false,
                  control_type: null,
                  sample_metadata: {
                    type: 'sample_metadata',
                    id: '5707378',
                    sample_common_name: 'Ilex aquifolium',
                    supplier_name: 'FD21635705',
                  },
                },
              },
            ],
          },
          {
            type: 'wells',
            id: '41656871',
            uuid: '7836d336-a73a-11eb-a305-fa163e8a206d',
            name: 'DN803958S:F4',
            position: { name: 'F4' },
            state: 'unknown',
            pcr_cycles: null,
            submit_for_sequencing: null,
            sub_pool: null,
            coverage: null,
            diluent_volume: null,
            aliquots: [],
          },
        ],
      },
    ]
    let transformedPlates, transformedPlate

    describe('for any type of plate', () => {
      beforeEach(() => {
        transformedPlates = transformPlates({ plates })
        transformedPlate = transformedPlates[0]
      })

      it('plate should only have a barcode and wells', () => {
        expect(Object.keys(transformedPlate)).toEqual(['barcode', 'wells'])
        expect(transformedPlate.barcode).toEqual('DN803958S')
        expect(transformedPlate.wells.length).toEqual(3)
      })

      it('wells should have a position and samples', () => {
        let well = transformedPlate.wells[0]
        expect(Object.keys(well)).toEqual(['position', 'samples'])
        expect(well.position).toEqual('A1')
      })

      it('samples will be empty if there arent any', () => {
        expect(transformedPlate.wells[2].samples).not.toBeDefined()
      })
    })

    describe('for an ont plate', () => {
      it('samples should have an id, name and tag', () => {
        transformedPlates = transformPlates({ plates, sampleType: OntSample })
        transformedPlate = transformedPlates[0]
        let sample = transformedPlate.wells[0].samples[0]
        expect(Object.keys(sample)).toEqual(['externalId', 'name', 'tagOligo', 'externalStudyId'])
        expect(sample.externalId).toEqual('64e065a4-a9b0-11eb-991b-fa163eac3af7')
        expect(sample.name).toEqual('DTOL10233354')
        expect(sample.externalStudyId).toEqual('cf04ea86-ac82-11e9-8998-68b599768938')
      })
    })

    describe('for a pacbio plate', () => {
      it('has no library type by default', () => {
        transformedPlates = transformPlates({ plates, sampleType: PacbioSample })
        transformedPlate = transformedPlates[0]
        let sample = transformedPlate.wells[0].samples[0]
        expect(Object.keys(sample)).toEqual([
          'external_id',
          'name',
          'external_study_id',
          'species',
          'library_type',
          'cost_code',
        ])
        expect(sample.external_id).toEqual('64e065a4-a9b0-11eb-991b-fa163eac3af7')
        expect(sample.name).toEqual('DTOL10233354')
        expect(sample.external_study_id).toEqual('cf04ea86-ac82-11e9-8998-68b599768938')
        expect(sample.species).toEqual('Orgyia antiqua')
        expect(sample.library_type).toEqual(null)
        expect(sample.library_type).toEqual(null)
      })

      it('can specify a library type and a cost code', () => {
        transformedPlates = transformPlates({
          plates,
          sampleType: PacbioSample,
          libraryType: 'Example',
          costCode: 'aCostCodeExample',
        })
        transformedPlate = transformedPlates[0]
        let sample = transformedPlate.wells[0].samples[0]
        expect(Object.keys(sample)).toEqual([
          'external_id',
          'name',
          'external_study_id',
          'species',
          'library_type',
          'cost_code',
        ])
        expect(sample.external_id).toEqual('64e065a4-a9b0-11eb-991b-fa163eac3af7')
        expect(sample.name).toEqual('DTOL10233354')
        expect(sample.external_study_id).toEqual('cf04ea86-ac82-11e9-8998-68b599768938')
        expect(sample.species).toEqual('Orgyia antiqua')
        expect(sample.library_type).toEqual('Example')
        expect(sample.cost_code).toEqual('aCostCodeExample')
      })
    })
  })

  describe('#transformTubes', () => {
    let transformedTubes, transformedTube

    const tubes = [
      {
        labware_barcode: {
          machine_barcode: 'a_machine_barcode',
        },
        receptacles: [
          {
            aliquots: [
              {
                study: {
                  uuid: 'aexternal_study_id',
                },
                sample: {
                  name: 'a_sample_name',
                  uuid: 'a_sample_external_id',
                  sample_metadata: {
                    sample_common_name: 'a_species',
                  },
                },
              },
            ],
          },
        ],
      },
    ]

    beforeEach(() => {
      transformedTubes = transformTubes({ tubes })
      transformedTube = transformedTubes[0]
    })

    it('tube should only have a request, sample and tube', () => {
      expect(Object.keys(transformedTube)).toEqual(['request', 'sample', 'tube'])
    })

    it('request should have external_study_id and library_type', () => {
      let request = transformedTube.request
      expect(Object.keys(request)).toEqual(['external_study_id', 'library_type', 'cost_code'])
      expect(request.external_study_id).toEqual('aexternal_study_id')
    })

    it('sample should have name, external_id and species', () => {
      let sample = transformedTube.sample
      expect(Object.keys(sample)).toEqual(['name', 'external_id', 'species'])
      expect(sample.name).toEqual('a_sample_name')
      expect(sample.external_id).toEqual('a_sample_external_id')
      expect(sample.species).toEqual('a_species')
    })

    it('tube should have a barcode', () => {
      let tube = transformedTube.tube
      expect(Object.keys(tube)).toEqual(['barcode'])
      expect(tube.barcode).toEqual('a_machine_barcode')
    })

    describe('libraryType', () => {
      it('allows libraryType to be specified', () => {
        transformedTubes = transformTubes({ tubes, libraryType: 'alibrary_type' })
        transformedTube = transformedTubes[0]

        let request = transformedTube.request
        expect(request.library_type).toEqual('alibrary_type')
      })

      it('libraryType defaults to null', () => {
        let request = transformedTube.request
        expect(request.library_type).not.toBeDefined()
      })
    })

    describe('costCode', () => {
      it('allows costCode to be specified', () => {
        transformedTubes = transformTubes({ tubes, costCode: 'acost_code' })
        transformedTube = transformedTubes[0]

        let request = transformedTube.request
        expect(request.cost_code).toEqual('acost_code')
      })

      it('costCode defaults to null', () => {
        let request = transformedTube.request
        expect(request.cost_code).not.toBeDefined()
      })
    })
  })
})
