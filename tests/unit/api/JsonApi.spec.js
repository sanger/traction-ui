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
        expect(JsonApi.extractAttributes(dataItem)).toEqual({ id: '1', attrA: 'you got me', attrB: 'luv dancing'})
      })

      it('can extract the relationships', () => {
        expect(JsonApi.extractRelationships(dataItem)).toEqual([{type: 'beans', id: '10'},  {type: 'pickles', id: '11'}, [{type: 'chocolates', id: '12'}]])
      })

      it('can find a relationship', () => {
        relationships = [{type: 'beans', id: '10'},  {type: 'pickles', id: '11'}, [{type: 'chocolates', id: '12'}]]
        expect(JsonApi.findRelationship('10', relationships)).toBeDefined()
        expect(JsonApi.findRelationship('12', relationships)).toBeDefined()

      })

      it('can find a relationship type', () => {
        relationships = [{type: 'beans', id: '10'},  {type: 'pickles', id: '11'}, [{type: 'chocolates', id: '12'}]]
        expect(JsonApi.findRelationshipType('10', relationships)).toEqual('beans')
        expect(JsonApi.findRelationshipType('12', relationships)).toEqual('chocolates')
      })

      it('can extract the included data', () => {
        relationships = JsonApi.extractRelationships(dataItem)
        expect(JsonApi.extractIncludedData(relationships, included)).toEqual([{"attrI": "I just keep", "attrJ": "rolling on", "id": "11"}, [{"attrC": "can you", "attrD": "feel it", "id": "12"}]])
      })

      it('can reduce the extracted included data', () => {
        relationships = JsonApi.extractRelationships(dataItem)
        extracted = JsonApi.extractIncludedData(relationships, included)
        expect(JsonApi.reduceIncludedData(relationships, extracted)).toEqual({ pickles: {id: '11', attrI: 'I just keep', attrJ: 'rolling on'}, chocolates: [{id: '12', attrC: 'can you', attrD: 'feel it'}]})
      })

      it('can extract a resource object', () => {
        let result = { id: '1', attrA: 'you got me', attrB: 'luv dancing', pickles: {id: '11', attrI: 'I just keep', attrJ: 'rolling on'}, chocolates: [{id: '12', attrC: 'can you', attrD: 'feel it', crisps: {id: '100', attrE: 'Cyber Insekt'}}]}
        expect(JsonApi.extractResourceObject(data[0], included)).toEqual(result)
      })

    })


  })

})