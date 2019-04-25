import * as TubeRequests from '@/api/TubeRequests'
import Vue from 'vue'
import { mount } from '../testHelper'
import Request from '@/api/Request'
import Response from '@/api/Response'

describe('TubeRequests', () => {

  describe('getTubesForBarcodes', () => {
    let cmp, props, wrapper, request, mockResponse

    beforeEach(() => {
      cmp = Vue.extend({
        mixins: [Request],
        render () { return ''}
      })

      props = { baseURL: 'http://sequencescape.com',
                apiNamespace: 'api/v2',
                resource: 'requests' }
      wrapper = mount(cmp, { propsData: props })

      request = wrapper.vm.api
      request.get = jest.fn()

      mockResponse = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      request.get.mockResolvedValue(mockResponse)
    })

    it('will return a response when there are barcodes', async () => {
      let barcodes = 'TRAC-1\nTRAC-2'
      let queryString = TubeRequests.queryString(barcodes)
      let response = await TubeRequests.getTubesForBarcodes(barcodes, request)

      expect(request.get).toBeCalledWith({ filter: { barcode: queryString } })
      let expected = new Response(mockResponse)
      expect(response).toEqual(expected)
    })

    it('will return when there are no barcodes', async () => {
      let barcodes = ''
      await TubeRequests.getTubesForBarcodes(barcodes, request)
      expect(request.get).not.toBeCalled()
    })
  })

  describe('queryString', () => {
    it('will allow one barcode', () => {
      expect(TubeRequests.queryString('TRAC-2')).toEqual('TRAC-2')
    })

    it('will allow multiple barcodes', () => {
      let barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
      expect(TubeRequests.queryString(barcodes)).toEqual('TRAC-1,TRAC-2,TRAC-3,TRAC-4,TRAC-5')
    })
  })
})
