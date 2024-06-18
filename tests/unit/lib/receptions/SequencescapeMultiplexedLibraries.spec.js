import { fetchLabwareForReception } from '@/lib/receptions/SequencescapeMultiplexedLibraries'
import { Data, store } from '@support/testHelper'

describe('SequencescapeMultiplexedLibraries', () => {
  describe('#fetchLabwareForReception', () => {
    const barcodes = ['3980000042705']
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
      request.mockResolvedValue(Data.SequencescapeMultiplexedLibrary)

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
              kit_barcode: 'kit_barcode',
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
              kit_barcode: 'kit_barcode',
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
              kit_barcode: 'kit_barcode',
            },
          },
        ],
        pool_attributes: {
          barcode: 'NT42F',
          volume: '10',
          concentration: '20',
          insert_size: 100,
          kit_barcode: 'kit_barcode',
        },
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
