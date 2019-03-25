import * as ApiBuilder from '@/api/ApiBuilder'
import Api from '@/api'

describe('ApiBuilder', () => {

  describe('buildComponent', () => {
    it('creates a new component with given props', () => {
      let cmp = ApiBuilder.buildComponent(Api.ConfigItem, {name: 'aname', apiNamespace: 'abc'})
      expect(cmp.name).toEqual('aname')
      expect(cmp.apiNamespace).toEqual('abc')
    })
  })

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
      api = ApiBuilder.build(apis, process.env)
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
