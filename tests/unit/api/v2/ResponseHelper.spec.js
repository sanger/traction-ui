import { handleResponse, newResponse, parsePrintMyBarcodeErrors } from '@/api/v2/ResponseHelper'
import { it } from 'vitest'

describe('ResponseHelper', () => {
  describe('createResponse', () => {
    describe('successful', () => {
      const rawResponse = {
        success: true,
        body: {
          data: {
            id: 1,
            type: 'nice',
          },
        },
        status: 200,
        statusText: 'OK',
      }

      it('success', () => {
        const response = newResponse(rawResponse)
        expect(response.success).toBeTruthy
      })

      it('data', () => {
        const response = newResponse(rawResponse)
        expect(response.body).toEqual(rawResponse.body)
      })

      it('errors', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toBeUndefined()
      })
    })

    describe('failure with response errors - 422', () => {
      const rawResponse = {
        success: false,
        errors: {
          error1: ['nasty'],
          error2: ['broken', 'crushed'],
        },
        status: 422,
        statusText: 'Unprocessible entity',
      }

      it('success', () => {
        const response = newResponse(rawResponse)
        expect(response.success).toBeFalsy()
      })

      it('errors', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toEqual('error1 nasty, error2 broken, error2 crushed')
        expect(response.body).toEqual({})
      })
    })

    describe('failure with response and error objects - 400', () => {
      const rawResponse = {
        success: false,
        errors: [
          {
            title: 'Invalid field',
            detail: 'tag_group is not a valid includable relationship of tags',
            code: '112',
            status: '400',
          },
        ],
        status: 400,
        statusText: 'Bad Request',
      }

      it('success', () => {
        const response = newResponse(rawResponse)
        expect(response.success).toBeFalsy()
      })

      it('errors', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toEqual(
          'Invalid field tag_group is not a valid includable relationship of tags',
        )
        expect(response.body).toEqual({})
      })
    })

    describe('failure with response and no errors - 500', () => {
      const rawResponse = {
        success: false,
        errors: [
          {
            title: 'Internal Server Error',
            detail: 'Internal Server Error',
            code: '500',
            status: '500',
          },
        ],
        status: 500,
        statusText: 'Internal Server Error',
      }

      it('success', () => {
        const response = newResponse(rawResponse)
        expect(response.success).toBeFalsy()
      })

      it('errors', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toEqual('Internal Server Error Internal Server Error')
        expect(response.body).toEqual({})
      })
    })

    describe('failure without response', () => {
      const rawResponse = {
        success: false,
        error: 'Network error',
        errors: [],
      }

      it('success', () => {
        const response = newResponse(rawResponse)
        expect(response.success).toBeFalsy()
      })

      it('should contain errors array and error object', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toEqual('Network error')
      })

      it('should contain an empty body', () => {
        const response = newResponse(rawResponse)
        expect(response.body).toEqual({})
      })
    })

    describe('failure with print my barcode request', () => {
      const rawResponse = {
        success: false,
        errors: [
          {
            source: {
              pointer: '/data/attributes/printer',
            },
            detail: "can't be blank",
          },
        ],
        status: 422,
        statusText: 'Unprocessible entity',
        errorHandler: parsePrintMyBarcodeErrors,
      }

      it('should contain errors as a string', () => {
        const response = newResponse(rawResponse)
        expect(response.errors).toEqual("printer can't be blank")
      })

      it('should contain an empty body', () => {
        const response = newResponse(rawResponse)
        expect(response.body).toEqual({})
      })
    })
  })

  describe('handleResponse', () => {
    it('successful', async () => {
      const responseData = { data: { id: 1, type: 'love' } }
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(responseData),
      }
      const promise = Promise.resolve(mockResponse)
      const response = await handleResponse(promise)
      expect(response.success).toBeTruthy()
      expect(response.body).toEqual(responseData)
    })

    it('failure with response', async () => {
      const mockResponse = {
        ok: false,
        status: 422,
        statusText: 'Unprocessible entity',
        json: () => Promise.resolve({ errors: { error1: ['is', 'a'] } }),
      }
      const promise = Promise.resolve(mockResponse)
      const errors = await mockResponse.json()
      const expectedResponse = newResponse({ ...errors, success: false })
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

    it('print my barcode failure', async () => {
      const mockResponse = {
        ok: false,
        status: 422,
        statusText: 'Unprocessible entity',
        json: () =>
          Promise.resolve({
            errors: [{ source: { pointer: '/data/attributes/printer' }, detail: "can't be blank" }],
          }),
      }
      const promise = Promise.resolve(mockResponse)
      const errors = await mockResponse.json()
      const expectedResponse = newResponse({
        ...errors,
        success: false,
        errorHandler: parsePrintMyBarcodeErrors,
      })
      const response = await handleResponse(promise, parsePrintMyBarcodeErrors)
      expect(response.success).toBeFalsy()
      expect(response.errors).toEqual(expectedResponse.errors)
    })
  })
})
