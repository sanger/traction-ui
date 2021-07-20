import { Data } from 'testHelper'
import mutations from '@/store/traction/pacbio/pools/mutations'

let state

const { data: pools, included } = Data.TractionPacbioPools.data
const tubes = included.slice(0, 2)
const libraries = included.slice(2, 4)
const tags = included.slice(4, 6)
const requests = included.slice(6, 8)

describe('mutations', () => {
  it('"setPools" sets "state.pools" to the given pools', () => {
    state = {
      pools: {},
    }
    mutations.setPools(state, pools)
    expect(state.pools).toEqual({
      '1': { id: '1', libraries: ['1'], tubes: ['1'], type: 'pools' },
      '2': { id: '2', libraries: ['2'], tubes: ['2'], type: 'pools' },
    })
  })

  it('"setTubes" sets "state.tubes" to the given tubes', () => {
    state = {
      tubes: {},
    }
    mutations.setTubes(state, tubes)
    expect(state.tubes).toEqual({
      '1': { barcode: 'TRAC-2-1', id: '1', type: 'tubes' },
      '2': { barcode: 'TRAC-2-2', id: '2', type: 'tubes' },
    })
  })

  it('"setLibraries" sets "state.libraries" to the given libraries', () => {
    state = {
      libraries: {},
    }
    mutations.setLibraries(state, libraries)
    expect(state.libraries).toEqual({
      '1': {
        concentration: 1,
        created_at: '2021/07/15 15:26',
        deactivated_at: null,
        fragment_size: 100,
        id: '1',
        pools: ['1'],
        requests: ['1'],
        source_identifier: 'DN1:A1',
        state: 'pending',
        tags: ['26'],
        template_prep_kit_box_barcode: 'LK12345',
        type: 'libraries',
        volume: 1,
      },
      '2': {
        concentration: 1,
        created_at: '2021/07/15 15:26',
        deactivated_at: null,
        fragment_size: 100,
        id: '2',
        pools: ['2'],
        requests: ['2'],
        source_identifier: 'DN1:A2',
        state: 'pending',
        tags: ['7'],
        template_prep_kit_box_barcode: 'LK12345',
        type: 'libraries',
        volume: 1,
      },
    })
  })

  it('"setTags" sets "state.tags" to the given tags', () => {
    state = {
      tags: {},
    }
    mutations.setTags(state, tags)
    expect(state.tags).toEqual({
      '26': { group_id: 'bc1019', id: '26', oligo: 'ACACACTCTATCAGAT', type: 'tags' },
      '7': { group_id: 'bc1011_BAK8A_OA', id: '7', oligo: 'CTATACGTATATCTATT', type: 'tags' },
    })
  })

  it('"setRequests" sets "state.requests" to the given requests', () => {
    state = {
      requests: {},
    }
    mutations.setRequests(state, requests)
    expect(state.requests).toEqual({
      '1': {
        barcode: null,
        cost_code: 'PSD1234',
        created_at: '2021/07/15 15:26',
        estimate_of_gb_required: 100,
        external_study_id: '1',
        id: '1',
        library_type: 'library_type_1',
        number_of_smrt_cells: 3,
        sample_name: 'Sample48',
        sample_species: 'human',
        source_identifier: 'DN1:A1',
        type: 'requests',
      },
      '2': {
        barcode: null,
        cost_code: 'PSD1234',
        created_at: '2021/07/15 15:26',
        estimate_of_gb_required: 100,
        external_study_id: '1',
        id: '2',
        library_type: 'library_type_1',
        number_of_smrt_cells: 3,
        sample_name: 'Sample47',
        sample_species: 'human',
        source_identifier: 'DN1:A2',
        type: 'requests',
      },
    })
  })
})
