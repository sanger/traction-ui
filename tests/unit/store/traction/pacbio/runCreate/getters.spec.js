import getters from '@/store/traction/pacbio/runCreate/getters'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import storePools from '@tests/data/StorePools'
import { describe, expect } from 'vitest'

describe('getters.js', () => {
  const {
    smrtLinkVersionList,
    defaultSmrtLinkVersion,
    smrtLinkVersion,
    pools,
    poolByBarcode,
    instrumentNameList,
    getWell,
  } = getters

  // TODO: we probably need to sort the way we create the pools for tests
  const mockPools = [
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

  const smrtLinkVersions = [
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

  describe('smrtLinkVersionList', () => {
    const state = defaultState()
    it('returns a list of smrt link version resources', () => {
      state.resources.smrtLinkVersions = smrtLinkVersions
      expect(smrtLinkVersionList(state)).toEqual(smrtLinkVersions)
    })
  })

  describe('defaultSmrtLinkVersion', () => {
    const state = defaultState()
    it('returns the default SMRT Link Version', () => {
      state.resources.smrtLinkVersions = smrtLinkVersions
      expect(defaultSmrtLinkVersion(state)).toEqual(smrtLinkVersions[0])
    })
  })

  describe('smrtLinkVersion', () => {
    const state = defaultState()
    it('returns the current SMRT Link Version', () => {
      state.smrtLinkVersion = smrtLinkVersions[0]
      expect(smrtLinkVersion(state)).toEqual(smrtLinkVersions[0])
    })
  })

  describe('pools', () => {
    const state = storePools
    it('"pools" returns denormalized pools from "state.pools"', () => {
      expect(pools(state)).toEqual(mockPools)
    })

    it('"poolByBarcode" returns the pool with the specified barcode from "state.pools"', () => {
      const actual = poolByBarcode(state, { pools: pools(state) })('TRAC-2-1')
      expect(actual).toEqual(mockPools[0])
    })

    it('"pools" returns pools successfully and with an empty library group_id if that library has no tag', () => {
      state.libraries[1] = {
        id: '1',
        request: '1',
        tag: '',
        type: 'libraries',
        run_suitability: { ready_for_run: true, errors: [] },
      }
      expect(pools(state)[0].libraries[0].group_id).toEqual(undefined)
    })
  })

  describe('instrumentNameList', () => {
    const state = defaultState()

    it('returns a list of system names', () => {
      expect(instrumentNameList(state)).toEqual(['Revio', 'Sequel IIe'])
    })
  })

  describe('getWell', () => {
    it('will return a well from the state', () => {
      const state = defaultState()
      state.wells = {
        1: {
          A1: {
            id: '1',
            position: 'A1',
          },
        },
      }
      expect(getWell(state)(1, 'A1')).toEqual(state.wells[1].A1)
    })
  })
})
