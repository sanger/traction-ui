import { createRequestPayload } from '@/stores/utilities/ontRequests.js'

describe('ontRequests', () => {
  describe('createRequestPayload', () => {
    it('creates the payload for the request', async () => {
      const request = {
        id: '123',
        sample_name: 'Sample 1',
        library_type: 'ONT_GridIon',
        data_type: 'basecalls',
        cost_code: 'S10000',
        external_study_id: '50ad20f6-2722-434e-b42b-83cec34147f7',
        number_of_flowcells: 1,
        sample_retention_instructions: 'return_to_customer_after_2_years',
        source_identifier: 'TRAC-1:A1',
        created_at: '2023-01-01T00:00:00Z',
      }
      const result = createRequestPayload(request)
      expect(result.data).toEqual({
        id: '123',
        type: 'requests',
        attributes: {
          library_type: request.library_type,
          data_type: request.data_type,
          cost_code: request.cost_code,
          external_study_id: request.external_study_id,
          number_of_flowcells: request.number_of_flowcells,
        },
      })
    })
  })
})
