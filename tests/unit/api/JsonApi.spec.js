import * as JsonApi from '@/api/JsonApi'
import TestResponse from '../../data/testResponse'

describe('JsonApi', () => {

  let data, included

  describe('deserialize', () => {
    beforeEach(() => {
      data = TestResponse.data.data
      included = TestResponse.data.included
    })

    describe('for a given record', () => {

      let dataItem, relationships, extracted

      beforeEach(() => {
        dataItem = data[0]
      })

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
        expect(JsonApi.findIncluded('11', included).attributes).toEqual({attrI: 'I just keep', attrJ: 'rolling on'})
        expect(JsonApi.findIncluded('10', included).attributes).toEqual({})
      })

      it('can spread the included', () => {
        expect(JsonApi.spreadIncluded({id: '11', type: 'pickles'}, included)).toEqual({id: '11', type: 'pickles', attrI: 'I just keep', attrJ: 'rolling on'})
      })

      it('can extract the relationships', () => {
        expect(JsonApi.extractRelationships(undefined, included)).toEqual({})
        expect(JsonApi.extractRelationships(data[0].relationships, included)).toEqual({bean: {id: '10', type: 'beans'}, pickle: {attrI: 'I just keep', attrJ: 'rolling on', id: '11', type: 'pickles'}, chocolates: [{attrC: 'can you', attrD: 'feel it', 'id': '12', type: 'chocolates', crisps: {type: 'crisps', id: '100', attrE: 'Cyber Insekt'}}]})
      })

      it('can extract a resource object', () => {
        expect(JsonApi.extractResourceObject(data[0], included)).toEqual({id: '1', type: 'cheeses', attrA: 'you caught me', attrB: 'luv dancing', bean: {id: '10', type: 'beans'}, pickle: {attrI: 'I just keep', attrJ: 'rolling on', id: '11', type: 'pickles'}, chocolates: [{attrC: 'can you', attrD: 'feel it', 'id': '12', type: 'chocolates', crisps: {type: 'crisps', id: '100', attrE: 'Cyber Insekt'}}]})

      })
    })

  })

})