import BaseFactory from './BaseFactory.js'

/*
 * Factory for creating a list of sequencescape labware
 * @returns a base factory object with the labware data
 */
const SequencescapeKinnexTubeFactory = () => {
  const data = {
    data: [
      {
        id: '82',
        type: 'tubes',
        links: {
          self: 'http://localhost:3000/api/v2/tubes/82',
        },
        attributes: {
          labware_barcode: {
            ean13_barcode: '3980000067791',
            machine_barcode: '3980000067791',
            human_barcode: 'NT67O',
          },
        },
        relationships: {
          receptacles: {
            links: {
              self: 'http://localhost:3000/api/v2/tubes/82/relationships/receptacles',
              related: 'http://localhost:3000/api/v2/tubes/82/receptacles',
            },
            data: [
              {
                type: 'receptacles',
                id: '1507',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '1507',
        type: 'receptacles',
        links: {
          self: 'http://localhost:3000/api/v2/receptacles/1507',
        },
        relationships: {
          aliquots: {
            links: {
              self: 'http://localhost:3000/api/v2/receptacles/1507/relationships/aliquots',
              related: 'http://localhost:3000/api/v2/receptacles/1507/aliquots',
            },
            data: [
              { type: 'aliquots', id: '315' },
              { type: 'aliquots', id: '316' },
              { type: 'aliquots', id: '317' },
            ],
          },
        },
      },
      // Aliquots for 1507
      {
        id: '315',
        type: 'aliquots',
        links: { self: 'http://localhost:3000/api/v2/aliquots/315' },
        attributes: { library_type: null },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/315/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/315/study',
            },
            data: { type: 'studies', id: '1' },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/315/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/315/sample',
            },
            data: { type: 'samples', id: '212' },
          },
        },
      },
      {
        id: '316',
        type: 'aliquots',
        links: { self: 'http://localhost:3000/api/v2/aliquots/316' },
        attributes: { library_type: null },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/316/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/316/study',
            },
            data: { type: 'studies', id: '1' },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/316/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/316/sample',
            },
            data: { type: 'samples', id: '213' },
          },
        },
      },
      {
        id: '317',
        type: 'aliquots',
        links: { self: 'http://localhost:3000/api/v2/aliquots/317' },
        attributes: { library_type: null },
        relationships: {
          study: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/317/relationships/study',
              related: 'http://localhost:3000/api/v2/aliquots/317/study',
            },
            data: { type: 'studies', id: '1' },
          },
          sample: {
            links: {
              self: 'http://localhost:3000/api/v2/aliquots/317/relationships/sample',
              related: 'http://localhost:3000/api/v2/aliquots/317/sample',
            },
            data: { type: 'samples', id: '214' },
          },
        },
      },
      // Study
      {
        id: '1',
        type: 'studies',
        links: { self: 'http://localhost:3000/api/v2/studies/1' },
        attributes: { uuid: '3b1cf0ac-4079-11f0-805f-e2df7c04b5f2' },
      },
      // Samples
      {
        id: '212',
        type: 'samples',
        links: { self: 'http://localhost:3000/api/v2/samples/212' },
        attributes: { name: 'sample_1_SQPD-9015_A4', uuid: 'f3e18688-4142-11f0-ac8e-e2df7c04b5f2' },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://localhost:3000/api/v2/samples/212/relationships/sample_metadata',
              related: 'http://localhost:3000/api/v2/samples/212/sample_metadata',
            },
            data: { type: 'sample_metadata', id: '212' },
          },
        },
      },
      {
        id: '213',
        type: 'samples',
        links: { self: 'http://localhost:3000/api/v2/samples/213' },
        attributes: { name: 'sample_2_SQPD-9015_A4', uuid: 'f3e372c2-4142-11f0-ac8e-e2df7c04b5f2' },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://localhost:3000/api/v2/samples/213/relationships/sample_metadata',
              related: 'http://localhost:3000/api/v2/samples/213/sample_metadata',
            },
            data: { type: 'sample_metadata', id: '213' },
          },
        },
      },
      {
        id: '214',
        type: 'samples',
        links: { self: 'http://localhost:3000/api/v2/samples/214' },
        attributes: { name: 'sample_3_SQPD-9015_A4', uuid: 'f3e4f250-4142-11f0-ac8e-e2df7c04b5f2' },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://localhost:3000/api/v2/samples/214/relationships/sample_metadata',
              related: 'http://localhost:3000/api/v2/samples/214/sample_metadata',
            },
            data: { type: 'sample_metadata', id: '214' },
          },
        },
      },
      // Sample metadata
      {
        id: '212',
        type: 'sample_metadata',
        links: { self: 'http://localhost:3000/api/v2/sample_metadata/212' },
        attributes: {
          sample_common_name: 'human',
          supplier_name: 'Supplier A',
          date_of_sample_collection: '2023-01-01',
          donor_id: 'Donor 1',
        },
      },
      {
        id: '213',
        type: 'sample_metadata',
        links: { self: 'http://localhost:3000/api/v2/sample_metadata/213' },
        attributes: {
          sample_common_name: 'human',
          supplier_name: 'Supplier A',
          date_of_sample_collection: '2023-01-02',
          donor_id: 'Donor 1',
        },
      },
      {
        id: '214',
        type: 'sample_metadata',
        links: { self: 'http://localhost:3000/api/v2/sample_metadata/214' },
        attributes: {
          sample_common_name: 'human',
          supplier_name: 'Supplier A',
          date_of_sample_collection: '2023-01-03',
          donor_id: 'Donor 1',
        },
      },
    ],
    links: {
      first:
        'http://localhost:3000/api/v2/labware?fields%5Baliquots%5D=study%2Clibrary_type%2Csample&fields%5Breceptacles%5D=aliquots&fields%5Bsample_metadata%5D=sample_common_name&fields%5Bsamples%5D=sample_metadata%2Cname%2Cuuid&fields%5Bstudies%5D=uuid&fields%5Btubes%5D=labware_barcode%2Creceptacles&filter%5Bbarcode%5D=NT67O%2CNT68P&include=receptacles.aliquots.sample.sample_metadata%2Creceptacles.aliquots.study&page%5Bnumber%5D=1&page%5Bsize%5D=100',
      last: 'http://localhost:3000/api/v2/labware?fields%5Baliquots%5D=study%2Clibrary_type%2Csample&fields%5Breceptacles%5D=aliquots&fields%5Bsample_metadata%5D=sample_common_name&fields%5Bsamples%5D=sample_metadata%2Cname%2Cuuid&fields%5Bstudies%5D=uuid&fields%5Btubes%5D=labware_barcode%2Creceptacles&filter%5Bbarcode%5D=NT67O%2CNT68P&include=receptacles.aliquots.sample.sample_metadata%2Creceptacles.aliquots.study&page%5Bnumber%5D=1&page%5Bsize%5D=100',
    },
  }

  return BaseFactory(data)
}

export default SequencescapeKinnexTubeFactory
