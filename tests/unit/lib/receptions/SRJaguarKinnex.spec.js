import { fetchLabwareForReception } from '@/lib/receptions/SRJaguarKinnex.js'
import SRJaguarKinnex from '@tests/factories/SRJaguarKinnexFactory.js'
import useRootStore from '@/stores'

describe('SRJaguarKinnex', () => {
  describe('#fetchLabwareForReception', () => {
    const barcodes = ['3980000001795']

    let request, requests

    beforeEach(() => {
      const rootStore = useRootStore()
      requests = rootStore.api
      request = vi.spyOn(requests.sequencescape.labware, 'get')
    })

    it('successfully', async () => {
      request.mockResolvedValue(SRJaguarKinnex().responses.fetch)

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
        compound_sample_tubes_attributes: [
          {
            barcode: 'NT67O',
            request: {
              external_study_id: '3b1cf0ac-4079-11f0-805f-e2df7c04b5f2',
              library_type: 'Example',
              cost_code: 'aCostCodeExample',
            },
            samples: [
              {
                date_of_sample_collection: '2023-01-01',
                donor_id: 'Donor 1',
                external_id: 'f3e18688-4142-11f0-ac8e-e2df7c04b5f2',
                name: 'sample_1_SQPD-9015_A4',
                retention_instruction: null,
                species: 'human',
                supplier_name: 'Supplier A',
              },
              {
                date_of_sample_collection: '2023-01-02',
                donor_id: 'Donor 1',
                external_id: 'f3e372c2-4142-11f0-ac8e-e2df7c04b5f2',
                name: 'sample_2_SQPD-9015_A4',
                retention_instruction: null,
                species: 'human',
                supplier_name: 'Supplier A',
              },
              {
                date_of_sample_collection: '2023-01-03',
                donor_id: 'Donor 1',
                external_id: 'f3e4f250-4142-11f0-ac8e-e2df7c04b5f2',
                name: 'sample_3_SQPD-9015_A4',
                retention_instruction: null,
                species: 'human',
                supplier_name: 'Supplier A',
              },
            ],
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
