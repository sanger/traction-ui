import * as ApiBuilder from '@/api/ApiBuilder'
import Request from '@/api/Request'

process.env.VUE_APP_API1_BASE_URL = 'http://api1'
process.env.VUE_APP_API2_BASE_URL = 'http://api2'
process.env.VUE_APP_API3_BASE_URL = 'http://api3'

describe('ApiBuilder', () => {
  describe('build', () => {
    let api, apis

    beforeEach(() => {
      apis = {
        api1: {
          name: 'api1',
          apiNamespace: 'api/v1',
          resources: {
            resource1: {
              name: 'resource1',
              filter: {
                filter1: 'foo',
                filter2: 'bar',
              },
              include: 'users',
            },
            resource2: {},
          },
        },
        api2: {
          name: 'api2',
          apiNamespace: 'v2',
          resources: {
            resource1: {
              name: 'resource1',
            },
            resource2: {
              name: 'resource2',
            },
          },
        },
        api3: {
          name: 'api3',
          apiNamespace: 'v3',
          resources: {
            samples: {
              name: 'samples',
            },
            saphyr: {
              libraries: {
                name: 'libraries',
              },
              flowcells: {
                name: 'flowcells',
              },
              runs: {
                name: 'runs',
                resources: {
                  plates: {
                    name: 'plates',
                  },
                  wells: {
                    name: 'wells',
                  },
                },
              },
            },
          },
        },
      }
      api = ApiBuilder.build(apis, process.env)
    })

    it('will create an item for each api', () => {
      expect(Object.keys(api)).toEqual(['api1', 'api2', 'api3'])
      expect(api.api1).toBeDefined()
      expect(api.api2).toBeDefined()
      expect(api.api3).toBeDefined()
    })

    it('will create an item for each resource of the api', () => {
      expect(api.api1.resource1).toBeDefined()
      expect(api.api2.resource1).toBeDefined()
      expect(api.api2.resource2).toBeDefined()
      expect(api.api3.samples).toBeDefined()
      expect(api.api3.saphyr.libraries).toBeDefined()
      expect(api.api3.saphyr.flowcells).toBeDefined()
    })

    it('will create a request component for each resource', () => {
      let request1 = api.api1.resource1
      expect(request1.baseURL).toEqual(process.env.VUE_APP_API1_BASE_URL)
      expect(request1.apiNamespace).toEqual(apis.api1.apiNamespace)
      expect(request1.resource).toEqual(apis.api1.resources.resource1.name)
      expect(request1.headers).toBeDefined()
      expect(request1.filter).toEqual(apis.api1.resources.resource1.filter)
      expect(request1.include).toEqual(apis.api1.resources.resource1.include)

      let request2 = api.api2.resource1
      expect(request2.baseURL).toEqual(process.env.VUE_APP_API2_BASE_URL)
      expect(request2.apiNamespace).toEqual(apis.api2.apiNamespace)
      expect(request2.resource).toEqual(apis.api2.resources.resource1.name)
      expect(request2.headers).toBeDefined()
      expect(request2.filter).toEqual({})
      expect(request2.include).toEqual('')

      let request3 = api.api2.resource2
      expect(request3.baseURL).toEqual(process.env.VUE_APP_API2_BASE_URL)
      expect(request3.apiNamespace).toEqual(apis.api2.apiNamespace)
      expect(request3.resource).toEqual(apis.api2.resources.resource2.name)
      expect(request3.headers).toBeDefined()
      expect(request3.filter).toEqual({})
      expect(request3.include).toEqual('')

      let request4 = api.api3.samples
      expect(request4.baseURL).toEqual(process.env.VUE_APP_API3_BASE_URL)
      expect(request4.apiNamespace).toEqual(apis.api3.apiNamespace)
      expect(request4.resource).toEqual('samples')
      expect(request4.headers).toBeDefined()
      expect(request4.filter).toEqual({})
      expect(request4.include).toEqual('')

      let request5 = api.api3.saphyr.libraries
      expect(request5.baseURL).toEqual(process.env.VUE_APP_API3_BASE_URL)
      expect(request5.apiNamespace).toEqual(apis.api3.apiNamespace)
      expect(request5.resource).toEqual('saphyr/libraries')
      expect(request5.headers).toBeDefined()
      expect(request5.filter).toEqual({})
      expect(request5.include).toEqual('')

      let request6 = api.api3.saphyr.flowcells
      expect(request6.baseURL).toEqual(process.env.VUE_APP_API3_BASE_URL)
      expect(request6.apiNamespace).toEqual(apis.api3.apiNamespace)
      expect(request6.resource).toEqual('saphyr/flowcells')
      expect(request6.headers).toBeDefined()
      expect(request6.filter).toEqual({})
      expect(request6.include).toEqual('')
    })

    it('will create nested resources if they exist', () => {
      const runs = api.api3.saphyr.runs

      expect(runs.plates).toBeDefined()
      expect(runs.wells).toBeDefined()

      const plates = runs.plates
      expect(plates.baseURL).toEqual(process.env.VUE_APP_API3_BASE_URL)
      expect(plates.apiNamespace).toEqual(apis.api3.apiNamespace)
      expect(plates.resource).toEqual('saphyr/runs/plates')

      const wells = runs.wells
      expect(wells.baseURL).toEqual(process.env.VUE_APP_API3_BASE_URL)
      expect(wells.apiNamespace).toEqual(apis.api3.apiNamespace)
      expect(wells.resource).toEqual('saphyr/runs/wells')
    })
  })

  describe('buildComponent', () => {
    it('creates a new component with given props', () => {
      let cmp = ApiBuilder.buildComponent(Request, {
        baseURL: 'aname',
        apiNamespace: 'abc',
        resource: 'cats',
      })
      expect(cmp.baseURL).toEqual('aname')
      expect(cmp.apiNamespace).toEqual('abc')
      expect(cmp.resource).toEqual('cats')
    })
  })
})
