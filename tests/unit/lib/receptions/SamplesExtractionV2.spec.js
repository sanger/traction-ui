import { labwareForReception } from '@/lib/receptions/SamplesExtractionV2'
import { Data, store } from '@support/testHelper'

describe('SamplesExtraction', () => {
  describe('#labwareForReception', () => {
    const barcodes = ['SE108532I']
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

      const { foundBarcodes, attributes } = await labwareForReception({
        requests,
        barcodes,
        requestOptions: {
          library_type: 'Example',
          cost_code: 'aCostCodeExample',
        },
      })

      expect(request).toHaveBeenCalledWith({
        filter: { barcode: barcodes.join(',') },
      })

      expect(foundBarcodes).toEqual(new Set(['SE108532I']))
      expect(attributes).toEqual({
        source: 'traction-ui.samples-extraction',
        tubes_attributes: [
          {
            barcode: 'SE108532I',
            type: 'tubes',
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
          },
        ],
      })
    })

    it('unsuccessfully', async () => {
      request.mockRejectedValue({ response: failedResponse })

      expect(() => labwareForReception({ requests, barcodes })).rejects.toThrow(
        'There was an error',
      )
    })
  })
})
