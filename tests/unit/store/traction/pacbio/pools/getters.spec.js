import getters from '@/store/traction/pacbio/pools/getters'

const state = {
  pools: {
    '1': { id: '1', libraries: ['1'], tubes: ['1'], type: 'pools' },
    '2': { id: '2', libraries: ['2'], tubes: ['2'], type: 'pools' },
  },
  tubes: {
    '1': { barcode: 'TRAC-2-1', id: '1', type: 'tubes' },
    '2': { barcode: 'TRAC-2-2', id: '2', type: 'tubes' },
  },
  libraries: {
    '1': { id: '1', requests: ['1'], tags: ['26'], type: 'libraries' },
    '2': { id: '2', requests: ['2'], tags: ['7'], type: 'libraries' },
  },
  tags: {
    '26': { group_id: 'bc1019', id: '26', type: 'tags' },
    '7': { group_id: 'bc1011_BAK8A_OA', id: '7', type: 'tags' },
  },
  requests: {
    '1': { id: '1', sample_name: 'Sample48', type: 'requests' },
    '2': { id: '2', sample_name: 'Sample47', type: 'requests' },
  },
}

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
})
