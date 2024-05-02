import * as PromiseHelper from '@/api/v1/PromiseHelper'
import Response from '@/api/v1/Response'

describe('PromiseHelper', () => {
  describe('handlePromise', () => {
    describe('resolve', () => {
      it('accepts a promise and returns a Response object', async () => {
        const mockResponse = {
          data: {
            data: [
              {
                id: 1,
                type: 'requests',
                attributes: { name: 'testname1', species: 'testspecies1' },
              },
              {
                id: 2,
                type: 'requests',
                attributes: { name: 'testname2', species: 'testspecies2' },
              },
            ],
          },
          status: 200,
          statusText: 'OK',
        }

        const promise = new Promise((resolve) => {
          resolve(mockResponse)
        })

        const response = await PromiseHelper.handlePromise(promise)
        expect(response).toBeInstanceOf(Response)

        expect(response.status).toEqual(200)
        expect(response.statusText).toEqual('OK')
        expect(response.successful).toBeTruthy()
        expect(response.errors).toEqual({})
      })
    })

    describe('rejects', () => {
      it('accepts a promise and returns a Response object', async () => {
        const mockResponse = {
          data: {
            errors: {
              name: ['name error message 1'],
              species: ['species error message 2.1', 'species error message 2.2'],
            },
          },
          status: 422,
          statusText: 'Unprocessible entity',
        }

        const promise = new Promise((reject) => {
          reject(mockResponse)
        })

        const response = await PromiseHelper.handlePromise(promise)
        expect(response).toBeInstanceOf(Response)

        expect(response.status).toEqual(422)
        const message =
          'name name error message 1, species species error message 2.1, species species error message 2.2'
        expect(response.errors).toEqual({ message: message })
        expect(response.successful).toBeFalsy()
        expect(response.deserialize).toEqual({})
      })
    })
  })
})
