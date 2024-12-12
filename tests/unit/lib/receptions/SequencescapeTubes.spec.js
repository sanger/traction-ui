import { fetchLabwareForReception } from '@/lib/receptions/SequencescapeTubes'
import { store } from '@support/testHelper'
import SequencescapeLabwareFactory from '@tests/factories/SequencescapeLabwareFactory.js'

describe('SequencescapeTubes', () => {
  describe('#fetchLabwareForReception', () => {
    const barcodes = ['3980000001795']
    const requests = store.getters.api.v2
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
          receptacles: 'aliquots',
          sample_metadata: 'sample_common_name',
          samples: 'sample_metadata,name,uuid',
          studies: 'uuid',
          tubes: 'labware_barcode,receptacles',
        },
      })

      expect(foundBarcodes).toEqual(new Set(['NT1O']))
      expect(attributes).toEqual({
        source: 'traction-ui.sequencescape',
        tubes_attributes: [
          {
            barcode: 'NT1O',
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
