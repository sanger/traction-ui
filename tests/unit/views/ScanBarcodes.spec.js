import ScanBarcodes from '@/views/ScanBarcodes'
import { mount, localVue } from '../testHelper'
import TractionTubesJson from '../../data/traction_tubes_with_sample'
import SSTubesJson from '../../data/ss_tubes_with_sample'
import SamplesJson from '../../data/samples'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'
import Request from '@/api/Request'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Table from '@/views/Table'
import Alert from '@/components/Alert'

describe('Scan Barcodes', () => {

  let wrapper, scan, barcodes, barcode, input

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [{ path: '/table', name: 'Table', component: Table, props: true }]
    })

    barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
    wrapper = mount(ScanBarcodes, { localVue, router } )
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

    // it('will build a request', () => {
    //   scan.barcodes = barcodes
    //   let request = scan.tubeRequest
    //   expect(request.include).toEqual('material')
    // })

    it('no barcodes', () => {
      expect(scan.queryString).toEqual('')
    })
  })

  describe('#findTubes', () => {

    let emptyResponse, failedResponse, request, cmp, response

    beforeEach(() => {
      emptyResponse = { data: { data: []}, status: 200, statusText: 'Success'}
      failedResponse = { data: { }, status: 500, statusText: 'Internal Server Error' }
      cmp = Vue.extend(Request)
      request = new cmp({propsData: { baseURL: 'http://sequencescape.com', apiNamespace: 'api/v2', resource: 'requests'}})
      request.get = jest.fn()
      scan.barcodes = barcodes
    })

    it('successfully', async () => {
      request.get.mockResolvedValue(TractionTubesJson)
      response = await scan.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: scan.queryString } })
      expect(response).toEqual(new Response(TractionTubesJson).deserialize.tubes)
      expect(scan.message).toEqual('Tubes successfully found')
    })

    it('unsuccessfully', async () => {
      request.get.mockReturnValue(failedResponse)
      response = await scan.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: scan.queryString } })
      expect(response).toEqual(new Response(failedResponse))
      expect(scan.message).toEqual('There was an error')
    })

    it('when no tubes exist', async () => {
      request.get.mockReturnValue(emptyResponse)
      response = await scan.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: scan.queryString } })
      expect(response).toEqual(new Response(emptyResponse))
      expect(scan.message).toEqual('No tubes found')
    })

    it('when there is no query string', async () => {
      scan.barcodes = ''
      response = await scan.findTubes(request)
      expect(request.get).not.toBeCalled()
    })
  })

  describe('#handleTractionTubes', () => {

    beforeEach(() => {
      scan.tractionTubeRequest.get = jest.fn()
    })

    it('will build a request', () => {
      expect(scan.tractionTubeRequest).toBeDefined()
    })

    it('successfully', async () => {
      scan.tractionTubeRequest.get.mockResolvedValue(TractionTubesJson)
      input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#findTractionTubes')
      button.trigger('click')
      await flushPromises()
      expect(scan.message).toEqual('Tubes successfully found')
      expect(scan.$route.path).toEqual('/table')
    })

  })

  describe('#handleSequencescapeTubes', () => {

    let sequencescapeBarcodes

    beforeEach(() => {
      sequencescapeBarcodes = 'DN1\nDN2\nDN3\nDN4\nDN5'
      scan.sequencescapeTubeRequest.get = jest.fn()
      scan.exportSampleTubesIntoTraction = jest.fn()
      scan.handleTractionTubes = jest.fn()
    })

    it('will build a request', () => {
      expect(scan.sequencescapeTubeRequest).toBeDefined()
    })

    it('successfully', async () => {
      scan.sequencescapeTubeRequest.get.mockResolvedValue(SSTubesJson)
      const input = wrapper.find('textarea')
      input.setValue(sequencescapeBarcodes)
      let button = wrapper.find('#findSequencescapeTubes')
      button.trigger('click')
      await flushPromises()
      await flushPromises()
      await flushPromises()

      let tubes = new Response(SSTubesJson).deserialize.tubes
      expect(scan.exportSampleTubesIntoTraction).toBeCalledWith(tubes)
      expect(scan.handleTractionTubes).toBeCalled()
      expect(scan.message).toEqual('Tubes successfully found')
    })

  })

  describe('#exportSampleTubesIntoTraction', () => {
    let ssTubes

    beforeEach(() => {
      scan.sampleRequest.create = jest.fn()
      ssTubes = new Response(SSTubesJson).deserialize.tubes
    })

    it('successfully', async () => {
      scan.sampleRequest.create.mockResolvedValue(SamplesJson)
      let response = await scan.exportSampleTubesIntoTraction(ssTubes)

      expect(scan.sampleRequest.create).toBeCalled()
      let tractionSamplesTubesBarcode = new Response(SamplesJson).deserialize.samples.map(s=> s.barcode).join('\n')
      expect(scan.barcodes).toEqual(tractionSamplesTubesBarcode)
      expect(response).toEqual(new Response(SamplesJson))
    })

    it('unsuccessfully', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }

      scan.sampleRequest.create.mockResolvedValue(failedResponse)
      let response = await scan.exportSampleTubesIntoTraction(ssTubes)

      expect(scan.sampleRequest.create).toBeCalled()
      expect(response).toEqual(new Response(failedResponse))
      expect(scan.message).toEqual('name error message')
    })

  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      wrapper.setData({ message: 'show this message' })
      scan.showAlert()
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })
  })
})