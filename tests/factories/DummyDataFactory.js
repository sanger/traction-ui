import BaseFactory from './BaseFactory.js'

const DummyDataFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'cheeses',
        links: {
          self: 'http://pretend.sequencescape/api/v1/cheeses/1',
        },
        attributes: {
          attrA: 'you caught me',
          attrB: 'luv dancing',
        },
        relationships: {
          bean: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/cheeses/1/relationships/bean',
              related: 'http://pretend.sequencescape/api/v1/cheeses/1/bean',
            },
            data: {
              type: 'beans',
              id: '1',
            },
          },
          pickle: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/cheeses/1/relationships/pickle',
              related: 'http://pretend.sequencescape/api/v1/cheeses/1/pickle',
            },
            data: {
              type: 'pickles',
              id: '2',
            },
          },
          chocolates: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/cheeses/1/relationships/chocolates',
              related: 'http://pretend.sequencescape/api/v1/cheeses/1/chocolates',
            },
            data: [
              {
                type: 'chocolates',
                id: '3',
              },
            ],
          },
          peaches: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/cheeses/1/relationships/peaches',
              related: 'http://pretend.sequencescape/api/v1/cheeses/1/peaches',
            },
          },
          mojitos: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/cheeses/1/relationships/mojitos',
              related: 'http://pretend.sequencescape/api/v1/cheeses/1/mojitos',
            },
            data: null,
          },
        },
      },
      {
        id: '2',
        type: 'cheeses',
        links: {
          self: 'http://pretend.sequencescape/api/v1/cheeses/2',
        },
        attributes: {
          attrA: 'wild horses',
          attrB: 'wouldnt drag me away',
        },
        relationships: {
          bean: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/cheeses/2/relationships/bean',
              related: 'http://pretend.sequencescape/api/v1/cheeses/2/bean',
            },
            data: {
              type: 'beans',
              id: '13',
            },
          },
          pickle: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/cheeses/2/relationships/pickle',
              related: 'http://pretend.sequencescape/api/v1/cheeses/2/pickle',
            },
            data: {
              type: 'pickles',
              id: '14',
            },
          },
          chocolates: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/cheeses/2/relationships/chocolates',
              related: 'http://pretend.sequencescape/api/v1/cheeses/2/chocolates',
            },
            data: [
              {
                type: 'chocolates',
                id: '15',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '2',
        type: 'pickles',
        links: {
          self: 'http://pretend.sequencescape/api/v1/pickles/1',
        },
        attributes: {
          attrI: 'I just keep',
          attrJ: 'rolling on',
        },
      },
      {
        id: '3',
        type: 'chocolates',
        links: {
          self: 'http://pretend.sequencescape/api/v1/chocolates/3',
        },
        attributes: {
          attrC: 'can you',
          attrD: 'feel it',
        },
        relationships: {
          crisps: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/chocolates/12/relationships/crisps',
              related: 'http://pretend.sequencescape/api/v1/chocolates/12/crisps',
            },
            data: {
              type: 'crisps',
              id: '100',
            },
          },
        },
      },
      {
        id: '15',
        type: 'chocolates',
        links: {
          self: 'http://pretend.sequencescape/api/v1/chocolates/15',
        },
        attributes: {
          attrC: 'Alan is a',
          attrD: 'cowboy killer',
        },
        relationships: {
          crisps: {
            links: {
              self: 'http://pretend.sequencescape/api/v1/chocolates/15/relationships/crisps',
              related: 'http://pretend.sequencescape/api/v1/chocolates/15/crisps',
            },
            data: {
              type: 'crisps',
              id: '101',
            },
          },
        },
      },
      {
        id: '100',
        type: 'crisps',
        links: {
          self: 'http://pretend.sequencescape/api/v1/crisps/100',
        },
        attributes: {
          attrE: 'Cyber Insekt',
        },
      },
      {
        id: '101',
        type: 'crisps',
        links: {
          self: 'http://pretend.sequencescape/api/v1/crisps/101',
        },
        attributes: {
          attrE: 'Sweet Harmony',
        },
      },
    ],
  }

  return BaseFactory(data)
}

export default DummyDataFactory
