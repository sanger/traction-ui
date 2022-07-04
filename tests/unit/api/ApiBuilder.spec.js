import * as ApiBuilder from '@/api/ApiBuilder'

import.meta.env.VITE_API1_BASE_URL = 'http://api1'
import.meta.env.VITE_API2_BASE_URL = 'http://api2'
import.meta.env.VITE_API3_BASE_URL = 'http://api3'

const config = [
  {
    name: 'api1',
    apiNamespace: 'api/v1',
    baseURL: 'VITE_API1_BASE_URL',
    resources: [
      {
        name: 'resource1',
      },
      {
        name: 'resource2',
      },
    ],
  },
  {
    name: 'api2',
    apiNamespace: 'v2',
    baseURL: 'VITE_API2_BASE_URL',
    resources: [
      {
        name: 'resource1',
      },
      {
        name: 'resource2',
      },
    ],
  },
  {
    name: 'api3',
    apiNamespace: 'v3',
    baseURL: 'VITE_API3_BASE_URL',
    resources: [
      {
        name: 'samples',
      },
    ],
    pipelines: [
      {
        name: 'saphyr',
        resources: [
          {
            name: 'libraries',
          },
          {
            name: 'flowcells',
          },
          {
            name: 'runs',
            resources: [
              {
                name: 'plates',
              },
              {
                name: 'wells',
              },
            ],
          },
        ],
      },
    ],
  },
]

const api = ApiBuilder.build({ config, environment: import.meta.env })

describe('ApiBuilder', () => {
  describe('build', () => {
    it('defines keys for each api', () => {
      expect(Object.keys(api)).toEqual(['api1', 'api2', 'api3'])
      expect(api.api1).toBeDefined()
      expect(api.api2).toBeDefined()
      expect(api.api3).toBeDefined()
    })
  })

  it('will create an item for each resource of the api', () => {
    expect(api.api1.resource1).toBeDefined()
    expect(api.api2.resource1).toBeDefined()
    expect(api.api2.resource2).toBeDefined()
    expect(api.api3.samples).toBeDefined()
  })

  it('will create a request component for each resource', () => {
    const request1 = api.api1.resource1
    expect(request1.rootURL).toEqual(import.meta.env.VITE_API1_BASE_URL)
    expect(request1.apiNamespace).toEqual('api/v1')
    expect(request1.resource).toEqual('resource1')
    expect(request1.headers).toBeDefined()

    const request2 = api.api2.resource1
    expect(request2.rootURL).toEqual(import.meta.env.VITE_API2_BASE_URL)
    expect(request2.apiNamespace).toEqual('v2')
    expect(request2.resource).toEqual('resource1')
    expect(request2.headers).toBeDefined()

    const request3 = api.api2.resource2
    expect(request3.rootURL).toEqual(import.meta.env.VITE_API2_BASE_URL)
    expect(request3.apiNamespace).toEqual('v2')
    expect(request3.resource).toEqual('resource2')
    expect(request3.headers).toBeDefined()

    const request4 = api.api3.samples
    expect(request4.rootURL).toEqual(import.meta.env.VITE_API3_BASE_URL)
    expect(request4.apiNamespace).toEqual('v3')
    expect(request4.resource).toEqual('samples')
    expect(request4.headers).toBeDefined()
  })

  describe('pipelines', () => {
    it('creates a pipeline', () => {
      expect(api.api3.saphyr).toBeDefined()
    })

    it('creates resources for the pipeline', () => {
      const request = api.api3.saphyr

      expect(request.libraries).toBeDefined()
      expect(request.flowcells).toBeDefined()
    })

    it('creates the correct resource for each request', () => {
      const request = api.api3.saphyr

      expect(request.libraries.resource).toEqual('saphyr/libraries')
      expect(request.flowcells.resource).toEqual('saphyr/flowcells')
    })
  })

  it('will create nested resources if they exist', () => {
    const runs = api.api3.saphyr.runs

    expect(runs.plates).toBeDefined()
    expect(runs.plates.resource).toEqual('saphyr/runs/plates')

    expect(runs.wells).toBeDefined()
    expect(runs.wells.resource).toEqual('saphyr/runs/wells')
  })
})
