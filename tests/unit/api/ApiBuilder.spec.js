import * as ApiBuilder from '@/api/ApiBuilder.js'

import.meta.env.VITE_API1_BASE_URL = 'http://api1'
import.meta.env.VITE_API2_BASE_URL = 'http://api2'
import.meta.env.VITE_API3_BASE_URL = 'http://api3'
import.meta.env.CUSTOM_HEADER_KEY = 'test'

const config = [
  {
    name: 'api1',
    apiNamespace: 'api/v1',
    rootURL: import.meta.env['VITE_API1_BASE_URL'],
    resources: [
      {
        name: 'resource1',
      },
      {
        name: 'resource2',
      },
    ],
    urls: [
      {
        name: 'feature_flags',
        url: '/flipper/api/actors/User',
      },
    ],
  },
  {
    name: 'api2',
    apiNamespace: 'v2',
    rootURL: import.meta.env['VITE_API2_BASE_URL'],
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
    rootURL: import.meta.env['VITE_API3_BASE_URL'],
    headers: {
      'custom-header': import.meta.env['CUSTOM_HEADER_KEY'],
    },
    resources: [
      {
        name: 'samples',
      },
    ],
    pipelines: [
      {
        name: 'pacbio',
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

const api = ApiBuilder.build({ config })

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
    expect(request1.api.headers).toEqual({
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    })

    const request2 = api.api2.resource1
    expect(request2.rootURL).toEqual(import.meta.env.VITE_API2_BASE_URL)
    expect(request2.apiNamespace).toEqual('v2')
    expect(request2.resource).toEqual('resource1')
    expect(request2.api.headers).toEqual({
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    })

    const request3 = api.api2.resource2
    expect(request3.rootURL).toEqual(import.meta.env.VITE_API2_BASE_URL)
    expect(request3.apiNamespace).toEqual('v2')
    expect(request3.resource).toEqual('resource2')
    expect(request3.api.headers).toEqual({
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    })

    const request4 = api.api3.samples
    expect(request4.rootURL).toEqual(import.meta.env.VITE_API3_BASE_URL)
    expect(request4.apiNamespace).toEqual('v3')
    expect(request4.resource).toEqual('samples')
    expect(request4.api.headers).toEqual({
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
      'custom-header': 'test',
    })
  })

  it('will create a list of urls for each api', () => {
    expect(api.api1.urls.feature_flags).toBeDefined()
    expect(api.api1.urls.feature_flags.url).toEqual(
      `${import.meta.env.VITE_API1_BASE_URL}/flipper/api/actors/User`,
    )
  })

  describe('pipelines', () => {
    it('creates a pipeline', () => {
      expect(api.api3.pacbio).toBeDefined()
    })

    it('creates resources for the pipeline', () => {
      const request = api.api3.pacbio

      expect(request.libraries).toBeDefined()
      expect(request.flowcells).toBeDefined()
    })

    it('creates the correct resource for each request', () => {
      const request = api.api3.pacbio

      expect(request.libraries.resource).toEqual('pacbio/libraries')
      expect(request.flowcells.resource).toEqual('pacbio/flowcells')
    })
  })

  it('will create nested resources if they exist', () => {
    const runs = api.api3.pacbio.runs

    expect(runs.plates).toBeDefined()
    expect(runs.plates.resource).toEqual('pacbio/runs/plates')

    expect(runs.wells).toBeDefined()
    expect(runs.wells.resource).toEqual('pacbio/runs/wells')
  })
})
