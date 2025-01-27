import PacbioRequestFactory from '@tests/factories/PacbioRequestFactory.js'
import { createRequestPayload } from '@/stores/utilities/pacbioRequests.js'

const pacbioRequestFactory = PacbioRequestFactory({ includeRelationships: false })

describe('pacbioRequests', () => {
  describe('createRequestPayload', () => {
    it('creates the payload for the sample', async () => {
      const sample = pacbioRequestFactory.content.data[0]
      const result = createRequestPayload(sample)
      expect(result.data).toEqual({
        id: sample.id,
        type: 'requests',
        attributes: {
          library_type: sample.library_type,
          estimate_of_gb_required: sample.estimate_of_gb_required,
          number_of_smrt_cells: sample.number_of_smrt_cells,
          cost_code: sample.cost_code,
        },
      })
    })
  })
})
