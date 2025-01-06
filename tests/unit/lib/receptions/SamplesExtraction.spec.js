import { fetchLabwareForReception } from '@/lib/receptions/SamplesExtraction'
import { store } from '@support/testHelper'
import SamplesExtractionLabwareFactory from '@tests/factories/SamplesExtractionLabwareFactory.js'

describe('SamplesExtraction', () => {
  describe('#fetchLabwareForReception', () => {
    const barcodes = ['SE108532I']
    let request
    const requests = store.getters.api

    beforeEach(() => {
      request = vi.spyOn(requests.sampleExtraction.assets, 'get')
    })

    it('successfully', async () => {
      request.mockResolvedValue(SamplesExtractionLabwareFactory().responses.fetch)

      const { foundBarcodes, attributes } = await fetchLabwareForReception({
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
