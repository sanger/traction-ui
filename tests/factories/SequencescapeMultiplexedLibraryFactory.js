import BaseFactory from './BaseFactory.js'

/*
 * Factory for creating a list of runs
 * @returns a base factory object with the runs data
 */
const SequencescapeMultiplexedLibraryFactory = () => {
  const data = {
    // it would be better to pass the smrt link versions from the smrt link factory
    // so that the factory is more self-contained and is not so brittle
    data: [
      {
        id: '304',
        type: 'tubes',
        links: {
          self: 'http://localhost:3000/api/v2/tubes/304',
        },
        attributes: {
          labware_barcode: {
            ean13_barcode: '3980000042705',
            machine_barcode: '3980000042705',
            human_barcode: 'NT42F',
          },
        },
        relationships: {
          receptacles: {
            links: {
              self: 'http://localhost:3000/api/v2/tubes/304/relationships/receptacles',
              related: 'http://localhost:3000/api/v2/tubes/304/receptacles',
            },
            data: [
              {
                type: 'receptacles',
                id: '25004',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '25001',
        type: 'receptacles',
        links: {
          self: 'http://localhost:3000/api/v2/receptacles/25001',
        },
        relationships: {
          aliquots: {
            links: {
              self: 'http://localhost:3000/api/v2/receptacles/25001/relationships/aliquots',
              related: 'http://localhost:3000/api/v2/receptacles/25001/aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '25689',
              },
            ],
          },
        },
      },
      {
        id: '25002',
        type: 'receptacles',
        links: {
          self: 'http://localhost:3000/api/v2/receptacles/25002',
        },
        relationships: {
          aliquots: {
            links: {
              self: 'http://localhost:3000/api/v2/receptacles/25002/relationships/aliquots',
              related: 'http://localhost:3000/api/v2/receptacles/25002/aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '25691',
              },
            ],
          },
        },
      },
      {
        id: '25003',
        type: 'receptacles',
        links: {
          self: 'http://localhost:3000/api/v2/receptacles/25003',
        },
        relationships: {
          aliquots: {
            links: {
              self: 'http://localhost:3000/api/v2/receptacles/25003/relationships/aliquots',
              related: 'http://localhost:3000/api/v2/receptacles/25003/aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '25693',
              },
            ],
          },
        },
      },
      {
        id: '25004',
        type: 'receptacles',
        links: {
          self: 'http://localhost:3000/api/v2/receptacles/25004',
        },
        relationships: {
          aliquots: {
            links: {
              self: 'http://localhost:3000/api/v2/receptacles/25004/relationships/aliquots',
              related: 'http://localhost:3000/api/v2/receptacles/25004/aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '25690',
              },
              {
                type: 'aliquots',
                id: '25692',
              },
              {
                type: 'aliquots',
                id: '25694',
              },
            ],
          },
        },
      },
      {
        id: '25689',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3000/api/v2/aliquots/25689',
        },
        attributes: {
          library_type: 'Custom',
          insert_size_to: 100,
          tag_oligo: 'AATCGTTA',
        },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25689/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/25689/study',
            },
            data: {
              type: 'studies',
              id: '2',
            },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25689/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/25689/sample',
            },
            data: {
              type: 'samples',
              id: '2674',
            },
          },
        },
      },
      {
        id: '25690',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3000/api/v2/aliquots/25690',
        },
        attributes: {
          library_type: 'Custom',
          insert_size_to: 100,
          tag_oligo: 'AATCGTTA',
        },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25690/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/25690/study',
            },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25690/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/25690/sample',
            },
          },
        },
      },
      {
        id: '25691',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3000/api/v2/aliquots/25691',
        },
        attributes: {
          library_type: 'Custom',
          insert_size_to: 100,
          tag_oligo: 'AATCGGCG',
        },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25691/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/25691/study',
            },
            data: {
              type: 'studies',
              id: '2',
            },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25691/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/25691/sample',
            },
            data: {
              type: 'samples',
              id: '2675',
            },
          },
        },
      },
      {
        id: '25692',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3000/api/v2/aliquots/25692',
        },
        attributes: {
          library_type: 'Custom',
          insert_size_to: 100,
          tag_oligo: 'AATCGGCG',
        },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25692/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/25692/study',
            },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25692/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/25692/sample',
            },
          },
        },
      },
      {
        id: '25693',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3000/api/v2/aliquots/25693',
        },
        attributes: {
          library_type: 'Custom',
          insert_size_to: 100,
          tag_oligo: 'AATCCGTT',
        },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25693/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/25693/study',
            },
            data: {
              type: 'studies',
              id: '2',
            },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25693/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/25693/sample',
            },
            data: {
              type: 'samples',
              id: '2676',
            },
          },
        },
      },
      {
        id: '25694',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3000/api/v2/aliquots/25694',
        },
        attributes: {
          library_type: 'Custom',
          insert_size_to: 100,
          tag_oligo: 'AATCCGTT',
        },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25694/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/25694/study',
            },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/25694/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/25694/sample',
            },
          },
        },
      },
      {
        id: '2',
        type: 'studies',
        links: {
          self: 'http://localhost:3000/api/v2/studies/2',
        },
        attributes: {
          uuid: 'd8d67198-885a-11ee-87ba-46043cfb1bd9',
        },
      },
      {
        id: '2674',
        type: 'samples',
        links: {
          self: 'http://localhost:3000/api/v2/samples/2674',
        },
        attributes: {
          name: '2STDY6',
          uuid: 'cfcc0198-2a3b-11ef-a718-46043cfb1bd9',
        },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://localhost:3000/api/v2/samples/2674/relationships/sample_metadata',
              related: 'http://localhost:3000/api/v2/samples/2674/sample_metadata',
            },
            data: {
              type: 'sample_metadata',
              id: '2674',
            },
          },
        },
      },
      {
        id: '2675',
        type: 'samples',
        links: {
          self: 'http://localhost:3000/api/v2/samples/2675',
        },
        attributes: {
          name: '2STDY7',
          uuid: 'cfe18810-2a3b-11ef-a718-46043cfb1bd9',
        },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://localhost:3000/api/v2/samples/2675/relationships/sample_metadata',
              related: 'http://localhost:3000/api/v2/samples/2675/sample_metadata',
            },
            data: {
              type: 'sample_metadata',
              id: '2675',
            },
          },
        },
      },
      {
        id: '2676',
        type: 'samples',
        links: {
          self: 'http://localhost:3000/api/v2/samples/2676',
        },
        attributes: {
          name: '2STDY8',
          uuid: 'cfe8fb0e-2a3b-11ef-a718-46043cfb1bd9',
        },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://localhost:3000/api/v2/samples/2676/relationships/sample_metadata',
              related: 'http://localhost:3000/api/v2/samples/2676/sample_metadata',
            },
            data: {
              type: 'sample_metadata',
              id: '2676',
            },
          },
        },
      },
      {
        id: '2674',
        type: 'sample_metadata',
        links: {
          self: 'http://localhost:3000/api/v2/sample_metadata/2674',
        },
        attributes: {
          sample_common_name: 'cat',
          volume: '10',
          concentration: '20',
        },
      },
      {
        id: '2675',
        type: 'sample_metadata',
        links: {
          self: 'http://localhost:3000/api/v2/sample_metadata/2675',
        },
        attributes: {
          sample_common_name: 'cat',
          volume: '10',
          concentration: '20',
        },
      },
      {
        id: '2676',
        type: 'sample_metadata',
        links: {
          self: 'http://localhost:3000/api/v2/sample_metadata/2676',
        },
        attributes: {
          sample_common_name: 'cat',
          volume: '10',
          concentration: '20',
        },
      },
      {
        id: '1',
        type: 'tags',
        links: {
          self: 'http://localhost:3000/api/v2/tags/1',
        },
        attributes: {
          oligo: 'AATCGTTA',
        },
      },
      {
        id: '2',
        type: 'tags',
        links: {
          self: 'http://localhost:3000/api/v2/tags/2',
        },
        attributes: {
          oligo: 'AATCGGCG',
        },
      },
      {
        id: '3',
        type: 'tags',
        links: {
          self: 'http://localhost:3000/api/v2/tags/3',
        },
        attributes: {
          oligo: 'AATCCGTT',
        },
      },
      {
        id: '301',
        type: 'labware',
        links: {
          self: 'http://localhost:3000/api/v2/labware/301',
        },
        attributes: {
          labware_barcode: {
            ean13_barcode: '3980000039750',
            machine_barcode: '3980000039750',
            human_barcode: 'NT39K',
          },
        },
        relationships: {
          receptacles: {
            links: {
              self: 'http://localhost:3000/api/v2/labware/301/relationships/receptacles',
              related: 'http://localhost:3000/api/v2/labware/301/receptacles',
            },
            data: [
              {
                type: 'receptacles',
                id: '25001',
              },
            ],
          },
        },
      },
      {
        id: '302',
        type: 'labware',
        links: {
          self: 'http://localhost:3000/api/v2/labware/302',
        },
        attributes: {
          labware_barcode: {
            ean13_barcode: '3980000040688',
            machine_barcode: '3980000040688',
            human_barcode: 'NT40D',
          },
        },
        relationships: {
          receptacles: {
            links: {
              self: 'http://localhost:3000/api/v2/labware/302/relationships/receptacles',
              related: 'http://localhost:3000/api/v2/labware/302/receptacles',
            },
            data: [
              {
                type: 'receptacles',
                id: '25002',
              },
            ],
          },
        },
      },
      {
        id: '303',
        type: 'labware',
        links: {
          self: 'http://localhost:3000/api/v2/labware/303',
        },
        attributes: {
          labware_barcode: {
            ean13_barcode: '3980000041692',
            machine_barcode: '3980000041692',
            human_barcode: 'NT41E',
          },
        },
        relationships: {
          receptacles: {
            links: {
              self: 'http://localhost:3000/api/v2/labware/303/relationships/receptacles',
              related: 'http://localhost:3000/api/v2/labware/303/receptacles',
            },
            data: [
              {
                type: 'receptacles',
                id: '25003',
              },
            ],
          },
        },
      },
    ],
    links: {
      first:
        'http://localhost:3000/api/v2/labware?fields%5Baliquots%5D=study%2Clibrary_type%2Csample%2Cinsert_size_to%2Ctag_oligo&fields%5Blabware%5D=labware_barcode%2Creceptacles&fields%5Breceptacles%5D=aliquots&fields%5Bsample_metadata%5D=sample_common_name%2Cvolume%2Cconcentration&fields%5Bsamples%5D=sample_metadata%2Cname%2Cuuid&fields%5Bstudies%5D=uuid&fields%5Btags%5D=oligo&fields%5Btubes%5D=labware_barcode%2Creceptacles&filter%5Bbarcode%5D=3980000042705&include=receptacles.aliquots.library.aliquots.sample.sample_metadata%2Creceptacles.aliquots.library.aliquots.study%2Creceptacles.aliquots.library.aliquots.tag%2Creceptacles.aliquots.library.aliquots%2Creceptacles.aliquots.library.labware.receptacles&page%5Bnumber%5D=1&page%5Bsize%5D=100',
      last: 'http://localhost:3000/api/v2/labware?fields%5Baliquots%5D=study%2Clibrary_type%2Csample%2Cinsert_size_to%2Ctag_oligo&fields%5Blabware%5D=labware_barcode%2Creceptacles&fields%5Breceptacles%5D=aliquots&fields%5Bsample_metadata%5D=sample_common_name%2Cvolume%2Cconcentration&fields%5Bsamples%5D=sample_metadata%2Cname%2Cuuid&fields%5Bstudies%5D=uuid&fields%5Btags%5D=oligo&fields%5Btubes%5D=labware_barcode%2Creceptacles&filter%5Bbarcode%5D=3980000042705&include=receptacles.aliquots.library.aliquots.sample.sample_metadata%2Creceptacles.aliquots.library.aliquots.study%2Creceptacles.aliquots.library.aliquots.tag%2Creceptacles.aliquots.library.aliquots%2Creceptacles.aliquots.library.labware.receptacles&page%5Bnumber%5D=1&page%5Bsize%5D=100',
    },

    meta: {
      page_count: 1,
    },
  }

  return BaseFactory(data)
}

export default SequencescapeMultiplexedLibraryFactory
