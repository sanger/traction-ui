import BaseFactory from './BaseFactory.js'

/*
 * Factory for creating a list of pools
 * @returns a base factory object with the pools data
 */
const PacbioPoolFactory = () => {
  const data = {
    data: [
      {
        id: '6013',
        type: 'pools',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 17.5,
          concentration: 10.29,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 5223,
          created_at: '2024/11/04 15:52',
          updated_at: '2024/11/04 15:52',
          used_volume: 0,
          available_volume: 17.5,
          source_identifier:
            'TRAC-2-12054,TRAC-2-12055,TRAC-2-12056,TRAC-2-12057,TRAC-2-12059,TRAC-2-12058,TRAC-2-11746',
        },
        relationships: {
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/tube',
            },
            data: {
              type: 'tubes',
              id: '12068',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '35499',
              },
              {
                type: 'aliquots',
                id: '35500',
              },
              {
                type: 'aliquots',
                id: '35501',
              },
              {
                type: 'aliquots',
                id: '35502',
              },
              {
                type: 'aliquots',
                id: '35503',
              },
              {
                type: 'aliquots',
                id: '35504',
              },
              {
                type: 'aliquots',
                id: '35505',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/relationships/primary_aliquot',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/requests',
            },
            data: [],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6013/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '14271',
              },
              {
                type: 'libraries',
                id: '14270',
              },
              {
                type: 'libraries',
                id: '14269',
              },
              {
                type: 'libraries',
                id: '14268',
              },
              {
                type: 'libraries',
                id: '14267',
              },
              {
                type: 'libraries',
                id: '14266',
              },
              {
                type: 'libraries',
                id: '14082',
              },
            ],
          },
        },
      },
      {
        id: '6012',
        type: 'pools',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 15.0,
          concentration: 17.11,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 13142,
          created_at: '2024/11/04 13:49',
          updated_at: '2024/11/04 13:49',
          used_volume: 0,
          available_volume: 15.0,
          source_identifier: 'TRAC-2-11878,TRAC-2-11879',
        },
        relationships: {
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/tube',
            },
            data: {
              type: 'tubes',
              id: '12067',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '35496',
              },
              {
                type: 'aliquots',
                id: '35497',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/relationships/primary_aliquot',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/requests',
            },
            data: [],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6012/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '14162',
              },
              {
                type: 'libraries',
                id: '14161',
              },
            ],
          },
        },
      },
      {
        id: '6011',
        type: 'pools',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 15.0,
          concentration: 12.54,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9647,
          created_at: '2024/11/04 13:49',
          updated_at: '2024/11/04 13:49',
          used_volume: 0,
          available_volume: 15.0,
          source_identifier: 'TRAC-2-11876,TRAC-2-11877',
        },
        relationships: {
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/tube',
            },
            data: {
              type: 'tubes',
              id: '12066',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '35493',
              },
              {
                type: 'aliquots',
                id: '35494',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/primary_aliquot',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/requests',
            },
            data: [],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '14160',
              },
              {
                type: 'libraries',
                id: '14159',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '35493',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14159,
          source_type: 'Pacbio::Library',
          used_by_id: 6011,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 12.9,
          insert_size: 9933,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 600,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/tag',
            },
            data: {
              type: 'tags',
              id: '600',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/pool',
            },
            data: {
              type: 'pools',
              id: '6011',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/library',
            },
          },
        },
      },
      {
        id: '35494',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14160,
          source_type: 'Pacbio::Library',
          used_by_id: 6011,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 12.2,
          insert_size: 9360,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 601,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/tag',
            },
            data: {
              type: 'tags',
              id: '601',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/pool',
            },
            data: {
              type: 'pools',
              id: '6011',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/library',
            },
          },
        },
      },
      {
        id: '35496',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14161,
          source_type: 'Pacbio::Library',
          used_by_id: 6012,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 13.9,
          insert_size: 10707,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 602,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/tag',
            },
            data: {
              type: 'tags',
              id: '602',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/pool',
            },
            data: {
              type: 'pools',
              id: '6012',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35496/library',
            },
          },
        },
      },
      {
        id: '35497',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14162,
          source_type: 'Pacbio::Library',
          used_by_id: 6012,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 20.2,
          insert_size: 15577,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 603,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/tag',
            },
            data: {
              type: 'tags',
              id: '603',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/pool',
            },
            data: {
              type: 'pools',
              id: '6012',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35497/library',
            },
          },
        },
      },
      {
        id: '35499',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14266,
          source_type: 'Pacbio::Library',
          used_by_id: 6013,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 2.5,
          concentration: 9.99,
          insert_size: 7675,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: 610,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/tag',
            },
            data: {
              type: 'tags',
              id: '610',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/pool',
            },
            data: {
              type: 'pools',
              id: '6013',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35499/library',
            },
          },
        },
      },
      {
        id: '35500',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14267,
          source_type: 'Pacbio::Library',
          used_by_id: 6013,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 2.5,
          concentration: 14.28,
          insert_size: 10962,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: 611,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/tag',
            },
            data: {
              type: 'tags',
              id: '611',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/pool',
            },
            data: {
              type: 'pools',
              id: '6013',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35500/library',
            },
          },
        },
      },
      {
        id: '35501',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14268,
          source_type: 'Pacbio::Library',
          used_by_id: 6013,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 2.5,
          concentration: 12.49,
          insert_size: 9591,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: 612,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/tag',
            },
            data: {
              type: 'tags',
              id: '612',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/pool',
            },
            data: {
              type: 'pools',
              id: '6013',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35501/library',
            },
          },
        },
      },
      {
        id: '35502',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14269,
          source_type: 'Pacbio::Library',
          used_by_id: 6013,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 2.5,
          concentration: 6.79,
          insert_size: 5223,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: 613,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/tag',
            },
            data: {
              type: 'tags',
              id: '613',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/pool',
            },
            data: {
              type: 'pools',
              id: '6013',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35502/library',
            },
          },
        },
      },
      {
        id: '35503',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14271,
          source_type: 'Pacbio::Library',
          used_by_id: 6013,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 2.5,
          concentration: 10.16,
          insert_size: 7810,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: 615,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/tag',
            },
            data: {
              type: 'tags',
              id: '615',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/pool',
            },
            data: {
              type: 'pools',
              id: '6013',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35503/library',
            },
          },
        },
      },
      {
        id: '35504',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14270,
          source_type: 'Pacbio::Library',
          used_by_id: 6013,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 2.5,
          concentration: 10.3,
          insert_size: 7911,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: 614,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/tag',
            },
            data: {
              type: 'tags',
              id: '614',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/pool',
            },
            data: {
              type: 'pools',
              id: '6013',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35504/library',
            },
          },
        },
      },
      {
        id: '35505',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14082,
          source_type: 'Pacbio::Library',
          used_by_id: 6013,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 2.5,
          concentration: 7.87,
          insert_size: 6055,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: 616,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/tag',
            },
            data: {
              type: 'tags',
              id: '616',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/pool',
            },
            data: {
              type: 'pools',
              id: '6013',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35505/library',
            },
          },
        },
      },
      {
        id: '600',
        type: 'tags',
        attributes: {
          oligo: 'CAGCGTCTACGAGTAT',
          group_id: 'bc2080',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '601',
        type: 'tags',
        attributes: {
          oligo: 'CTACTATGTCGAGTAT',
          group_id: 'bc2081',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '602',
        type: 'tags',
        attributes: {
          oligo: 'ATGTACAGACGAGTAT',
          group_id: 'bc2082',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '603',
        type: 'tags',
        attributes: {
          oligo: 'ACTCATCAGTGAGTAT',
          group_id: 'bc2083',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '610',
        type: 'tags',
        attributes: {
          oligo: 'CGTAGCAGATGAGTAT',
          group_id: 'bc2090',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '611',
        type: 'tags',
        attributes: {
          oligo: 'CGTGCTCGTCGAGTAT',
          group_id: 'bc2091',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '612',
        type: 'tags',
        attributes: {
          oligo: 'ACAGCTGTACGAGTAT',
          group_id: 'bc2092',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '613',
        type: 'tags',
        attributes: {
          oligo: 'TCGATGCTACGAGTAT',
          group_id: 'bc2093',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '614',
        type: 'tags',
        attributes: {
          oligo: 'TAGATACAGCGAGTAT',
          group_id: 'bc2094',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '615',
        type: 'tags',
        attributes: {
          oligo: 'CTACTCATACGAGTAT',
          group_id: 'bc2095',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '616',
        type: 'tags',
        attributes: {
          oligo: 'ATGTACTAGTGAGTAT',
          group_id: 'bc2096',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '9',
        type: 'tag_sets',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/9',
        },
        attributes: {
          name: 'Pacbio_96_barcode_plate_v3',
          uuid: '7a7f33e6-4912-4505-0d1e-3ceef7c93695',
          pipeline: 'pacbio',
        },
        relationships: {
          tags: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/9/relationships/tags',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/9/tags',
            },
            data: [
              {
                type: 'tags',
                id: '600',
              },
              {
                type: 'tags',
                id: '601',
              },
              {
                type: 'tags',
                id: '602',
              },
              {
                type: 'tags',
                id: '603',
              },
              {
                type: 'tags',
                id: '610',
              },
              {
                type: 'tags',
                id: '611',
              },
              {
                type: 'tags',
                id: '612',
              },
              {
                type: 'tags',
                id: '613',
              },
              {
                type: 'tags',
                id: '614',
              },
              {
                type: 'tags',
                id: '615',
              },
              {
                type: 'tags',
                id: '616',
              },
            ],
          },
        },
      },
      {
        id: '12066',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066',
        },
        attributes: {
          barcode: 'TRAC-2-12066',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/pools',
            },
            data: [
              {
                type: 'pools',
                id: '6011',
              },
            ],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/libraries',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/requests',
            },
          },
        },
      },
      {
        id: '12067',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067',
        },
        attributes: {
          barcode: 'TRAC-2-12067',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067/pools',
            },
            data: [
              {
                type: 'pools',
                id: '6012',
              },
            ],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067/libraries',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12067/requests',
            },
          },
        },
      },
      {
        id: '12068',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068',
        },
        attributes: {
          barcode: 'TRAC-2-12068',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068/pools',
            },
            data: [
              {
                type: 'pools',
                id: '6013',
              },
            ],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068/libraries',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12068/requests',
            },
          },
        },
      },
      {
        id: '11746',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746',
        },
        attributes: {
          barcode: 'TRAC-2-11746',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746/libraries',
            },
            data: {
              type: 'libraries',
              id: '14082',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11746/requests',
            },
          },
        },
      },
      {
        id: '11876',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876',
        },
        attributes: {
          barcode: 'TRAC-2-11876',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/libraries',
            },
            data: {
              type: 'libraries',
              id: '14159',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/requests',
            },
          },
        },
      },
      {
        id: '11877',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877',
        },
        attributes: {
          barcode: 'TRAC-2-11877',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/libraries',
            },
            data: {
              type: 'libraries',
              id: '14160',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/requests',
            },
          },
        },
      },
      {
        id: '11878',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878',
        },
        attributes: {
          barcode: 'TRAC-2-11878',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878/libraries',
            },
            data: {
              type: 'libraries',
              id: '14161',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11878/requests',
            },
          },
        },
      },
      {
        id: '11879',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879',
        },
        attributes: {
          barcode: 'TRAC-2-11879',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879/libraries',
            },
            data: {
              type: 'libraries',
              id: '14162',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11879/requests',
            },
          },
        },
      },
      {
        id: '12054',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054',
        },
        attributes: {
          barcode: 'TRAC-2-12054',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054/libraries',
            },
            data: {
              type: 'libraries',
              id: '14266',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12054/requests',
            },
          },
        },
      },
      {
        id: '12055',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055',
        },
        attributes: {
          barcode: 'TRAC-2-12055',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055/libraries',
            },
            data: {
              type: 'libraries',
              id: '14267',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12055/requests',
            },
          },
        },
      },
      {
        id: '12056',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056',
        },
        attributes: {
          barcode: 'TRAC-2-12056',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056/libraries',
            },
            data: {
              type: 'libraries',
              id: '14268',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12056/requests',
            },
          },
        },
      },
      {
        id: '12057',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057',
        },
        attributes: {
          barcode: 'TRAC-2-12057',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057/libraries',
            },
            data: {
              type: 'libraries',
              id: '14269',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12057/requests',
            },
          },
        },
      },
      {
        id: '12058',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058',
        },
        attributes: {
          barcode: 'TRAC-2-12058',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058/libraries',
            },
            data: {
              type: 'libraries',
              id: '14270',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12058/requests',
            },
          },
        },
      },
      {
        id: '12059',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059',
        },
        attributes: {
          barcode: 'TRAC-2-12059',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059/libraries',
            },
            data: {
              type: 'libraries',
              id: '14271',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12059/requests',
            },
          },
        },
      },
      {
        id: '14271',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 36.0,
          concentration: 10.16,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 7810,
          created_at: '2024/11/04 12:42',
          deactivated_at: null,
          source_identifier: 'SQPP-63356-V:F1',
          pacbio_request_id: 8972,
          tag_id: 615,
          used_volume: 2.5,
          available_volume: 33.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/request',
            },
            data: {
              type: 'requests',
              id: '8972',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/tag',
            },
            data: {
              type: 'tags',
              id: '615',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/tube',
            },
            data: {
              type: 'tubes',
              id: '12059',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35463',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14271/used_aliquots',
            },
          },
        },
      },
      {
        id: '14270',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 49.0,
          concentration: 10.3,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 7911,
          created_at: '2024/11/04 12:42',
          deactivated_at: null,
          source_identifier: 'SQPP-63356-V:E1',
          pacbio_request_id: 8971,
          tag_id: 614,
          used_volume: 2.5,
          available_volume: 46.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/request',
            },
            data: {
              type: 'requests',
              id: '8971',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/tag',
            },
            data: {
              type: 'tags',
              id: '614',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/tube',
            },
            data: {
              type: 'tubes',
              id: '12058',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35461',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14270/used_aliquots',
            },
          },
        },
      },
      {
        id: '14269',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 72.0,
          concentration: 6.79,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 5223,
          created_at: '2024/11/04 12:41',
          deactivated_at: null,
          source_identifier: 'SQPP-63356-V:D1',
          pacbio_request_id: 8970,
          tag_id: 613,
          used_volume: 2.5,
          available_volume: 69.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/request',
            },
            data: {
              type: 'requests',
              id: '8970',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/tag',
            },
            data: {
              type: 'tags',
              id: '613',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/tube',
            },
            data: {
              type: 'tubes',
              id: '12057',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35459',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14269/used_aliquots',
            },
          },
        },
      },
      {
        id: '14268',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 25.0,
          concentration: 12.49,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 9591,
          created_at: '2024/11/04 12:40',
          deactivated_at: null,
          source_identifier: 'SQPP-63356-V:C1',
          pacbio_request_id: 8969,
          tag_id: 612,
          used_volume: 2.5,
          available_volume: 22.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/request',
            },
            data: {
              type: 'requests',
              id: '8969',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/tag',
            },
            data: {
              type: 'tags',
              id: '612',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/tube',
            },
            data: {
              type: 'tubes',
              id: '12056',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35457',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14268/used_aliquots',
            },
          },
        },
      },
      {
        id: '14267',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 43.0,
          concentration: 14.28,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 10962,
          created_at: '2024/11/04 12:39',
          deactivated_at: null,
          source_identifier: 'SQPP-63356-V:B1',
          pacbio_request_id: 8968,
          tag_id: 611,
          used_volume: 2.5,
          available_volume: 40.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/request',
            },
            data: {
              type: 'requests',
              id: '8968',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/tag',
            },
            data: {
              type: 'tags',
              id: '611',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/tube',
            },
            data: {
              type: 'tubes',
              id: '12055',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35455',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14267/used_aliquots',
            },
          },
        },
      },
      {
        id: '14266',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 85.0,
          concentration: 9.99,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 7675,
          created_at: '2024/11/04 12:39',
          deactivated_at: null,
          source_identifier: 'SQPP-63356-V:A1',
          pacbio_request_id: 8967,
          tag_id: 610,
          used_volume: 2.5,
          available_volume: 82.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/request',
            },
            data: {
              type: 'requests',
              id: '8967',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/tag',
            },
            data: {
              type: 'tags',
              id: '610',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/tube',
            },
            data: {
              type: 'tubes',
              id: '12054',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35453',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14266/used_aliquots',
            },
          },
        },
      },
      {
        id: '14162',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 27.5,
          concentration: 20.2,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 15577,
          created_at: '2024/10/29 09:08',
          deactivated_at: null,
          source_identifier: 'FS49169685',
          pacbio_request_id: 8966,
          tag_id: 603,
          used_volume: 7.5,
          available_volume: 20.0,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/request',
            },
            data: {
              type: 'requests',
              id: '8966',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/tag',
            },
            data: {
              type: 'tags',
              id: '603',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/tube',
            },
            data: {
              type: 'tubes',
              id: '11879',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35033',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14162/used_aliquots',
            },
          },
        },
      },
      {
        id: '14161',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 62.4,
          concentration: 13.9,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 10707,
          created_at: '2024/10/29 09:07',
          deactivated_at: null,
          source_identifier: 'FS72142656',
          pacbio_request_id: 8952,
          tag_id: 602,
          used_volume: 7.5,
          available_volume: 54.9,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/request',
            },
            data: {
              type: 'requests',
              id: '8952',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/tag',
            },
            data: {
              type: 'tags',
              id: '602',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/tube',
            },
            data: {
              type: 'tubes',
              id: '11878',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35031',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14161/used_aliquots',
            },
          },
        },
      },
      {
        id: '14160',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 51.6,
          concentration: 12.2,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9360,
          created_at: '2024/10/29 09:05',
          deactivated_at: null,
          source_identifier: 'FS71986093',
          pacbio_request_id: 8951,
          tag_id: 601,
          used_volume: 7.5,
          available_volume: 44.1,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/request',
            },
            data: {
              type: 'requests',
              id: '8951',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/tag',
            },
            data: {
              type: 'tags',
              id: '601',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/tube',
            },
            data: {
              type: 'tubes',
              id: '11877',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35029',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/used_aliquots',
            },
          },
        },
      },
      {
        id: '14159',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 22.3,
          concentration: 12.9,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9933,
          created_at: '2024/10/29 09:04',
          deactivated_at: null,
          source_identifier: 'FS71986813',
          pacbio_request_id: 8950,
          tag_id: 600,
          used_volume: 7.5,
          available_volume: 14.8,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/request',
            },
            data: {
              type: 'requests',
              id: '8950',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/tag',
            },
            data: {
              type: 'tags',
              id: '600',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/tube',
            },
            data: {
              type: 'tubes',
              id: '11876',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35027',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/used_aliquots',
            },
          },
        },
      },
      {
        id: '14082',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 31.0,
          concentration: 7.87,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 6055,
          created_at: '2024/10/18 15:08',
          deactivated_at: null,
          source_identifier: 'SQPP-61455-P:A1',
          pacbio_request_id: 8577,
          tag_id: 616,
          used_volume: 2.5,
          available_volume: 28.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/request',
            },
            data: {
              type: 'requests',
              id: '8577',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/tag',
            },
            data: {
              type: 'tags',
              id: '616',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/tube',
            },
            data: {
              type: 'tubes',
              id: '11746',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '34657',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14082/used_aliquots',
            },
          },
        },
      },
      {
        id: '8967',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8967',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10644',
          external_study_id: 'c3fc5752-4187-11e9-97d1-68b59976a384',
          sample_name: 'BAdASS15124087',
          barcode: null,
          sample_species: 'Anopheles mascarensis',
          created_at: '2024/09/27 14:02',
          source_identifier: 'SQPP-63356-V:A1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8967/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8967/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8967/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8967/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8967/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8967/tube',
            },
          },
        },
      },
      {
        id: '8968',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8968',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10644',
          external_study_id: 'c3fc5752-4187-11e9-97d1-68b59976a384',
          sample_name: 'BAdASS15124088',
          barcode: null,
          sample_species: 'Anopheles pauliani',
          created_at: '2024/09/27 14:02',
          source_identifier: 'SQPP-63356-V:B1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8968/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8968/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8968/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8968/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8968/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8968/tube',
            },
          },
        },
      },
      {
        id: '8969',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8969',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10644',
          external_study_id: 'c3fc5752-4187-11e9-97d1-68b59976a384',
          sample_name: 'BAdASS15124089',
          barcode: null,
          sample_species: 'Anopheles pretoriensis',
          created_at: '2024/09/27 14:02',
          source_identifier: 'SQPP-63356-V:C1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8969/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8969/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8969/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8969/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8969/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8969/tube',
            },
          },
        },
      },
      {
        id: '8970',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8970',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10644',
          external_study_id: 'c3fc5752-4187-11e9-97d1-68b59976a384',
          sample_name: 'BAdASS15124090',
          barcode: null,
          sample_species: 'Anopheles rufipes',
          created_at: '2024/09/27 14:02',
          source_identifier: 'SQPP-63356-V:D1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8970/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8970/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8970/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8970/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8970/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8970/tube',
            },
          },
        },
      },
      {
        id: '8971',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8971',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10644',
          external_study_id: 'c3fc5752-4187-11e9-97d1-68b59976a384',
          sample_name: 'BAdASS15124091',
          barcode: null,
          sample_species: 'Anopheles squamosus',
          created_at: '2024/09/27 14:02',
          source_identifier: 'SQPP-63356-V:E1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8971/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8971/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8971/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8971/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8971/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8971/tube',
            },
          },
        },
      },
      {
        id: '8972',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8972',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10644',
          external_study_id: 'c3fc5752-4187-11e9-97d1-68b59976a384',
          sample_name: 'BAdASS15124092',
          barcode: null,
          sample_species: 'Anopheles radama',
          created_at: '2024/09/27 14:02',
          source_identifier: 'SQPP-63356-V:F1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8972/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8972/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8972/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8972/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8972/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8972/tube',
            },
          },
        },
      },
      {
        id: '8966',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8966',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4698',
          external_study_id: '15c1db98-71b7-11ee-93ff-024293460e78',
          sample_name: 'PSYCHE15080086',
          barcode: 'FS49169685',
          sample_species: 'Pyrgus serratulae',
          created_at: '2024/09/27 09:46',
          source_identifier: 'FS49169685',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8966/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8966/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8966/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8966/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8966/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8966/tube',
            },
          },
        },
      },
      {
        id: '8950',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15016449',
          barcode: 'FS71986813',
          sample_species: 'Aplocera plagiata',
          created_at: '2024/09/27 08:37',
          source_identifier: 'FS71986813',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/tube',
            },
          },
        },
      },
      {
        id: '8951',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15016450',
          barcode: 'FS71986093',
          sample_species: 'Mesapamea secalis',
          created_at: '2024/09/27 08:37',
          source_identifier: 'FS71986093',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/tube',
            },
          },
        },
      },
      {
        id: '8952',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8952',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15016452',
          barcode: 'FS72142656',
          sample_species: 'Cossus cossus',
          created_at: '2024/09/27 08:37',
          source_identifier: 'FS72142656',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8952/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8952/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8952/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8952/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8952/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8952/tube',
            },
          },
        },
      },
      {
        id: '8577',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8577',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15076712',
          barcode: null,
          sample_species: 'Tetranychus urticae',
          created_at: '2024/08/23 10:46',
          source_identifier: 'SQPP-61455-P:A1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8577/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8577/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8577/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8577/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8577/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8577/tube',
            },
          },
        },
      },
    ],
    meta: {
      page_count: 1,
    },
    links: {
      first:
        'https://traction.psd.sanger.ac.uk/v1/pacbio/pools?filter%5Bbarcode%5D=TRAC-2-12068%2CTRAC-2-12066%2CTRAC-2-12067&include=used_aliquots.tag.tag_set%2Crequests.tube%2Ctube%2Clibraries.tube%2Clibraries.request%2Crequests.plate.wells.requests&page%5Bnumber%5D=1&page%5Bsize%5D=1000',
      last: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools?filter%5Bbarcode%5D=TRAC-2-12068%2CTRAC-2-12066%2CTRAC-2-12067&include=used_aliquots.tag.tag_set%2Crequests.tube%2Ctube%2Clibraries.tube%2Clibraries.request%2Crequests.plate.wells.requests&page%5Bnumber%5D=1&page%5Bsize%5D=1000',
    },
  }

  return BaseFactory(data)
}

export default PacbioPoolFactory
