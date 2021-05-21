import { getPlates, transformPlates } from '@/services/Sequencescape'
import { Data } from '../testHelper'
import Response from '@/api/Response'

const Plates = [
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

describe('SequencescapePlates', () => {
  describe('#getPlates', () => {
    let barcodes, failedResponse, emptyResponse, request, expectedResponse, plates

    beforeEach(() => {
      request = { get: jest.fn() }
      barcodes = 'DN1234567'

      emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
      failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
    })

    it('successfully', async () => {
      request.get.mockReturnValue(Data.SequencescapePlates)

      expectedResponse = new Response(Data.SequencescapePlates)
      let expectedPlates = expectedResponse.deserialize.plates
      let plates = await getPlates(request, barcodes)

      expect(request.get).toHaveBeenCalled()
      expect(plates).toEqual(expectedPlates)
    })

    it('unsuccessfully', async () => {
      request.get.mockReturnValue(failedResponse)

      plates = await getPlates(request, barcodes)

      expect(request.get).toHaveBeenCalled()
      expect(plates).toEqual([])
    })

    it('when no plates exist', async () => {
      request.get.mockReturnValue(emptyResponse)

      plates = await getPlates(request, barcodes)

      expect(request.get).toHaveBeenCalled()
      expect(plates).toEqual([])
    })
  })

  describe('#transformPlates', () => {
    let transformedPlates, transformedPlate

    beforeEach(() => {
      transformedPlates = transformPlates(Plates)
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

    it('samples should have an id, name and tag', () => {
      let sample = transformedPlate.wells[0].samples[0]
      expect(Object.keys(sample)).toEqual(['externalId', 'name', 'tagOligo', 'externalStudyId'])
      expect(sample.externalId).toEqual('64e065a4-a9b0-11eb-991b-fa163eac3af7')
      expect(sample.name).toEqual('DTOL10233354')
      expect(sample.tagOligo).toEqual('GGGATCCT')
      expect(sample.externalStudyId).toEqual('cf04ea86-ac82-11e9-8998-68b599768938')
    })

    it('samples will be empty if there arent any', () => {
      expect(transformedPlate.wells[2].samples).not.toBeDefined()
    })
  })
})
