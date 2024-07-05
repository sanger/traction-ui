import * as Actions from '@/store/traction/pacbio/plates/actions'
import PacbioPlatesRequestFactory from '@tests/factories/PacbioPlatesRequestFactory'

const pacbioPlatesRequestFactory = PacbioPlatesRequestFactory()

describe('Pacbio plates actions', () => {
  let commit, get, getters, failedResponse, expectedPlates

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { getPlates: { get: get } }

    expectedPlates = pacbioPlatesRequestFactory.content.data

    failedResponse = {
      data: { data: { errors: { error1: ['There was an error'] } } },
      status: 500,
      statusText: 'Internal Server Error',
    }
  })

  describe('setPlates', () => {
    it('fetches the plates from the service, and commits them', async () => {
      get.mockReturnValue(pacbioPlatesRequestFactory.responses.axios)
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

  describe('findPlate', () => {
    it('fetches the plate from the service, and returns it with wells and requests', async () => {
      get.mockReturnValue(pacbioPlatesRequestFactory.responses.axios)
      const expectedPlate = {
        id: '61',
        barcode: 'DN814327C',
        created_at: '2021/06/03 06:59',
        wells: [
          {
            position: 'A1',
            requests: [
              {
                id: '40',
                library_type: null,
                estimate_of_gb_required: null,
                number_of_smrt_cells: null,
                cost_code: null,
                external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
                sample_name: 'sample_DN814327C_A1',
                barcode: null,
                sample_species: 'human',
                created_at: '2021/06/03 06:59',
                source_identifier: 'DN814327C:A1',
              },
            ],
          },
          {
            position: 'A2',
            requests: [
              {
                id: '41',
                library_type: null,
                estimate_of_gb_required: null,
                number_of_smrt_cells: null,
                cost_code: null,
                external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
                sample_name: 'sample_DN814327C_A2',
                barcode: null,
                sample_species: 'human',
                created_at: '2021/06/03 06:59',
                source_identifier: 'DN814327C:A2',
              },
            ],
          },
        ],
      }
      // Barcode provided is first plate in Data.PacbioPlatesRequest
      const plate = await Actions.findPlate({ commit, getters }, { barcode: 'DN814327C' })

      expect(plate).toEqual(expectedPlate)
    })

    it('errors fetching the plate', async () => {
      get.mockRejectedValue({ response: failedResponse })

      // Barcode provided is first plate in Data.PacbioPlatesRequest
      const plate = await Actions.findPlate({ commit, getters }, { barcode: 'DN814327C' })

      expect(plate).toEqual({})
    })
  })
})
