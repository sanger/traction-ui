import getters from '@/store/traction/pacbio/requests/getters'

let requests

describe('getters', () => {
  it('"requests" returns "state.requests"', () => {
    requests = {
      40: {
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
      41: {
        id: '41',
        library_type: null,
        estimate_of_gb_required: null,
        number_of_smrt_cells: null,
        cost_code: null,
        external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b036',
        sample_name: 'sample_DN814327C_A2',
        barcode: null,
        sample_species: 'human',
        created_at: '2021/06/03 06:59',
        source_identifier: 'DN814327C:A2',
      },
    }
    const state = {
      requests: requests,
    }
    expect(getters.requests(state)).toStrictEqual(Object.values(requests))
  })
})
