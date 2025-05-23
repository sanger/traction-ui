import BaseFactory from './BaseFactory.js'

/*
 * Factory for creating a list of sequencescape labware
 * @returns a base factory object with the lawbare data
 */
const SequencescapeLabwareFactory = () => {
  const data = {
    data: [
      {
        id: '2',
        type: 'plates',
        links: { self: 'http://sequencescape/api/v2/plates/2' },
        attributes: {
          labware_barcode: {
            ean13_barcode: '1229000002657',
            machine_barcode: 'DN9000002A',
            human_barcode: 'DN9000002A',
          },
          retention_instruction: 'destroy_after_2_years',
        },
        relationships: {
          receptacles: {
            links: {
              self: 'http://sequencescape/api/v2/plates/2/relationships/receptacles',
              related: 'http://sequencescape/api/v2/plates/2/receptacles',
            },
            data: [
              { type: 'wells', id: '97' },
              { type: 'wells', id: '98' },
              { type: 'wells', id: '99' },
              { type: 'wells', id: '100' },
              { type: 'wells', id: '101' },
              { type: 'wells', id: '102' },
              { type: 'wells', id: '103' },
              { type: 'wells', id: '104' },
              { type: 'wells', id: '105' },
              { type: 'wells', id: '106' },
              { type: 'wells', id: '107' },
              { type: 'wells', id: '108' },
              { type: 'wells', id: '109' },
              { type: 'wells', id: '110' },
              { type: 'wells', id: '111' },
              { type: 'wells', id: '112' },
              { type: 'wells', id: '113' },
              { type: 'wells', id: '114' },
              { type: 'wells', id: '115' },
              { type: 'wells', id: '116' },
              { type: 'wells', id: '117' },
              { type: 'wells', id: '118' },
              { type: 'wells', id: '119' },
              { type: 'wells', id: '120' },
              { type: 'wells', id: '121' },
              { type: 'wells', id: '122' },
              { type: 'wells', id: '123' },
              { type: 'wells', id: '124' },
              { type: 'wells', id: '125' },
              { type: 'wells', id: '126' },
              { type: 'wells', id: '127' },
              { type: 'wells', id: '128' },
              { type: 'wells', id: '129' },
              { type: 'wells', id: '130' },
              { type: 'wells', id: '131' },
              { type: 'wells', id: '132' },
              { type: 'wells', id: '133' },
              { type: 'wells', id: '134' },
              { type: 'wells', id: '135' },
              { type: 'wells', id: '136' },
              { type: 'wells', id: '137' },
              { type: 'wells', id: '138' },
              { type: 'wells', id: '139' },
              { type: 'wells', id: '140' },
              { type: 'wells', id: '141' },
              { type: 'wells', id: '142' },
              { type: 'wells', id: '143' },
              { type: 'wells', id: '144' },
              { type: 'wells', id: '145' },
              { type: 'wells', id: '146' },
              { type: 'wells', id: '147' },
              { type: 'wells', id: '148' },
              { type: 'wells', id: '149' },
              { type: 'wells', id: '150' },
              { type: 'wells', id: '151' },
              { type: 'wells', id: '152' },
              { type: 'wells', id: '153' },
              { type: 'wells', id: '154' },
              { type: 'wells', id: '155' },
              { type: 'wells', id: '156' },
              { type: 'wells', id: '157' },
              { type: 'wells', id: '158' },
              { type: 'wells', id: '159' },
              { type: 'wells', id: '160' },
              { type: 'wells', id: '161' },
              { type: 'wells', id: '162' },
              { type: 'wells', id: '163' },
              { type: 'wells', id: '164' },
              { type: 'wells', id: '165' },
              { type: 'wells', id: '166' },
              { type: 'wells', id: '167' },
              { type: 'wells', id: '168' },
              { type: 'wells', id: '169' },
              { type: 'wells', id: '170' },
              { type: 'wells', id: '171' },
              { type: 'wells', id: '172' },
              { type: 'wells', id: '173' },
              { type: 'wells', id: '174' },
              { type: 'wells', id: '175' },
              { type: 'wells', id: '176' },
              { type: 'wells', id: '177' },
              { type: 'wells', id: '178' },
              { type: 'wells', id: '179' },
              { type: 'wells', id: '180' },
              { type: 'wells', id: '181' },
              { type: 'wells', id: '182' },
              { type: 'wells', id: '183' },
              { type: 'wells', id: '184' },
              { type: 'wells', id: '185' },
              { type: 'wells', id: '186' },
              { type: 'wells', id: '187' },
              { type: 'wells', id: '188' },
              { type: 'wells', id: '189' },
              { type: 'wells', id: '190' },
              { type: 'wells', id: '191' },
              { type: 'wells', id: '192' },
            ],
          },
        },
      },
      {
        id: '3',
        type: 'tubes',
        links: { self: 'http://sequencescape/api/v2/tubes/3' },
        attributes: {
          labware_barcode: {
            ean13_barcode: '3980000001795',
            machine_barcode: '3980000001795',
            human_barcode: 'NT1O',
          },
          retention_instruction: 'return_to_customer_after_2_years',
        },
        relationships: {
          receptacles: {
            links: {
              self: 'http://sequencescape/api/v2/tubes/3/relationships/receptacles',
              related: 'http://sequencescape/api/v2/tubes/3/receptacles',
            },
            data: [{ type: 'receptacles', id: '193' }],
          },
        },
      },
    ],
    included: [
      {
        id: '97',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/97' },
        attributes: { position: { name: 'A1' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/97/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/97/aliquots',
            },
            data: [{ type: 'aliquots', id: '97' }],
          },
        },
      },
      {
        id: '98',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/98' },
        attributes: { position: { name: 'B1' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/98/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/98/aliquots',
            },
            data: [{ type: 'aliquots', id: '98' }],
          },
        },
      },
      {
        id: '99',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/99' },
        attributes: { position: { name: 'C1' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/99/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/99/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '100',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/100' },
        attributes: { position: { name: 'D1' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/100/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/100/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '101',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/101' },
        attributes: { position: { name: 'E1' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/101/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/101/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '102',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/102' },
        attributes: { position: { name: 'F1' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/102/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/102/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '103',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/103' },
        attributes: { position: { name: 'G1' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/103/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/103/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '104',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/104' },
        attributes: { position: { name: 'H1' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/104/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/104/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '105',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/105' },
        attributes: { position: { name: 'A2' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/105/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/105/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '106',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/106' },
        attributes: { position: { name: 'B2' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/106/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/106/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '107',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/107' },
        attributes: { position: { name: 'C2' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/107/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/107/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '108',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/108' },
        attributes: { position: { name: 'D2' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/108/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/108/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '109',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/109' },
        attributes: { position: { name: 'E2' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/109/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/109/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '110',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/110' },
        attributes: { position: { name: 'F2' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/110/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/110/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '111',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/111' },
        attributes: { position: { name: 'G2' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/111/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/111/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '112',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/112' },
        attributes: { position: { name: 'H2' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/112/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/112/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '113',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/113' },
        attributes: { position: { name: 'A3' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/113/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/113/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '114',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/114' },
        attributes: { position: { name: 'B3' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/114/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/114/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '115',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/115' },
        attributes: { position: { name: 'C3' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/115/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/115/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '116',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/116' },
        attributes: { position: { name: 'D3' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/116/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/116/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '117',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/117' },
        attributes: { position: { name: 'E3' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/117/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/117/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '118',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/118' },
        attributes: { position: { name: 'F3' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/118/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/118/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '119',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/119' },
        attributes: { position: { name: 'G3' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/119/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/119/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '120',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/120' },
        attributes: { position: { name: 'H3' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/120/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/120/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '121',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/121' },
        attributes: { position: { name: 'A4' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/121/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/121/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '122',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/122' },
        attributes: { position: { name: 'B4' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/122/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/122/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '123',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/123' },
        attributes: { position: { name: 'C4' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/123/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/123/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '124',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/124' },
        attributes: { position: { name: 'D4' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/124/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/124/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '125',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/125' },
        attributes: { position: { name: 'E4' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/125/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/125/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '126',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/126' },
        attributes: { position: { name: 'F4' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/126/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/126/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '127',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/127' },
        attributes: { position: { name: 'G4' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/127/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/127/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '128',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/128' },
        attributes: { position: { name: 'H4' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/128/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/128/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '129',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/129' },
        attributes: { position: { name: 'A5' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/129/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/129/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '130',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/130' },
        attributes: { position: { name: 'B5' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/130/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/130/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '131',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/131' },
        attributes: { position: { name: 'C5' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/131/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/131/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '132',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/132' },
        attributes: { position: { name: 'D5' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/132/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/132/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '133',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/133' },
        attributes: { position: { name: 'E5' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/133/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/133/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '134',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/134' },
        attributes: { position: { name: 'F5' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/134/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/134/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '135',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/135' },
        attributes: { position: { name: 'G5' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/135/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/135/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '136',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/136' },
        attributes: { position: { name: 'H5' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/136/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/136/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '137',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/137' },
        attributes: { position: { name: 'A6' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/137/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/137/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '138',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/138' },
        attributes: { position: { name: 'B6' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/138/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/138/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '139',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/139' },
        attributes: { position: { name: 'C6' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/139/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/139/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '140',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/140' },
        attributes: { position: { name: 'D6' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/140/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/140/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '141',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/141' },
        attributes: { position: { name: 'E6' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/141/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/141/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '142',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/142' },
        attributes: { position: { name: 'F6' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/142/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/142/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '143',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/143' },
        attributes: { position: { name: 'G6' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/143/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/143/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '144',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/144' },
        attributes: { position: { name: 'H6' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/144/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/144/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '145',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/145' },
        attributes: { position: { name: 'A7' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/145/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/145/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '146',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/146' },
        attributes: { position: { name: 'B7' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/146/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/146/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '147',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/147' },
        attributes: { position: { name: 'C7' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/147/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/147/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '148',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/148' },
        attributes: { position: { name: 'D7' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/148/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/148/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '149',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/149' },
        attributes: { position: { name: 'E7' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/149/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/149/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '150',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/150' },
        attributes: { position: { name: 'F7' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/150/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/150/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '151',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/151' },
        attributes: { position: { name: 'G7' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/151/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/151/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '152',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/152' },
        attributes: { position: { name: 'H7' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/152/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/152/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '153',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/153' },
        attributes: { position: { name: 'A8' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/153/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/153/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '154',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/154' },
        attributes: { position: { name: 'B8' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/154/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/154/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '155',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/155' },
        attributes: { position: { name: 'C8' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/155/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/155/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '156',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/156' },
        attributes: { position: { name: 'D8' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/156/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/156/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '157',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/157' },
        attributes: { position: { name: 'E8' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/157/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/157/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '158',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/158' },
        attributes: { position: { name: 'F8' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/158/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/158/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '159',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/159' },
        attributes: { position: { name: 'G8' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/159/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/159/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '160',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/160' },
        attributes: { position: { name: 'H8' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/160/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/160/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '161',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/161' },
        attributes: { position: { name: 'A9' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/161/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/161/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '162',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/162' },
        attributes: { position: { name: 'B9' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/162/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/162/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '163',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/163' },
        attributes: { position: { name: 'C9' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/163/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/163/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '164',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/164' },
        attributes: { position: { name: 'D9' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/164/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/164/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '165',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/165' },
        attributes: { position: { name: 'E9' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/165/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/165/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '166',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/166' },
        attributes: { position: { name: 'F9' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/166/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/166/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '167',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/167' },
        attributes: { position: { name: 'G9' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/167/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/167/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '168',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/168' },
        attributes: { position: { name: 'H9' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/168/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/168/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '169',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/169' },
        attributes: { position: { name: 'A10' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/169/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/169/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '170',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/170' },
        attributes: { position: { name: 'B10' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/170/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/170/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '171',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/171' },
        attributes: { position: { name: 'C10' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/171/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/171/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '172',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/172' },
        attributes: { position: { name: 'D10' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/172/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/172/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '173',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/173' },
        attributes: { position: { name: 'E10' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/173/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/173/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '174',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/174' },
        attributes: { position: { name: 'F10' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/174/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/174/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '175',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/175' },
        attributes: { position: { name: 'G10' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/175/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/175/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '176',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/176' },
        attributes: { position: { name: 'H10' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/176/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/176/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '177',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/177' },
        attributes: { position: { name: 'A11' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/177/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/177/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '178',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/178' },
        attributes: { position: { name: 'B11' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/178/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/178/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '179',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/179' },
        attributes: { position: { name: 'C11' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/179/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/179/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '180',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/180' },
        attributes: { position: { name: 'D11' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/180/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/180/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '181',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/181' },
        attributes: { position: { name: 'E11' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/181/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/181/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '182',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/182' },
        attributes: { position: { name: 'F11' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/182/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/182/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '183',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/183' },
        attributes: { position: { name: 'G11' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/183/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/183/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '184',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/184' },
        attributes: { position: { name: 'H11' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/184/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/184/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '185',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/185' },
        attributes: { position: { name: 'A12' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/185/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/185/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '186',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/186' },
        attributes: { position: { name: 'B12' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/186/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/186/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '187',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/187' },
        attributes: { position: { name: 'C12' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/187/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/187/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '188',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/188' },
        attributes: { position: { name: 'D12' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/188/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/188/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '189',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/189' },
        attributes: { position: { name: 'E12' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/189/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/189/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '190',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/190' },
        attributes: { position: { name: 'F12' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/190/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/190/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '191',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/191' },
        attributes: { position: { name: 'G12' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/191/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/191/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '192',
        type: 'wells',
        links: { self: 'http://sequencescape/api/v2/wells/192' },
        attributes: { position: { name: 'H12' } },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/wells/192/relationships/aliquots',
              related: 'http://sequencescape/api/v2/wells/192/aliquots',
            },
            data: [],
          },
        },
      },
      {
        id: '97',
        type: 'aliquots',
        links: { self: 'http://sequencescape/api/v2/aliquots/97' },
        attributes: { library_type: 'Pacbio_HiFi' },
        relationships: {
          study: {
            links: {
              self: 'http://sequencescape/api/v2/aliquots/97/relationships/study',
              related: 'http://sequencescape/api/v2/aliquots/97/study',
            },
            data: { type: 'studies', id: '2' },
          },
          sample: {
            links: {
              self: 'http://sequencescape/api/v2/aliquots/97/relationships/sample',
              related: 'http://sequencescape/api/v2/aliquots/97/sample',
            },
            data: { type: 'samples', id: '98' },
          },
        },
      },
      {
        id: '98',
        type: 'aliquots',
        links: { self: 'http://sequencescape/api/v2/aliquots/98' },
        attributes: { library_type: 'Pacbio_HiFi' },
        relationships: {
          study: {
            links: {
              self: 'http://sequencescape/api/v2/aliquots/98/relationships/study',
              related: 'http://sequencescape/api/v2/aliquots/98/study',
            },
            data: { type: 'studies', id: '2' },
          },
          sample: {
            links: {
              self: 'http://sequencescape/api/v2/aliquots/98/relationships/sample',
              related: 'http://sequencescape/api/v2/aliquots/98/sample',
            },
            data: { type: 'samples', id: '99' },
          },
        },
      },
      {
        id: '99',
        type: 'aliquots',
        links: { self: 'http://sequencescape/api/v2/aliquots/99' },
        attributes: { library_type: 'Pacbio_IsoSeq' },
        relationships: {
          study: {
            links: {
              self: 'http://sequencescape/api/v2/aliquots/99/relationships/study',
              related: 'http://sequencescape/api/v2/aliquots/99/study',
            },
            data: { type: 'studies', id: '2' },
          },
          sample: {
            links: {
              self: 'http://sequencescape/api/v2/aliquots/99/relationships/sample',
              related: 'http://sequencescape/api/v2/aliquots/99/sample',
            },
            data: { type: 'samples', id: '100' },
          },
        },
      },
      {
        id: '2',
        type: 'studies',
        links: { self: 'http://sequencescape/api/v2/studies/2' },
        attributes: { uuid: '5b173660-94c9-11ec-8c89-acde48001122' },
      },
      {
        id: '98',
        type: 'samples',
        links: { self: 'http://sequencescape/api/v2/samples/98' },
        attributes: { name: '2STDY1', uuid: 'd5008026-94c9-11ec-a9e3-acde48001122' },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://sequencescape/api/v2/samples/98/relationships/sample_metadata',
              related: 'http://sequencescape/api/v2/samples/98/sample_metadata',
            },
            data: { type: 'sample_metadata', id: '98' },
          },
        },
      },
      {
        id: '99',
        type: 'samples',
        links: { self: 'http://sequencescape/api/v2/samples/99' },
        attributes: { name: '2STDY2', uuid: 'd50bad48-94c9-11ec-a9e3-acde48001122' },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://sequencescape/api/v2/samples/99/relationships/sample_metadata',
              related: 'http://sequencescape/api/v2/samples/99/sample_metadata',
            },
            data: { type: 'sample_metadata', id: '99' },
          },
        },
      },
      {
        id: '100',
        type: 'samples',
        links: { self: 'http://sequencescape/api/v2/samples/100' },
        attributes: { name: '2STDY97', uuid: '0db37dd8-94ca-11ec-a9e3-acde48001122' },
        relationships: {
          sample_metadata: {
            links: {
              self: 'http://sequencescape/api/v2/samples/100/relationships/sample_metadata',
              related: 'http://sequencescape/api/v2/samples/100/sample_metadata',
            },
            data: { type: 'sample_metadata', id: '100' },
          },
        },
      },
      {
        id: '98',
        type: 'sample_metadata',
        links: { self: 'http://sequencescape/api/v2/sample_metadata/98' },
        attributes: { sample_common_name: 'Dragon' },
      },
      {
        id: '99',
        type: 'sample_metadata',
        links: { self: 'http://sequencescape/api/v2/sample_metadata/99' },
        attributes: { sample_common_name: 'Unicorn' },
      },
      {
        id: '100',
        type: 'sample_metadata',
        links: { self: 'http://sequencescape/api/v2/sample_metadata/100' },
        attributes: { sample_common_name: 'Gryphon' },
      },
      {
        id: '193',
        type: 'receptacles',
        links: { self: 'http://sequencescape/api/v2/receptacles/193' },
        relationships: {
          aliquots: {
            links: {
              self: 'http://sequencescape/api/v2/receptacles/193/relationships/aliquots',
              related: 'http://sequencescape/api/v2/receptacles/193/aliquots',
            },
            data: [{ type: 'aliquots', id: '99' }],
          },
        },
      },
    ],
    links: {
      first:
        'http://sequencescape/api/v2/labware?fields%5Baliquots%5D=study%2Clibrary_type%2Csample&fields%5Bplates%5D=labware_barcode%2Creceptacles&fields%5Breceptacles%5D=aliquots&fields%5Bsample_metadata%5D=sample_common_name&fields%5Bsamples%5D=sample_metadata%2Cname%2Cuuid&fields%5Bstudies%5D=uuid&fields%5Btubes%5D=labware_barcode%2Creceptacles&fields%5Bwells%5D=position%2Caliquots&filter%5Bbarcode%5D=DN9000002A%2CNT1O&include=receptacles.aliquots.sample.sample_metadata%2Creceptacles.aliquots.study&page%5Bnumber%5D=1&page%5Bsize%5D=100',
      last: 'http://sequencescape/api/v2/labware?fields%5Baliquots%5D=study%2Clibrary_type%2Csample&fields%5Bplates%5D=labware_barcode%2Creceptacles&fields%5Breceptacles%5D=aliquots&fields%5Bsample_metadata%5D=sample_common_name&fields%5Bsamples%5D=sample_metadata%2Cname%2Cuuid&fields%5Bstudies%5D=uuid&fields%5Btubes%5D=labware_barcode%2Creceptacles&fields%5Bwells%5D=position%2Caliquots&filter%5Bbarcode%5D=DN9000002A%2CNT1O&include=receptacles.aliquots.sample.sample_metadata%2Creceptacles.aliquots.study&page%5Bnumber%5D=1&page%5Bsize%5D=100',
    },
  }

  return BaseFactory(data)
}

export default SequencescapeLabwareFactory
