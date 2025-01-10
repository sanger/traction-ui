import PacbioSampleFactory from '@tests/factories/PacbioSampleFactory.js'
import { createRequestPayload } from '@/stores/utilities/pacbioRequests.js'

const pacbioSampleFactory = PacbioSampleFactory()

describe('pacbioRequests', () => {
  describe('createRequestPayload', () => {
    it('creates the payload for the sample', async () => {
      const sample = pacbioSampleFactory.content.data.data[0]
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
