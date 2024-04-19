import Response from '@/api/v1/Response'
import deserialize from '@/api/JsonApi'

describe('Response', () => {
  let mockResponse, response

  it('can be empty', () => {
    expect(new Response({ data: { data: [] }, status: 200, statusText: 'OK' }).empty).toBeTruthy()
  })

  describe('Success', () => {
    beforeEach(() => {
      ;(mockResponse = {
        data: {
          data: [
            { id: 1, type: 'requests', attributes: { name: 'testname1', species: 'testspecies1' } },
            { id: 2, type: 'requests', attributes: { name: 'testname2', species: 'testspecies2' } },
          ],
        },
        status: 200,
        statusText: 'OK',
      }),
        (response = new Response(mockResponse))
    })

    it('has a status', () => {
      expect(response.status).toEqual(200)
    })

    it('has a status text', () => {
      expect(response.statusText).toEqual('OK')
    })

    it('has some attributes', () => {
      const attributes = response.deserialize
      expect(attributes.requests.length).toEqual(2)
      const request = attributes.requests[0]
      expect(request.name).toEqual('testname1')
      expect(request.species).toEqual('testspecies1')
    })

    it('flagged as successful', () => {
      expect(response.successful).toBeTruthy()
    })

    it('is not empty', () => {
      expect(response.empty).toBeFalsy()
    })

    it('has no errors', () => {
      expect(response.errors).toEqual({})
    })

    it('data returns serialized object', () => {
      const serializedObj = deserialize(mockResponse.data)
      expect(response.deserialize).toEqual(serializedObj)
    })
  })

  describe('Failure', () => {
    beforeEach(() => {
      ;(mockResponse = {
        data: {
          errors: {
            name: ['name error message 1'],
            species: ['species error message 2.1', 'species error message 2.2'],
          },
        },
        status: 422,
        statusText: 'Unprocessible entity',
      }),
        (response = new Response(mockResponse, 'requests'))
    })

    it('has a status', () => {
      expect(response.status).toEqual(422)
    })

    it('has some errors', () => {
      const message =
        'name name error message 1, species species error message 2.1, species species error message 2.2'
      expect(response.errors).toEqual({ message: message })
    })

    it('not flagged as successful', () => {
      expect(response.successful).toBeFalsy()
    })

    it('has no data', () => {
      expect(response.deserialize).toEqual({})
    })
  })
})
