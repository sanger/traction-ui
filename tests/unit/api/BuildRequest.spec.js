import * as BuildRequest from '@/api/BuildRequest'
import Api from '@/api'

describe('BuildRequest', () => {

  describe('buildComponent', () => {
    it('creates a new component with given props', () => {
      let cmp = BuildRequest.buildComponent(Api.ConfigItem, {name: 'aname', apiNamespace: 'abc'})
      expect(cmp.name).toEqual('aname')
      expect(cmp.apiNamespace).toEqual('abc')
    })
  })

  describe('buildRequestHelper', () => {
    it('returns an object with the api resources as keys', () => {
      let request = BuildRequest.buildRequestHelper(Api.Config.traction)

      expect(request).toHaveProperty('samples')
      expect(request).toHaveProperty('libraries')
      expect(request).toHaveProperty('enzymes')
      expect(request).toHaveProperty('runs')
      expect(request).toHaveProperty('chips')
      expect(request).toHaveProperty('flowcells')
      expect(request).toHaveProperty('tubes')
    })

    it('returns an object where the api resources values are Request objects', () => {
      let request = BuildRequest.buildRequestHelper(Api.Config.traction)

      expect(request.samples).toHaveProperty('baseURL')
      expect(request.samples).toHaveProperty('apiNamespace')
      expect(request.samples).toHaveProperty('resource')
      expect(request.samples).toHaveProperty('headers')
      expect(request.samples).toHaveProperty('filter')
      expect(request.samples).toHaveProperty('include')
    })

  })
})
