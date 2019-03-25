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

  // describe('buildRequestHelper', () => {
  //   it('returns an object with the api resources as keys', () => {
  //     let request = BuildRequest.buildRequestHelper(Api.Config.traction)
  //
  //     expect(request).toHaveProperty('samples')
  //     expect(request).toHaveProperty('libraries')
  //     expect(request).toHaveProperty('enzymes')
  //     expect(request).toHaveProperty('runs')
  //     expect(request).toHaveProperty('chips')
  //     expect(request).toHaveProperty('flowcells')
  //     expect(request).toHaveProperty('tubes')
  //   })
  //
  //   it('returns an object where the api resources values are Request objects', () => {
  //     let request = BuildRequest.buildRequestHelper(Api.Config.traction)
  //
  //     expect(request.samples).toHaveProperty('baseURL')
  //     expect(request.samples).toHaveProperty('apiNamespace')
  //     expect(request.samples).toHaveProperty('resource')
  //     expect(request.samples).toHaveProperty('headers')
  //     expect(request.samples).toHaveProperty('filter')
  //     expect(request.samples).toHaveProperty('include')
  //   })
  //
  // })

  describe('build', () => {

  let api, apis

    beforeEach(() => {
      process.env.VUE_APP_API1_BASE_URL = 'http://api1'
      process.env.VUE_APP_API2_BASE_URL = 'http://api2'

      apis = {
       "api1": {
         "name": "api1",
         "apiNamespace": "api/v1",
         "resources": {
           "resource1": {
             "name": "resource1",
             "filter": {
               "filter1": "foo",
               "filter2": "bar"
             },
             "include": "users"
           },
           "resource2": {}
         }
       },
       "api2": {
         "name": "api2",
         "apiNamespace": "v2",
         "resources": {
           "resource1": {},
           "resource2": {}
         }
       }
     }
     api = BuildRequest.build(apis, process.env)

    })

    it('will create an item for each api', () => {
      expect(Object.keys(api).length).toEqual(Object.keys(apis).length)
    })

    it('will create some requests', () => {
      expect(Object.keys(api.api1).length).toEqual(2)
    })

    it('will create a request component for each resource', () => {
      let request = api.api1.resource1
      expect(request.resource).toEqual(apis.api1.resources.resource1.name)
      expect(request.baseURL).toEqual(process.env.VUE_APP_API1_BASE_URL)
      expect(request.apiNamespace).toEqual(apis.api1.apiNamespace)
      expect(request.filter).toEqual(apis.api1.resources.resource1.filter)
      expect(request.include).toEqual(apis.api1.resources.resource1.include)
    })

  })
})
