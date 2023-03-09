import getters from '@/store/traction/pacbio/runCreate/getters'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import storePools from '@tests/data/StorePools'
import { describe } from 'vitest'

describe('getters.js', () => {
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
          type: 'libraries',
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
          type: 'libraries',
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

  describe('smrtLinkVersionList', () => {
    const state = defaultState()
    const { smrtLinkVersionList } = getters
    it('returns a list of smrt link version resources', () => {
      const expected = [
        {
          id: '1',
          version: 'v1',
          default: true,
        },
        {
          id: '2',
          version: 'v2',
          default: false,
        },
      ]
      state.resources.smrtLinkVersions = expected
      expect(smrtLinkVersionList(state)).toEqual(expected)
    })
  })

  describe('pools', () => {
    const state = storePools
    it('"pools" returns denormalized pools from "state.pools"', () => {
      const actual = getters.pools(state)
      expect(actual).toEqual(pools)
    })

    it('"poolByBarcode" returns the pool with the specified barcode from "state.pools"', () => {
      const actual = getters.poolByBarcode(state, { pools: getters.pools(state) })('TRAC-2-1')
      expect(actual).toEqual(pools[0])
    })

    it('"pools" returns pools successfully and with an empty library group_id if that library has no tag', () => {
      state.libraries[1] = {
        id: '1',
        request: '1',
        tag: '',
        type: 'libraries',
        run_suitability: { ready_for_run: true, errors: [] },
      }
      const pools = getters.pools(state)
      expect(pools[0].libraries[0].group_id).toEqual(undefined)
    })
  })
})
