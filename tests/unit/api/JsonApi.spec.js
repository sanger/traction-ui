import * as JsonApi from '@/api/JsonApi'

import TestResponse from '../../data/testResponse'
import Requests from '../../data/Requests'
import SequencingRun from '../../data/sequencingRun'

// TODO: modify test data to check for nulls and dpulicate ids
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
        expect(JsonApi.extractAttributes(dataItem)).toEqual({ id: '1', type: 'cheeses', attrA: 'you caught me', attrB: 'luv dancing'})
      })

      it('can map the relationships', () => {
        expect(JsonApi.mapRelationships(dataItem.relationships)).toEqual({ bean: {id: '10', type: 'beans'},  pickle: {id: '11', type: 'pickles'}, chocolates: [{'id': '12', type: 'chocolates'}]})
        expect(JsonApi.mapRelationships(undefined)).toEqual({})
      })

      it('can extract a relationship', () => {
        expect(JsonApi.extractRelationship({type: 'pickles', id: '11'}, included)).toEqual({type: 'pickles', id: '11', attrI: 'I just keep', attrJ: 'rolling on'})
        expect(JsonApi.extractRelationship([{ type: 'chocolates', id: '12' }], included)).toEqual([{"attrC": "can you", "attrD": "feel it", "crisps": {"attrE": "Cyber Insekt", "id": "100", "type": "crisps"}, "id": "12", "type": "chocolates"}])
      })

      it('can find the included', () => {
        expect(JsonApi.findIncluded({id: '11', type: 'pickles'}, included).attributes).toEqual({attrI: 'I just keep', attrJ: 'rolling on'})
        expect(JsonApi.findIncluded({id: '10', type: 'beans'}, included).attributes).toEqual({})
      })

      it('can spread the included', () => {
        expect(JsonApi.spreadIncluded({id: '11', type: 'pickles'}, included)).toEqual({id: '11', type: 'pickles', attrI: 'I just keep', attrJ: 'rolling on'})
      })

      it('can extract the relationships', () => {
        expect(JsonApi.extractRelationships(undefined, included)).toEqual({})
        expect(JsonApi.extractRelationships(dataItem.relationships, included)).toEqual({bean: {id: '10', type: 'beans'}, pickle: {attrI: 'I just keep', attrJ: 'rolling on', id: '11', type: 'pickles'}, chocolates: [{attrC: 'can you', attrD: 'feel it', 'id': '12', type: 'chocolates', crisps: {type: 'crisps', id: '100', attrE: 'Cyber Insekt'}}]})
      })

      it('can extract a resource object', () => {
        expect(JsonApi.extractResourceObject(dataItem, included)).toEqual({id: '1', type: 'cheeses', attrA: 'you caught me', attrB: 'luv dancing', bean: {id: '10', type: 'beans'}, pickle: {attrI: 'I just keep', attrJ: 'rolling on', id: '11', type: 'pickles'}, chocolates: [{attrC: 'can you', attrD: 'feel it', 'id': '12', type: 'chocolates', crisps: {type: 'crisps', id: '100', attrE: 'Cyber Insekt'}}]})
      })

      it('will work if single record is passed through deserializer', () => {
        expect(JsonApi.deserialize({ data: dataItem, included: included})).toEqual(JsonApi.extractResourceObject(dataItem, included))
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

    describe('for a sequencing run', () => {

      beforeEach(() => {
        data = SequencingRun.data
        dataItem = data.data
        included = SequencingRun.data.included
      })

      it('can deserialize correctly', () => {
        expect(JsonApi.deserialize(data)).toBeDefined()
      })

    })

  })


})