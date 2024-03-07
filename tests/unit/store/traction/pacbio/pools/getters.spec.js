import getters from '@/store/traction/pacbio/pools/getters'
import { Data } from '@support/testHelper.js'

const state = Data.StorePoolsV1

const pools = [
  {
    id: '1',
    type: 'pools',
    barcode: 'TRAC-2-1',
    libraries: [
      {
        id: '1',
        sample_name: 'Sample48',
        group_id: 'bc1019',
        type: 'library_pools',
        run_suitability: {
          ready_for_run: true,
          errors: [],
        },
      },
    ],
    tube: '1',
    volume: 1.0,
    concentration: 1.0,
    template_prep_kit_box_barcode: 'LK12345',
    insert_size: 100,
    source_identifier: 'DN1:A1',
    created_at: '2021-07-15T15:26:29.000Z',
    updated_at: '2021-07-15T15:26:29.000Z',
    run_suitability: {
      ready_for_run: true,
      errors: [],
      formattedErrors: [],
    },
  },
  {
    id: '2',
    type: 'pools',
    barcode: 'TRAC-2-2',
    libraries: [
      {
        id: '2',
        sample_name: 'Sample47',
        group_id: 'bc1011_BAK8A_OA',
        type: 'library_pools',
        run_suitability: {
          ready_for_run: false,
          errors: [
            {
              title: "can't be blank",
              detail: "insert_size - can't be blank",
              code: '100',
              source: {
                pointer: '/data/attributes/insert_size',
              },
            },
          ],
        },
      },
    ],
    tube: '2',
    volume: 1.0,
    concentration: 1.0,
    template_prep_kit_box_barcode: 'LK12345',
    insert_size: null,
    source_identifier: 'DN1:B1',
    created_at: '2021-07-15T15:26:29.000Z',
    updated_at: '2021-07-15T15:26:29.000Z',
    run_suitability: {
      ready_for_run: false,
      formattedErrors: [
        "Pool insert_size - can't be blank",
        'Pool libraries - is invalid',
        "Library 2 (Sample47) insert_size - can't be blank",
      ],
      errors: [
        {
          title: "can't be blank",
          detail: "insert_size - can't be blank",
          code: '100',
          source: {
            pointer: '/data/attributes/insert_size',
          },
        },
        {
          title: 'is invalid',
          detail: 'libraries - is invalid',
          code: '100',
          source: {
            pointer: '/data/relationships/libraries',
          },
        },
      ],
    },
  },
]

describe('getters', () => {
  it('"pools" returns denormalized pools from "state.pools"', () => {
    const actual = getters.pools(state)
    expect(actual).toEqual(pools)
  })

  it('"pools" returns pools successfully and with an empty library group_id if that library has no tag', () => {
    state.libraries[1] = {
      id: '1',
      request: '1',
      tag: '',
      type: 'library_pools',
      run_suitability: { ready_for_run: true, errors: [] },
    }
    const pools = getters.pools(state)
    expect(pools[0].libraries[0].group_id).toEqual(undefined)
  })
})
