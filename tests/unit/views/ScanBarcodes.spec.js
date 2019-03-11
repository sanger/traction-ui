import ScanBarcodes from '@/views/ScanBarcodes'
import { mount, localVue } from '../testHelper'
import TubesJson from '../../data/tubes_with_sample'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'
import Request from '@/api/Request'
import Vue from 'vue'

describe('Scan Barcodes', () => {

  let wrapper, scan, barcodes, barcode, input

  beforeEach(() => {
    barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
    wrapper = mount(ScanBarcodes, { localVue } )
    scan = wrapper.vm
  })

  describe('scanning in barcodes', () => {
    it('single barcode', () => {
      barcode = 'TRAC-1\n'
      input = wrapper.find('textarea')
      input.setValue(barcode)
      expect(scan.barcodes).toEqual(barcode)
      expect(scan.queryString).toEqual('TRAC-1')
    })

    it('multiple barcodes', () => {
      input = wrapper.find('textarea')
      input.setValue(barcodes)
      expect(scan.barcodes).toEqual(barcodes)
      expect(scan.queryString).toEqual('TRAC-1,TRAC-2,TRAC-3,TRAC-4,TRAC-5')
    })

    it('will build a request', () => {
      scan.barcodes = barcodes
      let request = scan.tubeRequest
      expect(request.include).toEqual('material')
    })

    it('no barcodes', () => {
      expect(scan.queryString).toEqual('')
    })
  })

  describe('finding some tubes', () => {

    let emptyResponse, failedResponse, request, cmp, response

    beforeEach(() => {
      emptyResponse = { 'data': { 'data': []}, 'status': 200, 'statusText': 'Success'}
      failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      cmp = Vue.extend(Request)
      request = new cmp({propsData: { baseURL: 'http://sequencescape.com', apiNamespace: 'api/v2', resource: 'requests'}})
      request.get = jest.fn()
      scan.barcodes = barcodes
    })

    it('successfully', async () => {
      request.get.mockResolvedValue(TubesJson)
      response = await scan.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: scan.queryString } })
      expect(response).toEqual(new Response(TubesJson).deserialize.tubes)
      expect(scan.message).toEqual('tubes successfully found')
    })

    it('unsuccessfully', async () => {
      request.get.mockReturnValue(failedResponse)
      response = await scan.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: scan.queryString } })
      expect(response).toEqual(new Response(failedResponse))
      expect(scan.message).toEqual('there was an error')
    })

    it('when no tubes exist', async () => {
      request.get.mockReturnValue(emptyResponse)
      response = await scan.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: scan.queryString } })
      expect(response).toEqual(new Response(emptyResponse))
      expect(scan.message).toEqual('no tubes found')
    })

    it('when there is no query string', async () => {
      scan.barcodes = ''
      response = await scan.findTubes(request)
      expect(request.get).not.toBeCalled()
    })
  })

  describe('scanning in barcodes', () => {

    let input

    describe.skip('sequencescape', () => {

      let sequencescapeBarcodes

      beforeEach(() => {
        sequencescapeBarcodes = 'DN1\nDN2\nDN3\nDN4\nDN5'
        scan.sequencescapeTubeRequest.get = jest.fn()
      })

      it('will build a request', () => {
        expect(scan.sequencescapeTubeRequest).toBeDefined()
      })

      it('successfully', async () => {
        scan.sequencescapeTubeRequest.get.mockResolvedValue(TubesJson)
        const input = wrapper.find('textarea')
        input.setValue(sequencescapeBarcodes)
        let button = wrapper.find('#findSequencescapeTubes')
        button.trigger('click')
        await flushPromises()
        expect(scan.message).toEqual('tubes successfully found')
      })

    })

    describe('traction', () => {

      beforeEach(() => {
        scan.tractionTubeRequest.get = jest.fn()
      })

      it('will build a request', () => {
        expect(scan.tractionTubeRequest).toBeDefined()
      })

      it('successfully', async () => {
        scan.tractionTubeRequest.get.mockResolvedValue(TubesJson)
        input = wrapper.find('textarea')
        input.setValue(barcodes)
        let button = wrapper.find('#findTractionTubes')
        button.trigger('click')
        await flushPromises()
        expect(scan.message).toEqual('tubes successfully found')
      })

    })

  })

})
