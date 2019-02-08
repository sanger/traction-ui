import Response from '@/api/Response'
import Requests from '../../data/requests'

describe('Response', () => {

  let mockResponse, response

  describe('basic', () => {

    describe('Success', () => {
      beforeEach(() => {
        mockResponse =  { 
          data: { 
            data: [
               { id: 1, attributes: { name: "testname1", species: "testspecies1" }},
               { id: 2, attributes: { name: "testname2", species: "testspecies2" }}
            ]
          },
          status: 200,
          statusText: "OK"
        },
        response = new Response(mockResponse, 'requests')
      })

      it('has a status', () => {
        expect(response.status).toEqual(200)
      })

      it('has a status text', () => {
        expect(response.statusText).toEqual('OK')
      })

      it('has some attributes', () => {
        let attributes = response.data
        expect(attributes.requests.length).toEqual(2)
        let request = attributes.requests[0]
        expect(request.name).toEqual('testname1')
        expect(request.species).toEqual('testspecies1')
      })

      it('flagged as successful', () => {
        expect(response.successful).toBeTruthy()
      })

      it('has no errors', () => {
        expect(response.errors).toEqual({})
      })
    })

  })

  describe('Failure', () => {

    beforeEach(() => {
      mockResponse = {
        data: {
          errors: {
            name: ['name error message 1'],
            species: ['species error message 2.1', 'species error message 2.2']
          }
        },
        status: 422,
        statusText: "Unprocessible entity"
      },
      response = new Response(mockResponse, 'requests')
    })

    it('has a status', () => {
      expect(response.status).toEqual(422)
    })

    it('has some errors', () => {
      let message = 'name name error message 1, species species error message 2.1, species species error message 2.2'
      expect(response.errors).toEqual({ message: message})
    })

    it('not flagged as successful', () => {
      expect(response.successful).toBeFalsy()
    })

    it('has no data', () => {
      expect(response.data).toEqual({})
    })

  })

  describe('with associated data', () => {

    let requests, request, expectedResponse

    beforeEach(() => {
      requests = Requests.request
      response = new Response(requests, 'requests', 'samples.sample_metadata')
    })

    it('has the correct number of items', () => {
      expect(response.body.requests.length).toEqual(requests.data.data.length)
    })

    it('includes the correct relationship data', () => {
      expect(response.body.requests[0]).toEqual(Requests.response.requests[0])
    })

  })

  

})
