import { fetchLabwareForReception } from '@/lib/receptions/Sequencescape'
import { Data, store } from '@support/testHelper'

describe('Sequencescape', () => {
  describe('#fetchLabwareForReception', () => {
    const barcodes = ['DN9000002A', '3980000001795']
    const failedResponse = {
      data: { errors: [{ title: 'error1', detail: 'There was an error.' }] },
      status: 500,
      statusText: 'Internal Server Error',
    }
    const requests = store.getters.api.v1
    let request

    beforeEach(() => {
      request = vi.spyOn(requests.sequencescape.labware, 'get')
    })

    it('successfully', async () => {
      request.mockResolvedValue(Data.SequencescapeLabware)

      const { attributes, foundBarcodes } = await fetchLabwareForReception({
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

      expect(foundBarcodes).toEqual(new Set(['DN9000002A', '3980000001795']))
      expect(attributes).toEqual({
        source: 'traction-ui.sequencescape',
        plates_attributes: [
          {
            barcode: 'DN9000002A',
            wells_attributes: [
              {
                position: 'A1',
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
              },
              {
                position: 'B1',
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
              },
            ],
          },
        ],
        tubes_attributes: [
          {
            barcode: '3980000001795',
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
          },
        ],
      })
    })

    it('unsuccessfully', async () => {
      request.mockRejectedValue({ response: failedResponse })

      expect(() => fetchLabwareForReception({ requests, barcodes })).rejects.toThrow(
        'There was an error',
      )
    })
  })
})
