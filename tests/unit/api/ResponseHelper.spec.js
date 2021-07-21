import { handleResponse, newResponse } from '@/api/ResponseHelper'

describe('ResponseHelper', () => {
  describe('createResponse', () => {
    describe('successful', () => {
      const rawResponse = {
        success: true,
        data: {
          data: {
            id: 1,
            type: 'nice',
          },
          status: 200,
          statusText: 'OK',
        },
      }

      it('success', () => {
        const response = newResponse(rawResponse)
        expect(response.success).toBeTruthy
      })

      it('data', () => {
        const response = newResponse(rawResponse)
        expect(response.data).toEqual(rawResponse.data)
      })

      it('errors', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toBeUndefined()
      })
    })

    describe('failure with response', () => {
      const rawResponse = {
        success: false,
        data: {
          errors: {
            error1: ['nasty'],
            error2: ['broken', 'crushed'],
          },
          status: 422,
          statusText: 'Unprocessible entity',
        },
      }

      it('success', () => {
        const response = newResponse(rawResponse)
        expect(response.success).toBeFalsy()
      })

      it('data', () => {
        const response = newResponse(rawResponse)
        expect(response.data).toEqual(rawResponse.data)
      })

      it('errors', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toEqual('error1 nasty, error2 broken, error2 crushed')
      })
    })

    describe('failure without response', () => {
      const rawResponse = {
        success: false,
        error: 'Network error',
      }

      it('success', () => {
        const response = newResponse(rawResponse)
        expect(response.success).toBeFalsy()
      })

      it('data', () => {
        const response = newResponse(rawResponse)
        expect(response.data).toBeUndefined()
      })

      it('errors', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toEqual('Network error')
      })
    })
  })

  describe('handleResponse', () => {
    it('successful', async () => {
      const mockResponse = {
        data: { data: { id: 1, type: 'love' } },
        status: 200,
        statusText: 'OK',
      }
      const promise = Promise.resolve(mockResponse)
      const response = await handleResponse(promise)
      expect(response.success).toBeTruthy()
      expect(response.data).toEqual(mockResponse.data)
    })

    it('failure with response', async () => {
      const mockResponse = {
        response: { data: { errors: { error1: ['is', 'a'] } }, status: 422, statusText: 'OK' },
      }
      const promise = Promise.reject(mockResponse)
      const expectedResponse = newResponse({ ...mockResponse.response, success: false })
      const response = await handleResponse(promise)
      expect(response.success).toBeFalsy()
      expect(response.errors).toEqual(expectedResponse.errors)
    })

    it('failure no response and error', async () => {
      const error = new Error('rollercoaster')
      const promise = Promise.reject(error)
      const response = await handleResponse(promise)
      expect(response.success).toBeFalsy()
      expect(response.errors).toEqual(error)
    })
  })
})

// describe('PromiseHelper', () => {
//   describe('handlePromise', () => {
//     describe('resolve', () => {
//       it('accepts a promise and returns a Response object', async () => {
//         let mockResponse = {
//           data: {
//             data: [
//               {
//                 id: 1,
//                 type: 'requests',
//                 attributes: { name: 'testname1', species: 'testspecies1' },
//               },
//               {
//                 id: 2,
//                 type: 'requests',
//                 attributes: { name: 'testname2', species: 'testspecies2' },
//               },
//             ],
//           },
//           status: 200,
//           statusText: 'OK',
//         }

//         let promise = new Promise((resolve) => {
//           resolve(mockResponse)
//         })

//         let response = await PromiseHelper.handlePromise(promise)
//         expect(response).toBeInstanceOf(Api.Response)

//         expect(response.status).toEqual(200)
//         expect(response.statusText).toEqual('OK')
//         expect(response.successful).toBeTruthy()
//         expect(response.errors).toEqual({})
//       })
//     })

//     describe('rejects', () => {
//       it('accepts a promise and returns a Response object', async () => {
//         let mockResponse = {
//           data: {
//             errors: {
//               name: ['name error message 1'],
//               species: ['species error message 2.1', 'species error message 2.2'],
//             },
//           },
//           status: 422,
//           statusText: 'Unprocessible entity',
//         }

//         let promise = new Promise((reject) => {
//           reject(mockResponse)
//         })

//         let response = await PromiseHelper.handlePromise(promise)
//         expect(response).toBeInstanceOf(Api.Response)

//         expect(response.status).toEqual(422)
//         let message =
//           'name name error message 1, species species error message 2.1, species species error message 2.2'
//         expect(response.errors).toEqual({ message: message })
//         expect(response.successful).toBeFalsy()
//         expect(response.deserialize).toEqual({})
//       })
//     })

//     describe('test the promise', () => {
//       it('with a standard error', async () => {
//         const promise = Promise.reject(new Error('There was an error'))
//         try {
//           await PromiseHelper.handlePromise(promise)
//         } catch(error) {
//           console.log(error)
//         }
//       })

//       it.only('with axios - 422', async () => {
//         let mockResponse = {
//           data: {
//             errors: {
//               name: ['name error message 1'],
//               species: ['species error message 2.1', 'species error message 2.2'],
//             },
//           },
//           status: 422,
//           statusText: 'Unprocessible entity',
//         }

//         const mock = jest.spyOn(axios, 'post')
//         mock.mockRejectedValue(mockResponse)
//         try {
//           await axios.post('/blah', {id: 1})
//         } catch(error) {
//           console.log(error)
//         }

//       })
//     })
//   })
// })
