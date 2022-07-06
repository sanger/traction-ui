import { labwareForReception } from '@/lib/receptions/SamplesExtraction'

import { Data, store } from '@support/testHelper'

describe('SamplesExtraction', () => {
  describe('#labwareForReception', () => {
    const barcodes = ['SE108532I']
    const emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
    const failedResponse = {
      data: { errors: [{ title: 'error1', detail: 'There was an error.' }] },
      status: 500,
      statusText: 'Internal Server Error',
    }
    let request
    const requests = store.getters.api

    beforeEach(() => {
      request = vi.spyOn(requests.sampleExtraction.assets, 'get')
    })

    it('successfully', async () => {
      request.mockResolvedValue(Data.SampleExtractionTubesWithSample)

      const { source, requestAttributes } = await labwareForReception({
        requests,
        barcodes,
        libraryType: 'Example',
        costCode: 'aCostCodeExample',
      })

      expect(request).toHaveBeenCalledWith({
        filter: { barcode: barcodes.join(',') },
      })

      expect(source).toEqual('samples-extraction')
      expect(requestAttributes).toEqual([
        {
          request: {
            external_study_id: '123456-e8f3-11e9-9231-68b59977951e',
            library_type: 'Example',
            cost_code: 'aCostCodeExample',
          },
          sample: {
            external_id: '4008d13c-e8f3-11e9-9231-68b59977951e',
            name: '5200STDY7323048',
            species: 'Homo sapiens',
          },
          container: { type: 'tubes', barcode: 'SE108532I' },
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
        'Labware could not be retrieved from Samples Extraction: SE108532I',
      )
    })
  })
})
