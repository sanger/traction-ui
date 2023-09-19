import { labwareForReception } from '@/lib/receptions/SequencescapeV1'
import { Data, store } from '@support/testHelper'

describe('Sequencescape', () => {
  describe('#labwareForReception', () => {
    const barcodes = ['DN9000002A', '3980000001795']
    const emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
    const failedResponse = {
      data: { errors: [{ title: 'error1', detail: 'There was an error.' }] },
      status: 500,
      statusText: 'Internal Server Error',
    }
    const requests = store.getters.api
    let request

    beforeEach(() => {
      request = vi.spyOn(requests.sequencescape.labware, 'get')
    })

    it.only('successfully', async () => {
      request.mockResolvedValue(Data.SequencescapeLabware)

      const { source, requestAttributes, labwareCount } = await labwareForReception({
        requests,
        barcodes,
        requestOptions: {
          library_type: 'Example',
          cost_code: 'aCostCodeExample',
        },
      })

      expect(request).toHaveBeenCalledWith({
        filter: { barcode: barcodes.join(',') },
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

      expect(source).toEqual('sequencescape')
      // this should be 2 but the request contains extra barcodes not used in tests
      expect(labwareCount).toEqual(4)
      expect(requestAttributes).toEqual([
        {
          request: {
            external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
            library_type: 'Example',
            cost_code: 'aCostCodeExample',
          },
          sample: {
            external_id: 'd5008026-94c9-11ec-a9e3-acde48001122',
            name: '2STDY1',
            species: 'Dragon',
          },
          container: { type: 'wells', position: 'A1', barcode: 'DN9000002A' },
        },
        {
          request: {
            external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
            library_type: 'Example',
            cost_code: 'aCostCodeExample',
          },
          sample: {
            external_id: 'd50bad48-94c9-11ec-a9e3-acde48001122',
            name: '2STDY2',
            species: 'Unicorn',
          },
          container: { type: 'wells', position: 'B1', barcode: 'DN9000002A' },
        },
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
          container: { type: 'tubes', barcode: '3980000001795' },
        },
      ])
    })

    it('unsuccessfully', async () => {
      request.mockRejectedValue({ response: failedResponse })

      expect(() => labwareForReception({ requests, barcodes })).rejects.toThrow(
        'There was an error',
      )
    })

    it('when barcodes are missing', async () => {
      request.mockResolvedValue(emptyResponse)

      expect(labwareForReception({ requests, barcodes })).rejects.toThrow(
        'Labware could not be retrieved from Sequencescape: DN9000002A,3980000001795',
      )
    })
  })
})
