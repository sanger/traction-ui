import getters from '@/store/traction/pacbio/pools/getters'
import storePools from '@tests/data/StorePools'

const state = storePools

const pools = [
  {
    id: '1',
    type: 'pools',
    barcode: 'TRAC-2-1',
    libraries: [{ id: '1', sample_name: 'Sample48', group_id: 'bc1019', type: 'libraries' }],
  },
  {
    id: '2',
    type: 'pools',
    barcode: 'TRAC-2-2',
    libraries: [
      { id: '2', sample_name: 'Sample47', group_id: 'bc1011_BAK8A_OA', type: 'libraries' },
    ],
  },
]

describe('getters', () => {
  it('"pools" returns denormalized pools from "state.pools"', () => {
    const actual = getters.pools(state)
    expect(actual).toEqual(pools)
  })

  it('"poolByBarcode" returns the pool with the specified barcode from "state.pools"', () => {
    const actual = getters.poolByBarcode(state, { pools: getters.pools(state) })('TRAC-2-1')
    expect(actual).toEqual(pools[0])
  })

  it('"pools" returns pools successfully and with an empty library group_id if that library has no tag', () => {
    state.libraries[1] = { id: '1', request: '1', tag: '', type: 'libraries' }
    const pools = getters.pools(state)
    expect(pools[0].libraries[0].group_id).toEqual(undefined)
  })
})
