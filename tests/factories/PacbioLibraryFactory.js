import BaseFactory from './BaseFactory.js'

/*
 * Factory for creating a pacbio library
 * @returns a base factory object with the runs data
 */
const PacbioLibraryFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'libraries',
        attributes: {
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '09/23/2019 11:18',
          source_identifier: 'DN1:A1',
        },
        relationships: {
          request: {
            data: {
              type: 'requests',
              id: '1',
            },
          },
          tag: {
            data: {
              type: 'tags',
              id: '3',
            },
          },
          tube: {
            data: {
              type: 'tubes',
              id: '4',
            },
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'requests',
        attributes: {
          sample_name: '4616STDY7535900',
        },
      },
      {
        id: '4',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-721',
        },
      },
      {
        id: '3',
        type: 'tags',
        attributes: {
          group_id: '1234',
        },
      },
    ],
  }

  return BaseFactory(data)
}

export default PacbioLibraryFactory
