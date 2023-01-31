import { Data } from '@support/testHelper'
import * as Actions from '@/store/traction/pacbio/plates/actions'

describe('#createPlateInTraction', () => {
  let commit, get, getters, failedResponse, expectedPlates

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { getPlates: { get: get } }
    expectedPlates = [
      {
        barcode: 'DN814327C',
        created_at: '2021/06/03 06:59',
        id: '61',
        wells: [
          {
            position: 'A1',
            requests: [
              {
                barcode: null,
                cost_code: null,
                created_at: '2021/06/03 06:59',
                estimate_of_gb_required: null,
                external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
                id: '40',
                library_type: null,
                number_of_smrt_cells: null,
                sample_name: 'sample_DN814327C_A1',
                sample_species: 'human',
                source_identifier: 'DN814327C:A1',
              },
            ],
          },
          {
            position: 'A2',
            requests: [
              {
                barcode: null,
                cost_code: null,
                created_at: '2021/06/03 06:59',
                estimate_of_gb_required: null,
                external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
                id: '41',
                library_type: null,
                number_of_smrt_cells: null,
                sample_name: 'sample_DN814327C_A2',
                sample_species: 'human',
                source_identifier: 'DN814327C:A2',
              },
            ],
          },
        ],
      },
      {
        barcode: 'DN814567Q',
        created_at: '2021/06/03 14:57',
        id: '62',
        wells: [
          {
            position: 'A1',
            requests: [
              {
                barcode: null,
                cost_code: null,
                created_at: '2021/06/03 14:57',
                estimate_of_gb_required: null,
                external_study_id: 'd160363e-ba2e-11e7-b4cc-68b599768938',
                id: '136',
                library_type: null,
                number_of_smrt_cells: null,
                sample_name: '5049STDY8152829',
                sample_species: 'human',
                source_identifier: 'DN814567Q:A1',
              },
            ],
          },
          {
            position: 'B1',
            requests: [
              {
                barcode: null,
                cost_code: null,
                created_at: '2021/06/03 14:57',
                estimate_of_gb_required: null,
                external_study_id: 'd160363e-ba2e-11e7-b4cc-68b599768938',
                id: '137',
                library_type: null,
                number_of_smrt_cells: null,
                sample_name: '5049STDY8152830',
                sample_species: 'cat',
                source_identifier: 'DN814567Q:B1',
              },
            ],
          },
        ],
      },
    ]
    failedResponse = {
      data: { data: { errors: { error1: ['There was an error'] } } },
      status: 500,
      statusText: 'Internal Server Error',
    }
  })

  describe('setPlates', () => {
    it('fetches the plates from the service, and commits them', async () => {
      get.mockReturnValue(Data.PacbioPlatesRequest)
      const { success, errors } = await Actions.setPlates({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setPlates', expectedPlates)
      expect(success).toEqual(true)
      expect(errors).toEqual([])
    })

    it('errors fetching the plates', async () => {
      get.mockRejectedValue({ response: failedResponse })

      const { success, errors } = await Actions.setPlates({ commit, getters })

      expect(commit).not.toHaveBeenCalled()
      expect(success).toEqual(false)
      expect(errors).toEqual('error1 There was an error')
    })
  })
})
