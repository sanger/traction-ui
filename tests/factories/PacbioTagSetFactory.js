import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from './../../src/api/JsonApi'

/**
 * @param {Object} data
 * @returns {Object} { tagSets, tags, selected { tagSet, tag}}
 * creates some store data for use in tests
 */
const createStoreData = (data) => {
  const tagSets = dataToObjectById({ data: data.data, includeRelationships: true })
  const tags = dataToObjectById({ data: data.included })
  const tagSet = Object.values(tagSets)[0]

  return {
    tagSets,
    tags,
    // useful for select tagSets and an associated tag
    selected: {
      tagSet,
      tag: tags[tagSet.tags[0]],
      tags: {
        all: tagSet.tags.map((id) => tags[id]),
        first: (n = 1) => tagSet.tags.slice(0, n).map((id) => tags[id]),
      },
    },
    findTagSetByName: (name) => Object.values(tagSets).find((ts) => ts.name === name)
  }
}

/*
 * Factory for creating a list of tag set
 * @returns a base factory object with the tag set data
 */
const PacbioTagSetFactory = () => {
  const data = {
    data: [
      {
        id: '7',
        type: 'tag_sets',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tag_sets/7',
        },
        attributes: {
          name: 'Pacbio_96_barcode_plate_v3',
          uuid: '7a7f33e6-4912-4505-0d1e-3ceef7c93695',
          pipeline: 'pacbio',
        },
        relationships: {
          tags: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tag_sets/7/relationships/tags',
              related: 'http://localhost:3100/v1/pacbio/tag_sets/7/tags',
            },
            data: [
              {
                type: 'tags',
                id: '289',
              },
              {
                type: 'tags',
                id: '290',
              },
              {
                type: 'tags',
                id: '291',
              },
              {
                type: 'tags',
                id: '292',
              },
              {
                type: 'tags',
                id: '293',
              },
              {
                type: 'tags',
                id: '294',
              },
              {
                type: 'tags',
                id: '295',
              },
              {
                type: 'tags',
                id: '296',
              },
              {
                type: 'tags',
                id: '297',
              },
              {
                type: 'tags',
                id: '298',
              },
              {
                type: 'tags',
                id: '299',
              },
              {
                type: 'tags',
                id: '300',
              },
              {
                type: 'tags',
                id: '301',
              },
              {
                type: 'tags',
                id: '302',
              },
              {
                type: 'tags',
                id: '303',
              },
              {
                type: 'tags',
                id: '304',
              },
              {
                type: 'tags',
                id: '305',
              },
              {
                type: 'tags',
                id: '306',
              },
              {
                type: 'tags',
                id: '307',
              },
              {
                type: 'tags',
                id: '308',
              },
              {
                type: 'tags',
                id: '309',
              },
              {
                type: 'tags',
                id: '310',
              },
              {
                type: 'tags',
                id: '311',
              },
              {
                type: 'tags',
                id: '312',
              },
              {
                type: 'tags',
                id: '313',
              },
              {
                type: 'tags',
                id: '314',
              },
              {
                type: 'tags',
                id: '315',
              },
              {
                type: 'tags',
                id: '316',
              },
              {
                type: 'tags',
                id: '317',
              },
              {
                type: 'tags',
                id: '318',
              },
              {
                type: 'tags',
                id: '319',
              },
              {
                type: 'tags',
                id: '320',
              },
              {
                type: 'tags',
                id: '321',
              },
              {
                type: 'tags',
                id: '322',
              },
              {
                type: 'tags',
                id: '323',
              },
              {
                type: 'tags',
                id: '324',
              },
              {
                type: 'tags',
                id: '325',
              },
              {
                type: 'tags',
                id: '326',
              },
              {
                type: 'tags',
                id: '327',
              },
              {
                type: 'tags',
                id: '328',
              },
              {
                type: 'tags',
                id: '329',
              },
              {
                type: 'tags',
                id: '330',
              },
              {
                type: 'tags',
                id: '331',
              },
              {
                type: 'tags',
                id: '332',
              },
              {
                type: 'tags',
                id: '333',
              },
              {
                type: 'tags',
                id: '334',
              },
              {
                type: 'tags',
                id: '335',
              },
              {
                type: 'tags',
                id: '336',
              },
              {
                type: 'tags',
                id: '337',
              },
              {
                type: 'tags',
                id: '338',
              },
              {
                type: 'tags',
                id: '339',
              },
              {
                type: 'tags',
                id: '340',
              },
              {
                type: 'tags',
                id: '341',
              },
              {
                type: 'tags',
                id: '342',
              },
              {
                type: 'tags',
                id: '343',
              },
              {
                type: 'tags',
                id: '344',
              },
              {
                type: 'tags',
                id: '345',
              },
              {
                type: 'tags',
                id: '346',
              },
              {
                type: 'tags',
                id: '347',
              },
              {
                type: 'tags',
                id: '348',
              },
              {
                type: 'tags',
                id: '349',
              },
              {
                type: 'tags',
                id: '350',
              },
              {
                type: 'tags',
                id: '351',
              },
              {
                type: 'tags',
                id: '352',
              },
              {
                type: 'tags',
                id: '353',
              },
              {
                type: 'tags',
                id: '354',
              },
              {
                type: 'tags',
                id: '355',
              },
              {
                type: 'tags',
                id: '356',
              },
              {
                type: 'tags',
                id: '357',
              },
              {
                type: 'tags',
                id: '358',
              },
              {
                type: 'tags',
                id: '359',
              },
              {
                type: 'tags',
                id: '360',
              },
              {
                type: 'tags',
                id: '361',
              },
              {
                type: 'tags',
                id: '362',
              },
              {
                type: 'tags',
                id: '363',
              },
              {
                type: 'tags',
                id: '364',
              },
              {
                type: 'tags',
                id: '365',
              },
              {
                type: 'tags',
                id: '366',
              },
              {
                type: 'tags',
                id: '367',
              },
              {
                type: 'tags',
                id: '368',
              },
              {
                type: 'tags',
                id: '369',
              },
              {
                type: 'tags',
                id: '370',
              },
              {
                type: 'tags',
                id: '371',
              },
              {
                type: 'tags',
                id: '372',
              },
              {
                type: 'tags',
                id: '373',
              },
              {
                type: 'tags',
                id: '374',
              },
              {
                type: 'tags',
                id: '375',
              },
              {
                type: 'tags',
                id: '376',
              },
              {
                type: 'tags',
                id: '377',
              },
              {
                type: 'tags',
                id: '378',
              },
              {
                type: 'tags',
                id: '379',
              },
              {
                type: 'tags',
                id: '380',
              },
              {
                type: 'tags',
                id: '381',
              },
              {
                type: 'tags',
                id: '382',
              },
              {
                type: 'tags',
                id: '383',
              },
              {
                type: 'tags',
                id: '384',
              },
            ],
          },
        },
      },
      {
        id: '8',
        type: 'tag_sets',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tag_sets/8',
        },
        attributes: {
          name: 'MAS_SMRTbell_barcoded_adapters_(v2)',
          uuid: 'd5109545-7f84-97b7-6ab6-ce2ca778e1f5',
          pipeline: 'pacbio',
        },
        relationships: {
          tags: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tag_sets/8/relationships/tags',
              related: 'http://localhost:3100/v1/pacbio/tag_sets/8/tags',
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
              {
                type: 'tags',
                id: '387',
              },
              {
                type: 'tags',
                id: '388',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '289',
        type: 'tags',
        attributes: {
          oligo: 'ATCGTGCGACGAGTAT',
          group_id: 'bc2001',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '290',
        type: 'tags',
        attributes: {
          oligo: 'TGCATGTCATGAGTAT',
          group_id: 'bc2002',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '291',
        type: 'tags',
        attributes: {
          oligo: 'ACGAGTGCTCGAGTAT',
          group_id: 'bc2003',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '292',
        type: 'tags',
        attributes: {
          oligo: 'TGCAGTGCTCGAGTAT',
          group_id: 'bc2004',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '293',
        type: 'tags',
        attributes: {
          oligo: 'TGACTCGATCGAGTAT',
          group_id: 'bc2005',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '294',
        type: 'tags',
        attributes: {
          oligo: 'CATGCGATCTGAGTAT',
          group_id: 'bc2006',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '295',
        type: 'tags',
        attributes: {
          oligo: 'ACTAGCATCTGAGTAT',
          group_id: 'bc2007',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '296',
        type: 'tags',
        attributes: {
          oligo: 'ACGCTAGTCTGAGTAT',
          group_id: 'bc2008',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '297',
        type: 'tags',
        attributes: {
          oligo: 'CGATCGCACTGAGTAT',
          group_id: 'bc2009',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '298',
        type: 'tags',
        attributes: {
          oligo: 'TACGTAGTATGAGTAT',
          group_id: 'bc2010',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '299',
        type: 'tags',
        attributes: {
          oligo: 'CTGACAGTACGAGTAT',
          group_id: 'bc2011',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '300',
        type: 'tags',
        attributes: {
          oligo: 'TCGTACTACTGAGTAT',
          group_id: 'bc2012',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '301',
        type: 'tags',
        attributes: {
          oligo: 'CTGCGTAGACGAGTAT',
          group_id: 'bc2013',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '302',
        type: 'tags',
        attributes: {
          oligo: 'ATACATGCACGAGTAT',
          group_id: 'bc2014',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '303',
        type: 'tags',
        attributes: {
          oligo: 'CGACATAGATGAGTAT',
          group_id: 'bc2015',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '304',
        type: 'tags',
        attributes: {
          oligo: 'ATCTGCACGTGAGTAT',
          group_id: 'bc2016',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '305',
        type: 'tags',
        attributes: {
          oligo: 'CTATGATAGCGAGTAT',
          group_id: 'bc2017',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '306',
        type: 'tags',
        attributes: {
          oligo: 'CGATCAGTGCGAGTAT',
          group_id: 'bc2018',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '307',
        type: 'tags',
        attributes: {
          oligo: 'CGTCATAGTCGAGTAT',
          group_id: 'bc2019',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '308',
        type: 'tags',
        attributes: {
          oligo: 'ACTATGCGTCGAGTAT',
          group_id: 'bc2020',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '309',
        type: 'tags',
        attributes: {
          oligo: 'CGTACATGCTGAGTAT',
          group_id: 'bc2021',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '310',
        type: 'tags',
        attributes: {
          oligo: 'TCATCGACGTGAGTAT',
          group_id: 'bc2022',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '311',
        type: 'tags',
        attributes: {
          oligo: 'TCGCATGACTGAGTAT',
          group_id: 'bc2023',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '312',
        type: 'tags',
        attributes: {
          oligo: 'CATGATCGACGAGTAT',
          group_id: 'bc2024',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '313',
        type: 'tags',
        attributes: {
          oligo: 'ACGCACGTACGAGTAT',
          group_id: 'bc2025',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '314',
        type: 'tags',
        attributes: {
          oligo: 'CAGTAGCGTCGAGTAT',
          group_id: 'bc2026',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '315',
        type: 'tags',
        attributes: {
          oligo: 'TGACTGTAGCGAGTAT',
          group_id: 'bc2027',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '316',
        type: 'tags',
        attributes: {
          oligo: 'ACTGCAGCACGAGTAT',
          group_id: 'bc2028',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '317',
        type: 'tags',
        attributes: {
          oligo: 'TAGCAGTATCGAGTAT',
          group_id: 'bc2029',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '318',
        type: 'tags',
        attributes: {
          oligo: 'CATACAGCATGAGTAT',
          group_id: 'bc2030',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '319',
        type: 'tags',
        attributes: {
          oligo: 'ATAGCGTACTGAGTAT',
          group_id: 'bc2031',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '320',
        type: 'tags',
        attributes: {
          oligo: 'ATAGACGAGTGAGTAT',
          group_id: 'bc2032',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '321',
        type: 'tags',
        attributes: {
          oligo: 'CGACTCGTATGAGTAT',
          group_id: 'bc2033',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '322',
        type: 'tags',
        attributes: {
          oligo: 'TACTAGTGACGAGTAT',
          group_id: 'bc2034',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '323',
        type: 'tags',
        attributes: {
          oligo: 'CAGCTGACATGAGTAT',
          group_id: 'bc2035',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '324',
        type: 'tags',
        attributes: {
          oligo: 'ACGTCGCTGCGAGTAT',
          group_id: 'bc2036',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '325',
        type: 'tags',
        attributes: {
          oligo: 'CAGTATGAGCGAGTAT',
          group_id: 'bc2037',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '326',
        type: 'tags',
        attributes: {
          oligo: 'TCACGACGACGAGTAT',
          group_id: 'bc2038',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '327',
        type: 'tags',
        attributes: {
          oligo: 'CATGTATGTCGAGTAT',
          group_id: 'bc2039',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '328',
        type: 'tags',
        attributes: {
          oligo: 'TGCTGCGACTGAGTAT',
          group_id: 'bc2040',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '329',
        type: 'tags',
        attributes: {
          oligo: 'TATGATCACTGAGTAT',
          group_id: 'bc2041',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '330',
        type: 'tags',
        attributes: {
          oligo: 'TCTGCACTGCGAGTAT',
          group_id: 'bc2042',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '331',
        type: 'tags',
        attributes: {
          oligo: 'ACGATGACGTGAGTAT',
          group_id: 'bc2043',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '332',
        type: 'tags',
        attributes: {
          oligo: 'CGATGATGCTGAGTAT',
          group_id: 'bc2044',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '333',
        type: 'tags',
        attributes: {
          oligo: 'TACGACAGTCGAGTAT',
          group_id: 'bc2045',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '334',
        type: 'tags',
        attributes: {
          oligo: 'ATAGCATGTCGAGTAT',
          group_id: 'bc2046',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '335',
        type: 'tags',
        attributes: {
          oligo: 'CATAGTACTCGAGTAT',
          group_id: 'bc2047',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '336',
        type: 'tags',
        attributes: {
          oligo: 'TGATGCTAGTGAGTAT',
          group_id: 'bc2048',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '337',
        type: 'tags',
        attributes: {
          oligo: 'TAGTCTGCGTGAGTAT',
          group_id: 'bc2049',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '338',
        type: 'tags',
        attributes: {
          oligo: 'CTCATCTATCGAGTAT',
          group_id: 'bc2050',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '339',
        type: 'tags',
        attributes: {
          oligo: 'TGCATACTGCGAGTAT',
          group_id: 'bc2051',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '340',
        type: 'tags',
        attributes: {
          oligo: 'CAGACTAGTCGAGTAT',
          group_id: 'bc2052',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '341',
        type: 'tags',
        attributes: {
          oligo: 'ATCGTGATCTGAGTAT',
          group_id: 'bc2053',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '342',
        type: 'tags',
        attributes: {
          oligo: 'CTGCGATCACGAGTAT',
          group_id: 'bc2054',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '343',
        type: 'tags',
        attributes: {
          oligo: 'CTCAGCATACGAGTAT',
          group_id: 'bc2055',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '344',
        type: 'tags',
        attributes: {
          oligo: 'TCGCAGCGTCGAGTAT',
          group_id: 'bc2056',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '345',
        type: 'tags',
        attributes: {
          oligo: 'TAGCACGCATGAGTAT',
          group_id: 'bc2057',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '346',
        type: 'tags',
        attributes: {
          oligo: 'TACTGACGCTGAGTAT',
          group_id: 'bc2058',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '347',
        type: 'tags',
        attributes: {
          oligo: 'ATCTGACTATGAGTAT',
          group_id: 'bc2059',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '348',
        type: 'tags',
        attributes: {
          oligo: 'ATACGAGCTCGAGTAT',
          group_id: 'bc2060',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '349',
        type: 'tags',
        attributes: {
          oligo: 'CGAGCACGCTGAGTAT',
          group_id: 'bc2061',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '350',
        type: 'tags',
        attributes: {
          oligo: 'TCTGCGTATCGAGTAT',
          group_id: 'bc2062',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '351',
        type: 'tags',
        attributes: {
          oligo: 'TCTGCATCATGAGTAT',
          group_id: 'bc2063',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '352',
        type: 'tags',
        attributes: {
          oligo: 'TGCGTGATGCGAGTAT',
          group_id: 'bc2064',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '353',
        type: 'tags',
        attributes: {
          oligo: 'TGAGCTATGCGAGTAT',
          group_id: 'bc2065',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '354',
        type: 'tags',
        attributes: {
          oligo: 'CTGTCGTAGTGAGTAT',
          group_id: 'bc2066',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '355',
        type: 'tags',
        attributes: {
          oligo: 'ATCGATGCATGAGTAT',
          group_id: 'bc2067',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '356',
        type: 'tags',
        attributes: {
          oligo: 'ACTACGTGATGAGTAT',
          group_id: 'bc2068',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '357',
        type: 'tags',
        attributes: {
          oligo: 'TCTATGACATGAGTAT',
          group_id: 'bc2069',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '358',
        type: 'tags',
        attributes: {
          oligo: 'TACTGCTCACGAGTAT',
          group_id: 'bc2070',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '359',
        type: 'tags',
        attributes: {
          oligo: 'CGAGTCTAGCGAGTAT',
          group_id: 'bc2071',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '360',
        type: 'tags',
        attributes: {
          oligo: 'TATCAGTAGTGAGTAT',
          group_id: 'bc2072',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '361',
        type: 'tags',
        attributes: {
          oligo: 'ATCACTAGTCGAGTAT',
          group_id: 'bc2073',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '362',
        type: 'tags',
        attributes: {
          oligo: 'TATCACGACTGAGTAT',
          group_id: 'bc2074',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '363',
        type: 'tags',
        attributes: {
          oligo: 'CTCGTCAGATGAGTAT',
          group_id: 'bc2075',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '364',
        type: 'tags',
        attributes: {
          oligo: 'CAGCAGTGACGAGTAT',
          group_id: 'bc2076',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '365',
        type: 'tags',
        attributes: {
          oligo: 'TGCGACGTGCGAGTAT',
          group_id: 'bc2077',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '366',
        type: 'tags',
        attributes: {
          oligo: 'CTCACTGAGTGAGTAT',
          group_id: 'bc2078',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '367',
        type: 'tags',
        attributes: {
          oligo: 'CACTGAGCGTGAGTAT',
          group_id: 'bc2079',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '368',
        type: 'tags',
        attributes: {
          oligo: 'CAGCGTCTACGAGTAT',
          group_id: 'bc2080',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '369',
        type: 'tags',
        attributes: {
          oligo: 'CTACTATGTCGAGTAT',
          group_id: 'bc2081',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '370',
        type: 'tags',
        attributes: {
          oligo: 'ATGTACAGACGAGTAT',
          group_id: 'bc2082',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '371',
        type: 'tags',
        attributes: {
          oligo: 'ACTCATCAGTGAGTAT',
          group_id: 'bc2083',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '372',
        type: 'tags',
        attributes: {
          oligo: 'CTGAGCACTCGAGTAT',
          group_id: 'bc2084',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '373',
        type: 'tags',
        attributes: {
          oligo: 'ATCATCTACTGAGTAT',
          group_id: 'bc2085',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '374',
        type: 'tags',
        attributes: {
          oligo: 'TACATGCGATGAGTAT',
          group_id: 'bc2086',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '375',
        type: 'tags',
        attributes: {
          oligo: 'TCGCTGTCACGAGTAT',
          group_id: 'bc2087',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '376',
        type: 'tags',
        attributes: {
          oligo: 'ACGCTCATGCGAGTAT',
          group_id: 'bc2088',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '377',
        type: 'tags',
        attributes: {
          oligo: 'TACTAGCAGCGAGTAT',
          group_id: 'bc2089',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '378',
        type: 'tags',
        attributes: {
          oligo: 'CGTAGCAGATGAGTAT',
          group_id: 'bc2090',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '379',
        type: 'tags',
        attributes: {
          oligo: 'CGTGCTCGTCGAGTAT',
          group_id: 'bc2091',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '380',
        type: 'tags',
        attributes: {
          oligo: 'ACAGCTGTACGAGTAT',
          group_id: 'bc2092',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '381',
        type: 'tags',
        attributes: {
          oligo: 'TCGATGCTACGAGTAT',
          group_id: 'bc2093',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '382',
        type: 'tags',
        attributes: {
          oligo: 'TAGATACAGCGAGTAT',
          group_id: 'bc2094',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '383',
        type: 'tags',
        attributes: {
          oligo: 'CTACTCATACGAGTAT',
          group_id: 'bc2095',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '384',
        type: 'tags',
        attributes: {
          oligo: 'ATGTACTAGTGAGTAT',
          group_id: 'bc2096',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '385',
        type: 'tags',
        attributes: {
          oligo: 'ACAGTC',
          group_id: 'bcM0001',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '8',
            },
          },
        },
      },
      {
        id: '386',
        type: 'tags',
        attributes: {
          oligo: 'ATGACG',
          group_id: 'bcM0002',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '8',
            },
          },
        },
      },
      {
        id: '387',
        type: 'tags',
        attributes: {
          oligo: 'CACGTG',
          group_id: 'bcM0003',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '8',
            },
          },
        },
      },
      {
        id: '388',
        type: 'tags',
        attributes: {
          oligo: 'CATCGC',
          group_id: 'bcM0004',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '8',
            },
          },
        },
      },
    ],
    meta: {
      page_count: null,
    },
  }

  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default PacbioTagSetFactory
