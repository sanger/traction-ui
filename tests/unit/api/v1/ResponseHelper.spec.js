import { handleResponse, newResponse } from '@/api/v1/ResponseHelper'

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

    describe('failure with response errors - 422', () => {
      const rawResponse = {
        success: false,
        data: {
          data: {
            errors: {
              error1: ['nasty'],
              error2: ['broken', 'crushed'],
            },
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

    describe('failure with response and error objects - 400', () => {
      const rawResponse = {
        success: false,
        data: {
          errors: [
            {
              title: 'Invalid field',
              detail: 'tag_group is not a valid includable relationship of tags',
              code: '112',
              status: '400',
            },
          ],
        },
        status: 400,
        statusText: 'Bad Request',
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
        expect(response.errors).toEqual(
          'Invalid field tag_group is not a valid includable relationship of tags',
        )
      })
    })

    describe('failure with response and no errors - 400-500', () => {
      const rawResponse = {
        success: false,
        data: { data: 'There was a serious problem' },
        status: 500,
        statusText: 'Internal Server Error',
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
        expect(response.errors).toEqual('There was a serious problem')
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
