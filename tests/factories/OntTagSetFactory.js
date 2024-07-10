import BaseFactory from './BaseFactory.js'

const OntTagSetFactory = () => {
  const data = {
    data: [
      {
        id: '8',
        type: 'tag_sets',
        links: {
          self: 'http://localhost:3100/v1/ont/tag_sets/8',
        },
        attributes: {
          name: 'ONT_native',
          uuid: null,
          pipeline: 'ont',
        },
        relationships: {
          tags: {
            links: {
              self: 'http://localhost:3100/v1/ont/tag_sets/8/relationships/tags',
              related: 'http://localhost:3100/v1/ont/tag_sets/8/tags',
            },
            data: [
              {
                type: 'tags',
                id: '385',
              },
              {
                type: 'tags',
                id: '386',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '385',
        type: 'tags',
        attributes: {
          oligo: 'CACAAAGACACCGACAACTTTCTT',
          groupId: 'NB01',
        },
        relationships: {
          tagSet: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
      {
        id: '386',
        type: 'tags',
        attributes: {
          oligo: 'ACAGACGACTACAAACGGAATCGA',
          groupId: 'NB02',
        },
        relationships: {
          tagSet: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
    ],
  }

  return BaseFactory(data)
}

export default OntTagSetFactory
