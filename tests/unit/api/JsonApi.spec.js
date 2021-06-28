import * as JsonApi from '@/api/JsonApi'
import TestResponse from '../../data/testResponse'
import CircularResponse from '../../data/circularResponse'
import { eq } from 'lodash-es'

// TODO: create a factory which will build a JSON api response. Doing this manually is crushing me.
describe('JsonApi', () => {
  let data, included, dataItem

  describe('deserialize', () => {
    beforeEach(() => {
      data = TestResponse.data
      included = TestResponse.data.included
      dataItem = data.data[0]
    })

    describe('for a given record', () => {
      it('can extract the attributes', () => {
        expect(JsonApi.extractAttributes(dataItem)).toEqual({
          id: '1',
          type: 'cheeses',
          attrA: 'you caught me',
          attrB: 'luv dancing',
        })
      })

      it('can map the relationships', () => {
        expect(JsonApi.mapRelationships(dataItem.relationships)).toEqual({
          bean: { id: '1', type: 'beans' },
          pickle: { id: '2', type: 'pickles' },
          chocolates: [{ id: '3', type: 'chocolates' }],
        })
        expect(JsonApi.mapRelationships(undefined)).toEqual({})
      })

      it('can extract a relationship', () => {
        expect(JsonApi.extractRelationship({ type: 'pickles', id: '2' }, included)).toEqual({
          type: 'pickles',
          id: '2',
          attrI: 'I just keep',
          attrJ: 'rolling on',
        })
        expect(JsonApi.extractRelationship([{ type: 'chocolates', id: '3' }], included)).toEqual([
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
        expect(JsonApi.findIncluded({ id: '2', type: 'pickles' }, included).attributes).toEqual({
          attrI: 'I just keep',
          attrJ: 'rolling on',
        })
        expect(JsonApi.findIncluded({ id: '1', type: 'beans' }, included).attributes).toEqual({})
      })

      it('can spread the included', () => {
        expect(JsonApi.deserializeIncluded({ id: '2', type: 'pickles' }, included)).toEqual({
          id: '2',
          type: 'pickles',
          attrI: 'I just keep',
          attrJ: 'rolling on',
        })
      })

      it('can extract the relationships', () => {
        expect(JsonApi.extractRelationships(undefined, included)).toEqual({})
        expect(JsonApi.extractRelationships(dataItem.relationships, undefined)).toEqual({})
        expect(JsonApi.extractRelationships(dataItem.relationships, included)).toEqual({
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
        expect(JsonApi.extractResourceObject(dataItem, included)).toEqual({
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
          expect(JsonApi.extractResourceObject(dataItem, included)).toMatchObject({
            id: '1',
            state: 'pending',
            volume: 1.0,
            concentration: 1.0,
            template_prep_kit_box_barcode: 'LK12345',
            fragment_size: 100,
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
        expect(JsonApi.deserialize({ data: dataItem, included: included })).toEqual({
          cheeses: [JsonApi.extractResourceObject(dataItem, included)],
        })
      })
    })

    describe('for a bunch of records', () => {
      let deserialized

      beforeEach(() => {
        deserialized = JsonApi.deserialize(TestResponse.data)
      })

      it('will extract all of the records', () => {
        expect(deserialized.cheeses.length).toEqual(2)
      })

      it('will extract each record correctly', () => {
        let item = JsonApi.extractResourceObject(dataItem, included)
        expect(deserialized.cheeses[0]).toEqual(item)
      })
    })
  })

  describe('groupIncludedByResource', () => {
    it('groups resources from an included array', ()=>{
      const included = TestResponse.data.included
      expect(
        JsonApi.groupIncludedByResource(included)
      ).toEqual({
        pickles: included.slice(0,1),
        chocolates: included.slice(1,3),
        crisps: included.slice(3,5),
      })
    })
  })

  describe('dataToObjectById', () => {

    it('creates an object with the id as key', () => {
      const data = TestResponse.data.data
      const object = JsonApi.dataToObjectById(data)
      const keys = Object.keys(object)
      expect(keys.length).toEqual(data.length)
      expect(object[keys[0]]).toEqual({ id: data[0].id, ...data[0].attributes})
    })

  })
})
