import * as JsonApi from '@/api/JsonApi'
import TestResponse from '@tests/data/testResponse'
import CircularResponse from '@tests/data/circularResponse'
import { describe, expect } from 'vitest'
import { Data } from '@support/testHelper'

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
    includesRelationshipAttributes,
    getRelationshipKeys,
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
      const wells = Data.PacbioRun.data.included.slice(1, 2)
      populateById('wells')(state, wells)
      expect(state.resources.wells).toEqual(dataToObjectById({ data: wells }))
    })

    it('without resources', () => {
      const state = {}
      const wells = Data.PacbioRun.data.included.slice(1, 2)
      populateById('wells', { populateResources: false })(state, wells)
      expect(state.wells).toEqual(dataToObjectById({ data: wells }))
    })

    it('with relationships', () => {
      const state = { resources: {} }
      const wells = Data.PacbioRun.data.included.slice(1, 2)
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
      const data = Data.PacbioRun.data.included.slice(0, 1)
      const plates = dataToObjectByPlateNumber({ data })
      const keys = Object.keys(plates)
      expect(keys.length).toEqual(data.length)
      // bizarre. It reverses the keys.
      expect(plates[keys[0]]).toEqual({
        id: data[0].id,
        plate_number: data[0].plate_number,
        type: data[0].type,
        ...data[0].attributes,
      })
    })

    it('adds the relationships if requested', () => {
      const data = Data.PacbioRun.data.included.slice(0, 1)
      const plates = dataToObjectByPlateNumber({ data, includeRelationships: true })
      const item = plates['1']
      const keys = Object.keys(item)
      expect(keys.includes('wells')).toBeTruthy()
    })
  })

  describe('populateBy', () => {
    it('with resources', () => {
      const state = { resources: {} }
      const wells = Data.PacbioRun.data.included.slice(1, 2)
      populateBy('wells', dataToObjectByPosition)(state, wells)
      expect(state.resources.wells).toEqual(dataToObjectByPosition({ data: wells }))
    })

    it('without resources', () => {
      const state = {}
      const wells = Data.PacbioRun.data.included.slice(1, 2)
      populateBy('wells', dataToObjectByPosition, { populateResources: false })(state, wells)
      expect(state.wells).toEqual(dataToObjectByPosition({ data: wells }))
    })

    it('with relationships', () => {
      const state = { resources: {} }
      const wells = Data.PacbioRun.data.included.slice(1, 2)
      populateBy('wells', dataToObjectByPosition, { includeRelationships: true })(state, wells)
      expect(state.resources.wells).toEqual(
        dataToObjectByPosition({ data: wells, includeRelationships: true }),
      )
    })
  })

  describe('splitDataByParent', () => {
    it('splits the data by parent', () => {
      const plates = Data.PacbioRun.data.included.slice(0, 2)
      const wells = Data.PacbioRun.data.included.slice(2, 4)

      const plateNumbers = plates.map((p) => p.attributes.plate_number.toString())

      const result = splitDataByParent({
        data: wells,
        fn: dataToObjectByPosition,
        parent: { parentData: plates, children: 'wells', key: 'plate_number' },
        includeRelationships: true,
      })

      // check that result has the correct plate numbers
      expect(Object.keys(result)).toEqual(plateNumbers)
      // check that each plate has the correct wells
      expect(result[plateNumbers[0]]).toEqual(
        dataToObjectByPosition({ data: [wells[0], wells[1]], includeRelationships: true }),
      )
      expect(result[plateNumbers[1]]).toEqual(
        dataToObjectByPosition({ data: wells.slice(1), includeRelationships: true }),
      )
    })
  })

  describe('getRelationshipNames', () => {
    it('returns a set of relationship names, if the relationship exists', () => {
      const result = getRelationshipKeys(Data.PacbioRuns.data.data)
      expect(result).toEqual(new Set(['plates']))
    })

    it('return an empty object, if the relationship does not exist', () => {
      const result = getRelationshipKeys({ data: { id: '1', type: 'cheeses', attributes: {} } })
      expect(result).toEqual(new Set([]))
    })
  })

  describe('includesRelationshipAttributes', () => {
    it('properties defined in included are added to the relationship  object accordingly', () => {
      const result = includesRelationshipAttributes(Data.PacbioRuns.data)
      expect(result.some((item) => Array.isArray(item.plates))).toBeTruthy()
      expect(
        result.some((item) =>
          item.plates.some(
            (plate) =>
              plate.pacbio_run_id && plate.plate_number && plate.sequencing_kit_box_barcode,
          ),
        ),
      ).toBeTruthy()
    })
  })
})
