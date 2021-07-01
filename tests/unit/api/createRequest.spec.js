import { defaultHeaders, createRequest} from '@/api/createRequest'

describe('createRequest', () => {
  
  describe('basic attributes', () => {

    const attributes = {
      rootURL: 'http://traction',
      apiNamespace: 'v1',
      resource: 'requests',
      headers: {
        header1: 'header1',
        header2: 'header2'
      }
    }

    it('will have a rootURL', () => {
      const request = createRequest({...attributes})
      expect(request.rootURL).toEqual(attributes.rootURL)
    })

    it('will have an api namespace', () => {
      const request = createRequest({...attributes})
      expect(request.apiNamespace).toEqual(attributes.apiNamespace)
    })

    it('will have a resource', () => {
      const request = createRequest({...attributes})
      expect(request.resource).toEqual(attributes.resource)
    })

    it('will have some headers', () => {
      const request = createRequest({...attributes})
      expect(request.headers).toEqual(attributes.headers)
    })

    it('will have some default headers if none were passed', () => {
      const { headers, ...rest } = attributes
      const request = createRequest({...rest})
      expect(request.headers).toEqual(defaultHeaders)
    })

    it('will have a base url', () => {
      const request = createRequest({...attributes})
      expect(request.baseURL).toEqual('http://traction/v1')
    })

    it('will have an api', () => {
      const request = createRequest({...attributes})
      expect(request.api).toBeDefined()
      const api = request.api
      expect(api.defaults.baseURL).toEqual(request.baseURL)
      const headerKeys = Object.keys(api.defaults.headers)
      expect(headerKeys.includes('header1')).toBeTruthy()
      expect(headerKeys.includes('header2')).toBeTruthy()
    })

  })

 
})
