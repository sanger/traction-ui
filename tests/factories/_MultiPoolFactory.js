import BaseFactory from './BaseFactory.js'

const MultiPoolFactory = () => {
  const data = {
    data: [
      {
        id: '3',
        type: 'multi_pools',
        links: {
          self: 'http://localhost:3100/v1/multi_pools/3',
        },
        attributes: {
          pool_method: 'Plate',
          pipeline: 'pacbio',
          number_of_pools: 2,
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool_positions: {
            links: {
              self: 'http://localhost:3100/v1/multi_pools/3/relationships/multi_pool_positions',
              related: 'http://localhost:3100/v1/multi_pools/3/multi_pool_positions',
            },
          },
        },
      },
      {
        id: '2',
        type: 'multi_pools',
        links: { self: 'http://localhost:3100/v1/multi_pools/2' },
        attributes: {
          pool_method: 'Plate',
          pipeline: 'pacbio',
          number_of_pools: 2,
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool_positions: {
            links: {
              self: 'http://localhost:3100/v1/multi_pools/2/relationships/multi_pool_positions',
              related: 'http://localhost:3100/v1/multi_pools/2/multi_pool_positions',
            },
          },
        },
      },
      {
        id: '1',
        type: 'multi_pools',
        links: { self: 'http://localhost:3100/v1/multi_pools/1' },
        attributes: {
          pool_method: 'Plate',
          pipeline: 'pacbio',
          number_of_pools: 2,
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool_positions: {
            links: {
              self: 'http://localhost:3100/v1/multi_pools/1/relationships/multi_pool_positions',
              related: 'http://localhost:3100/v1/multi_pools/1/multi_pool_positions',
            },
          },
        },
      },
    ],
    meta: { page_count: 1 },
    links: {
      first: 'http://localhost:3100/v1/multi_pools?page%5Bnumber%5D=1&page%5Bsize%5D=1000',
      last: 'http://localhost:3100/v1/multi_pools?page%5Bnumber%5D=1&page%5Bsize%5D=1000',
    },
  }
  return { ...BaseFactory(data) }
}

export default MultiPoolFactory
