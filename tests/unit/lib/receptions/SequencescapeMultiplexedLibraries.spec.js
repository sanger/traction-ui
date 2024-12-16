import { fetchLabwareForReception } from '@/lib/receptions/SequencescapeMultiplexedLibraries'
import { store } from '@support/testHelper'
import SequencescapeMultiplexedLibraryFactory from '@tests/factories/SequencescapeMultiplexedLibraryFactory.js'

describe('SequencescapeMultiplexedLibraries', () => {
  describe('#fetchLabwareForReception', () => {
    const barcodes = ['3980000042705']
    const requests = store.getters.api
    let request

    beforeEach(() => {
      request = vi.spyOn(requests.sequencescape.labware, 'get')
    })

    it('successfully', async () => {
      request.mockResolvedValue(SequencescapeMultiplexedLibraryFactory().responses.fetch)

      const { attributes, foundBarcodes } = await fetchLabwareForReception({
        requests,
        barcodes,
        requestOptions: {
          library_type: 'Example',
          cost_code: 'aCostCodeExample',
        },
        libraryOptions: {
          kit_barcode: 'SQK-NBD114.96',
        },
      })

      expect(request).toHaveBeenCalledWith({
        filter: { barcode: barcodes.join(',') },
        include:
          'receptacles.aliquots.library.aliquots.sample.sample_metadata,receptacles.aliquots.library.aliquots.study,receptacles.aliquots.library.aliquots,receptacles.aliquots.library.labware.receptacles',
        fields: {
          tubes: 'labware_barcode,receptacles',
          labware: 'labware_barcode,receptacles',
          receptacles: 'aliquots',
          samples: 'sample_metadata,name,uuid',
          sample_metadata: 'sample_common_name,volume,concentration',
          studies: 'uuid',
          aliquots: 'study,library_type,sample,insert_size_to,tag_oligo',
        },
      })

      expect(foundBarcodes).toEqual(new Set(['NT42F']))
      expect(attributes).toEqual({
        source: 'traction-ui.sequencescape',
        tubes_attributes: [
          {
            barcode: 'NT39K',
            request: {
              cost_code: 'aCostCodeExample',
              external_study_id: 'd8d67198-885a-11ee-87ba-46043cfb1bd9',
              library_type: 'Example',
            },
            sample: {
              external_id: 'cfcc0198-2a3b-11ef-a718-46043cfb1bd9',
              name: '2STDY6',
              species: 'cat',
            },
            library: {
              volume: '10',
              concentration: '20',
              insert_size: 100,
              tag_sequence: 'AATCGTTA',
              kit_barcode: 'SQK-NBD114.96',
            },
          },
          {
            barcode: 'NT40D',
            request: {
              cost_code: 'aCostCodeExample',
              external_study_id: 'd8d67198-885a-11ee-87ba-46043cfb1bd9',
              library_type: 'Example',
            },
            sample: {
              external_id: 'cfe18810-2a3b-11ef-a718-46043cfb1bd9',
              name: '2STDY7',
              species: 'cat',
            },
            library: {
              volume: '10',
              concentration: '20',
              insert_size: 100,
              tag_sequence: 'AATCGGCG',
              kit_barcode: 'SQK-NBD114.96',
            },
          },
          {
            barcode: 'NT41E',
            request: {
              cost_code: 'aCostCodeExample',
              external_study_id: 'd8d67198-885a-11ee-87ba-46043cfb1bd9',
              library_type: 'Example',
            },
            sample: {
              external_id: 'cfe8fb0e-2a3b-11ef-a718-46043cfb1bd9',
              name: '2STDY8',
              species: 'cat',
            },
            library: {
              volume: '10',
              concentration: '20',
              insert_size: 100,
              tag_sequence: 'AATCCGTT',
              kit_barcode: 'SQK-NBD114.96',
            },
          },
        ],
        pool_attributes: {
          barcode: 'NT42F',
          volume: '10',
          concentration: '20',
          insert_size: 100,
          kit_barcode: 'SQK-NBD114.96',
        },
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
