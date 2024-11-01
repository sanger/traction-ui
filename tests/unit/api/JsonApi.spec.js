import * as JsonApi from '@/api/JsonApi'
import TestResponse from '@tests/data/testResponse'
import CircularResponse from '@tests/data/circularResponse'
import { describe, expect } from 'vitest'
import { Data } from '@support/testHelper'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory'

const pacbioRunFactory = PacbioRunFactory({ count: 1 })

// TODO: create a factory which will build a JSON api response. Doing this manually is crushing me.
describe('JsonApi', () => {
  const {
    extractAttributes,
    mapRelationships,
    extractRelationship,
    extractRelationships,
    findIncluded,
    deserializeIncluded,
    extractResourceObject,
    deserialize,
    groupIncludedByResource,
    extractRelationshipsAndGroupById,
    dataToObjectById,
    filterByAttribute,
    populateById,
    mapAttribute,
    dataToObjectByPosition,
    populateBy,
    splitDataByParent,
    dataToObjectByPlateNumber,
    find,
    extractIncludes,
  } = JsonApi

  let data, included, dataItem

  describe('deserialize', () => {
    beforeEach(() => {
      data = TestResponse.data
      included = TestResponse.data.included
      dataItem = data.data[0]
    })

    describe('for a given record', () => {
      it('can extract the attributes', () => {
        expect(extractAttributes(dataItem)).toEqual({
          id: '1',
          type: 'cheeses',
          attrA: 'you caught me',
          attrB: 'luv dancing',
        })
      })

      it('can map the relationships', () => {
        expect(mapRelationships(dataItem.relationships)).toEqual({
          bean: { id: '1', type: 'beans' },
          pickle: { id: '2', type: 'pickles' },
          chocolates: [{ id: '3', type: 'chocolates' }],
        })
        expect(mapRelationships(undefined)).toEqual({})
      })

      it('can extract a relationship', () => {
        expect(extractRelationship({ type: 'pickles', id: '2' }, included)).toEqual({
          type: 'pickles',
          id: '2',
          attrI: 'I just keep',
          attrJ: 'rolling on',
        })
        expect(extractRelationship([{ type: 'chocolates', id: '3' }], included)).toEqual([
          {
            attrC: 'can you',
            attrD: 'feel it',
            crisps: { attrE: 'Cyber Insekt', id: '100', type: 'crisps' },
            id: '3',
            type: 'chocolates',
          },
        ])
      })

      it('can find the included', () => {
        expect(findIncluded({ id: '2', type: 'pickles' }, included).attributes).toEqual({
          attrI: 'I just keep',
          attrJ: 'rolling on',
        })
        expect(findIncluded({ id: '1', type: 'beans' }, included).attributes).toEqual({})
      })

      it('can spread the included', () => {
        expect(deserializeIncluded({ id: '2', type: 'pickles' }, included)).toEqual({
          id: '2',
          type: 'pickles',
          attrI: 'I just keep',
          attrJ: 'rolling on',
        })
      })

      it('can extract the relationships', () => {
        expect(extractRelationships(undefined, included)).toEqual({})
        expect(extractRelationships(dataItem.relationships, undefined)).toEqual({})
        expect(extractRelationships(dataItem.relationships, included)).toEqual({
          bean: { id: '1', type: 'beans' },
          pickle: { attrI: 'I just keep', attrJ: 'rolling on', id: '2', type: 'pickles' },
          chocolates: [
            {
              attrC: 'can you',
              attrD: 'feel it',
              id: '3',
              type: 'chocolates',
              crisps: { type: 'crisps', id: '100', attrE: 'Cyber Insekt' },
            },
          ],
        })
      })

      it('can extract a resource object', () => {
        expect(extractResourceObject(dataItem, included)).toEqual({
          id: '1',
          type: 'cheeses',
          attrA: 'you caught me',
          attrB: 'luv dancing',
          bean: { id: '1', type: 'beans' },
          pickle: { attrI: 'I just keep', attrJ: 'rolling on', id: '2', type: 'pickles' },
          chocolates: [
            {
              attrC: 'can you',
              attrD: 'feel it',
              id: '3',
              type: 'chocolates',
              crisps: { type: 'crisps', id: '100', attrE: 'Cyber Insekt' },
            },
          ],
        })
      })

      describe('with circular relationships', () => {
        beforeEach(() => {
          data = CircularResponse.data
          included = CircularResponse.data.included
          dataItem = data.data[0]
        })

        it('can extract a resource object', () => {
          expect(extractResourceObject(dataItem, included)).toMatchObject({
            id: '1',
            state: 'pending',
            volume: 1.0,
            concentration: 1.0,
            template_prep_kit_box_barcode: 'LK12345',
            insert_size: 100,
            created_at: '2021/06/17 09:43',
            deactivated_at: null,
            source_identifier: 'DN1:A1',
            tag: {
              id: '13',
              oligo: 'ACACACTCTATCAGATT',
              group_id: 'bc1019_BAK8B_OA',
              tag_set: {
                id: '1',
                name: 'Sequel_16_barcodes_v3',
                uuid: '4d87a8ab-4d16-f0b0-77e5-0f467dba442e',
              },
            },
          })
        })
      })

      it('will work if single record is passed through deserializer', () => {
        expect(deserialize({ data: dataItem, included: included })).toEqual({
          cheeses: [extractResourceObject(dataItem, included)],
        })
      })
    })

    describe('for a bunch of records', () => {
      let deserialized

      beforeEach(() => {
        deserialized = deserialize(TestResponse.data)
      })

      it('will extract all of the records', () => {
        expect(deserialized.cheeses.length).toEqual(2)
      })

      it('will extract each record correctly', () => {
        const item = extractResourceObject(dataItem, included)
        expect(deserialized.cheeses[0]).toEqual(item)
      })
    })
  })

  describe('groupIncludedByResource', () => {
    it('groups resources from an included array', () => {
      const included = TestResponse.data.included
      expect(groupIncludedByResource(included)).toEqual({
        pickles: included.slice(0, 1),
        chocolates: included.slice(1, 3),
        crisps: included.slice(3, 5),
      })
    })
  })

  describe('extractRelationshipsAndGroupById', () => {
    it('creates a list of relationships by id', () => {
      const relationships = TestResponse.data.data[0].relationships
      const extractedRelationships = extractRelationshipsAndGroupById(relationships)
      expect(Object.keys(extractedRelationships)).toEqual([
        'bean',
        'pickle',
        'chocolates',
        'peaches',
        'mojitos',
      ])
      expect(extractedRelationships.bean).toEqual('1')
      expect(extractedRelationships.pickle).toEqual('2')
      expect(extractedRelationships.chocolates).toEqual(['3'])
      // If we don't have relationship information, we're undefined
      expect(extractedRelationships.peaches).toEqual(undefined)
      // But if we explicitly know whe have no relationship, we're null
      expect(extractedRelationships.mojitos).toEqual(null)
    })

    it('returns an empty object if the relationships are undefined', () => {
      const extractedRelationships = extractRelationshipsAndGroupById()
      expect(extractedRelationships).toEqual({})
    })
  })

  describe('dataToObjectById', () => {
    it('creates an object with the id as key', () => {
      const data = TestResponse.data.data
      const object = dataToObjectById({ data })
      const keys = Object.keys(object)
      expect(keys.length).toEqual(data.length)
      expect(object[keys[0]]).toEqual({ id: data[0].id, type: data[0].type, ...data[0].attributes })
    })

    it('adds the relationships if requested', () => {
      const data = TestResponse.data.data
      const object = dataToObjectById({ data, includeRelationships: true })
      const item = object['1']
      const keys = Object.keys(item)
      expect(keys.includes('bean')).toBeTruthy()
      expect(keys.includes('pickle')).toBeTruthy()
      expect(keys.includes('chocolates')).toBeTruthy()
    })
  })

  describe('filterByAttribute', () => {
    it('filters objects by attribute value', () => {
      const data = TestResponse.data.data
      const filtered = filterByAttribute(data, { attrA: 'wild horses' })
      expect(filtered.length).toEqual(1)
      expect(filtered[0]).toEqual(data[1])
    })

    it('filters nothing if an empty object is provided', () => {
      const data = TestResponse.data.data
      const filtered = filterByAttribute(data, {})
      expect(filtered.length).toEqual(2)
      expect(filtered[0]).toEqual(data[0])
      expect(filtered[1]).toEqual(data[1])
    })
  })
  describe('mapAttribute', () => {
    it('extract the given attribute into an array', () => {
      const data = TestResponse.data.data
      const filtered = mapAttribute(data, 'attrA')
      expect(filtered).toEqual(['you caught me', 'wild horses'])
    })
  })

  describe('populateById', () => {
    it('with resources', () => {
      const state = { resources: {} }
      const wells = pacbioRunFactory.storeData.resources.wells
      populateById('wells')(state, wells)
      expect(state.resources.wells).toEqual(dataToObjectById({ data: wells }))
    })

    it('without resources', () => {
      const state = {}
      const wells = pacbioRunFactory.storeData.resources.wells
      populateById('wells', { populateResources: false })(state, wells)
      expect(state.wells).toEqual(dataToObjectById({ data: wells }))
    })

    it('with relationships', () => {
      const state = { resources: {} }
      const wells = pacbioRunFactory.storeData.resources.wells
      populateById('wells', { includeRelationships: true })(state, wells)
      expect(state.resources.wells).toEqual(
        dataToObjectById({ data: wells, includeRelationships: true }),
      )
    })
  })

  describe('dataToObjectByPosition', () => {
    it('creates an object with the position as key', () => {
      const data = Data.PacbioWells.data.data
      const wells = dataToObjectByPosition({ data })
      const keys = Object.keys(wells)
      expect(keys.length).toEqual(data.length)
      // bizarre. It reverses the keys.
      expect(wells[keys[0]]).toEqual({
        id: data[1].id,
        position: data[1].position,
        type: data[1].type,
        ...data[1].attributes,
      })
    })

    it('adds the relationships if requested', () => {
      const data = Data.PacbioWells.data.data
      const wells = dataToObjectByPosition({ data, includeRelationships: true })
      const item = wells['A1']
      const keys = Object.keys(item)
      expect(keys.includes('pools')).toBeTruthy()
    })
  })

  describe('dataToObjectByPlateNumber', () => {
    it('creates an object with the plate number as key', () => {
      const resources = pacbioRunFactory.storeData.resources.plates
      const plates = dataToObjectByPlateNumber({ data: resources })
      const keys = Object.keys(plates)
      const { id, plate_number, type, attributes } = resources[0]
      expect(keys.length).toEqual(resources.length)
      // bizarre. It reverses the keys.
      expect(plates[keys[0]]).toEqual({
        id,
        plate_number,
        type,
        ...attributes,
      })
    })

    it('adds the relationships if requested', () => {
      const resources = pacbioRunFactory.storeData.resources.plates
      const plates = dataToObjectByPlateNumber({ data: resources, includeRelationships: true })
      const item = plates[Object.keys(plates)[0]]
      const keys = Object.keys(item)
      expect(keys.includes('wells')).toBeTruthy()
    })
  })

  describe('populateBy', () => {
    it('with resources', () => {
      const state = { resources: {} }
      const wells = pacbioRunFactory.storeData.resources.wells
      populateBy('wells', dataToObjectByPosition)(state, wells)
      expect(state.resources.wells).toEqual(dataToObjectByPosition({ data: wells }))
    })

    it('without resources', () => {
      const state = {}
      const wells = pacbioRunFactory.storeData.resources.wells
      populateBy('wells', dataToObjectByPosition, { populateResources: false })(state, wells)
      expect(state.wells).toEqual(dataToObjectByPosition({ data: wells }))
    })

    it('with relationships', () => {
      const state = { resources: {} }
      const wells = pacbioRunFactory.storeData.resources.wells
      populateBy('wells', dataToObjectByPosition, { includeRelationships: true })(state, wells)
      expect(state.resources.wells).toEqual(
        dataToObjectByPosition({ data: wells, includeRelationships: true }),
      )
    })
  })

  // this needs refactoring. Clearly a lot of complexity that needs to be simplified.
  describe('splitDataByParent', () => {
    it('splits the data by parent', () => {
      const plates = pacbioRunFactory.storeData.resources.plates
      const wells = pacbioRunFactory.storeData.resources.wells

      const plateKeys = Object.keys(pacbioRunFactory.storeData.plates)

      const result = splitDataByParent({
        data: wells,
        fn: dataToObjectByPosition,
        parent: { parentData: plates, children: 'wells', key: 'plate_number' },
        includeRelationships: true,
      })

      // check that result has the correct plate numbers
      expect(Object.keys(result)).toEqual(plateKeys)

      plateKeys.forEach((key) => {
        const wellKeys = pacbioRunFactory.storeData.plates[key].wells
        const wellsData = wellKeys.map((k) => wells.find((well) => well.id === k))
        expect(result[key]).toEqual(
          dataToObjectByPosition({ data: wellsData, includeRelationships: true }),
        )
      })
    })
  })

  const rawData = {
    data: [
      {
        id: '1',
        type: 'cheeses',
        links: {
          self: 'http://example.com/cheeses/1',
        },
        attributes: {
          attrA: 'you caught me',
          attrB: 'luv dancing',
        },
        relationships: {
          bean: {
            links: {
              self: 'http://example.com/beans/1/relationships/bean',
              related: 'http://example.com/beans/1/bean',
            },
            data: {
              type: 'beans',
              id: '1',
            },
          },
          pickle: {
            links: {
              self: 'http://example.com/pickles/2/relationships/pickle',
              related: 'http://example.com/pickles/2/pickle',
            },
            data: {
              type: 'pickles',
              id: '2',
            },
          },
          chocolates: {
            links: {
              self: 'http://example.com/chocolates/3/relationships/chocolates',
              related: 'http://example.com/chocolates/3/chocolates',
            },
            data: [{ type: 'chocolates', id: '3' }],
          },
        },
      },
      {
        id: '2',
        type: 'cheeses',
        links: {
          self: 'http://example.com/cheeses/2',
        },
        attributes: {
          attrA: 'wild horses',
          attrB: 'could not drag me away',
        },
        relationships: {
          bean: {
            links: {
              self: 'http://example.com/beans/4/relationships/bean',
              related: 'http://example.com/beans/4/bean',
            },
            data: {
              id: '4',
              type: 'beans',
            },
          },
          pickle: {
            links: {
              self: 'http://example.com/pickles/5/relationships/pickle',
              related: 'http://example.com/pickles/5/pickle',
            },
            data: {
              id: '5',
              type: 'pickles',
            },
          },
          chocolates: {
            links: {
              self: 'http://example.com/chocolates/6/relationships/chocolates',
              related: 'http://example.com/chocolates/6/chocolates',
            },
            data: [{ type: 'chocolates', id: '6' }],
          },
        },
      },
      {
        id: '3',
        type: 'chips',
        links: {
          self: 'http://example.com/chips/3',
        },
        attributes: {
          attrE: 'skinny',
          attrF: 'salty',
        },
        relationships: {
          links: {
            self: 'http://example.com/chips/3/relationships/chips',
            related: 'http://example.com/chips/3/chips',
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'beans',
        attrC: 'I just keep',
      },
      {
        id: '2',
        type: 'pickles',
        attrD: 'rolling on',
      },
      {
        id: '3',
        type: 'chocolates',
        attrE: 'Cyber Insekt',
        relationships: {
          crisps: {
            links: {
              self: 'http://example.com/crisps/100/relationships/crisps',
              related: 'http://example.com/crisps/100/crisps',
            },
            data: {
              id: '100',
              type: 'crisps',
            },
          },
        },
      },
      {
        id: '4',
        type: 'beans',
        attrC: 'I just keep',
      },
      {
        id: '5',
        type: 'pickles',
        attrD: 'rolling on',
      },
      {
        id: '6',
        type: 'chocolates',
        attrE: 'Cyber Insekt',
        relationships: {
          crisps: {
            links: {
              self: 'http://example.com/crisps/100/relationships/crisps',
              related: 'http://example.com/crisps/100/crisps',
            },
            data: {
              id: '100',
              type: 'crisps',
            },
          },
        },
      },
      {
        id: '100',
        type: 'crisps',
        attrE: 'Cyber Insekt',
      },
    ],
  }

  describe('extractIncludes', () => {
    it('will extract the included', () => {
      const includes = rawData.included
      const relationships = rawData.data[1].relationships

      const included = extractIncludes({ relationships, included: includes })
      expect(included).toEqual(rawData.included.slice(3, 7))
    })

    it('will not produce empty includes', () => {
      const relationships = {
        request: {
          data: {
            type: 'requests',
            id: '11',
          },
        },
        pool: {
          data: {
            type: 'pools',
            id: '7',
          },
        },
      }
      const included = [
        {
          id: '11',
          type: 'requests',
          attributes: {
            library_type: 'ONT_GridIon',
            data_type: 'basecalls',
            cost_code: 'S10010',
          },
        },
      ]

      // the pool does not have a relationship in the included
      const includes = extractIncludes({ relationships, included })
      expect(includes.length).toEqual(1)
    })

    it('should not produce a stack overflow error using a depth', () => {
      const relationships = {
        tag_set: {
          data: {
            type: 'tag_sets',
            id: '8',
          },
        },
      }

      const included = [
        {
          id: '389',
          type: 'tags',
          attributes: {
            oligo: 'CACAAAGACACCGACAACTTTCTT',
            group_id: 'NB01',
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
          id: '390',
          type: 'tags',
          attributes: {
            oligo: 'ACAGACGACTACAAACGGAATCGA',
            group_id: 'NB02',
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
          id: '8',
          type: 'tag_sets',
          links: {
            self: 'http://localhost:3100/v1/ont/tag_sets/8',
          },
          attributes: {
            name: 'SQK-NBD114.96',
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
                  id: '389',
                },
                {
                  type: 'tags',
                  id: '390',
                },
              ],
            },
          },
        },
      ]

      const includes = extractIncludes({ relationships, included })
      expect(includes.length).toEqual(4)
    })
  })

  describe('find', () => {
    beforeEach(() => {
      data = rawData
    })
    it('will find the first record if count is 1', () => {
      const found = find({ data, count: 1 })

      expect(found).toEqual({
        data: data.data[0],
        included: [...data.included.slice(0, 3), ...data.included.slice(-1)],
      })
    })

    it('will find the first 2 records with a count of 2', () => {
      const found = find({ data, count: 2 })
      // another problem with ordering which is whye we are comparing keys
      // probably need a method to sort the keys
      expect(Object.keys(found.data)).toEqual(Object.keys(data.data.slice(0, 2)))
      expect(Object.keys(found.included)).toEqual(Object.keys(data.included))
    })

    it('will find the second record if start is 1 and count is 1', () => {
      const found = find({ data, count: 1, start: 1 })
      // 4,5,6
      expect(found).toEqual({
        data: data.data.slice(1, 2)[0],
        included: data.included.slice(3),
      })
    })

    it('will find all the records by default', () => {
      const found = find({ data })
      expect(Object.keys(found.data)).toEqual(Object.keys(data.data))
      expect(Object.keys(found.included)).toEqual(Object.keys(data.included))
    })

    it('data will be an array if it is using get rather than find', () => {
      const found = find({ data, count: 1, get: true })
      expect(found).toEqual({
        data: data.data.slice(0, 1),
        included: [...data.included.slice(0, 3), ...data.included.slice(-1)],
      })
    })
  })
})
