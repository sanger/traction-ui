import BaseFactory from './BaseFactory.js'

const PacbioTagSetFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'tag_sets',
        links: {
          self: '/v1/pacbio/tag_sets/1',
        },
        attributes: {
          name: 'Sequel_16_barcodes_v3',
          uuid: '4d87a8ab-4d16-f0b0-77e5-0f467dba442e',
          pipeline: 'pacbio',
        },
        relationships: {
          tags: {
            links: {
              self: '/v1/pacbio/tag_sets/1/relationships/tags',
              related: '/v1/pacbio/tag_sets/1/tags',
            },
            data: [
              {
                type: 'tags',
                id: '3',
              },
              {
                type: 'tags',
                id: '4',
              },
            ],
          },
        },
      },
      {
        id: '6',
        type: 'tag_sets',
        links: {
          self: '/v1/pacbio/tag_sets/6',
        },
        attributes: {
          name: 'IsoSeq_v1',
          uuid: '1e8244b6-dabe-4e88-8b6f-f74ae02f397e',
          pipeline: 'pacbio',
        },
        relationships: {
          tags: {
            links: {
              self: '/v1/pacbio/tag_sets/6/relationships/tags',
              related: '/v1/pacbio/tag_sets/6/tags',
            },
            data: [
              {
                type: 'tags',
                id: '323',
              },
              {
                type: 'tags',
                id: '324',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '3',
        type: 'tags',
        attributes: {
          oligo: 'CACATATCAGAGTGCGT',
          group_id: 'bc1001_BAK8A_OA',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
      {
        id: '4',
        type: 'tags',
        attributes: {
          oligo: 'ACACACAGACTGTGAGT',
          group_id: 'bc1002_BAK8A_OA',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
      {
        id: '323',
        type: 'tags',
        attributes: {
          oligo: 'CACATATCAGAGTGCGGCAATGAAGTCGCAGGGTTG',
          group_id: 'bc1001-F',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '6',
            },
          },
        },
      },
      {
        id: '324',
        type: 'tags',
        attributes: {
          oligo: 'CACATATCAGAGTGCGAAGCAGTGGTATCAACGCAGAGT',
          group_id: 'bc1001-R',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '6',
            },
          },
        },
      },
    ],
  }

  return BaseFactory(data)
}

export default PacbioTagSetFactory
