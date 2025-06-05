import { fetchLabwareForReception } from '@/lib/receptions/SequencescapeKinnexTubes.js'
import { store } from '@support/testHelper.js'
import SequencescapeKinnexTubeFactory from '@tests/factories/SequencescapeKinnexTubeFactory.js'

describe('SequencescapeKinnexTubes', () => {
  describe('#fetchLabwareForReception', () => {
    const barcodes = ['3980000001795']
    const requests = store.getters.api
    let request

    beforeEach(() => {
      request = vi.spyOn(requests.sequencescape.labware, 'get')
    })

    it('successfully', async () => {
      request.mockResolvedValue(SequencescapeKinnexTubeFactory().responses.fetch)

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
          sample_metadata: 'sample_common_name,supplier_name,date_of_sample_collection,donor_id',
          samples: 'sample_metadata,name,uuid',
          studies: 'uuid',
          tubes: 'labware_barcode,receptacles',
        },
      })

      expect(foundBarcodes).toEqual(new Set(['NT67O']))
      expect(attributes).toEqual({
        source: 'traction-ui.sequencescape',
        tubes_attributes: [
          {
            barcode: 'NT67O',
            request: {
              external_study_id: '3b1cf0ac-4079-11f0-805f-e2df7c04b5f2',
              library_type: 'Example',
              cost_code: 'aCostCodeExample',
            },
            sample: {
              name: 'Supplier A',
              external_id: 'f3e18688-4142-11f0-ac8e-e2df7c04b5f2',
              species: 'human',
              retention_instruction: null,
              date_of_sample_collection: '2023-01-01',
              donor_id: 'Donor 1',
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
