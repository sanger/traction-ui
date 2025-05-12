import { fetchLabwareForReception } from '@/lib/receptions/Sequencescape'
import { store } from '@support/testHelper'
import SequencescapeLabwareFactory from '@tests/factories/SequencescapeLabwareFactory.js'

describe('Sequencescape', () => {
  describe('#fetchLabwareForReception', () => {
    const barcodes = ['DN9000002A', '3980000001795']

    const requests = store.getters.api
    let request

    beforeEach(() => {
      request = vi.spyOn(requests.sequencescape.labware, 'get')
    })

    it('successfully', async () => {
      request.mockResolvedValue(SequencescapeLabwareFactory().responses.fetch)

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
          plates: 'labware_barcode,receptacles,retention_instruction',
          receptacles: 'aliquots',
          sample_metadata: 'sample_common_name',
          samples: 'sample_metadata,name,uuid',
          studies: 'uuid',
          tubes: 'labware_barcode,receptacles,retention_instruction',
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
                  retention_instruction: 'destroy_after_2_years',
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
                  retention_instruction: 'destroy_after_2_years',
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
              retention_instruction: 'return_to_customer_after_2_years',
            },
          },
        ],
      })
    })

    it('unsuccessfully', async () => {
      const failedResponse = {
        data: {},
        status: 500,
        json: () =>
          Promise.resolve({
            errors: [{ title: 'error1', detail: 'There was an error.', status: '500' }],
          }),
        ok: false,
        statusText: 'Internal Server Error',
      }
      request.mockResolvedValue(failedResponse)

      await expect(() => fetchLabwareForReception({ requests, barcodes })).rejects.toThrow(
        'There was an error',
      )
    })
  })
})
