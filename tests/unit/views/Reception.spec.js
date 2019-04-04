import Reception from '@/views/Reception'
import { mount, localVue, store } from '../testHelper'
import TractionTubesJson from '../../data/tractionTubesWithSample'
import SequencescapeTubesJson from '../../data/sequencescapeTubesWithSample'
import SamplesJson from '../../data/samples'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'
import Request from '@/api/Request'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Table from '@/views/Table'
import Alert from '@/components/Alert'

describe('Reception', () => {

  let wrapper, reception, barcodes, barcode, input

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [{ path: '/table', name: 'Table', component: Table, props: true }]
    })

    barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
    wrapper = mount(Reception, { localVue, router, store } )
    reception = wrapper.vm
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  describe('scanning in barcodes', () => {
    it('single barcode', () => {
      barcode = 'TRAC-1\n'
      input = wrapper.find('textarea')
      input.setValue(barcode)
      expect(reception.barcodes).toEqual(barcode)
    })

    it('multiple barcodes', () => {
      input = wrapper.find('textarea')
      input.setValue(barcodes)
      expect(reception.barcodes).toEqual(barcodes)
    })

    it('no barcodes', () => {
      expect(reception.queryString).toEqual('')
    })
  })

  describe('#queryString', () => {
    it('will allow the user to scan in a barcopde', () => {
      wrapper.setData({ barcodes: 'TRAC-2' })
      expect(reception.queryString).toEqual('TRAC-2')
    })

    it('will allow the user to scan in multiple barcodes', () => {
      wrapper.setData({ barcodes: barcodes })
      expect(reception.queryString).toEqual('TRAC-1,TRAC-2,TRAC-3,TRAC-4,TRAC-5')
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
      reception.barcodes = barcodes
    })

    it('successfully', async () => {
      request.get.mockResolvedValue(TractionTubesJson)
      response = await reception.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: reception.queryString } })
      expect(response).toEqual(new Response(TractionTubesJson).deserialize.tubes)
      expect(reception.message).toEqual('Tubes successfully found')
    })

    it('unsuccessfully', async () => {
      request.get.mockReturnValue(failedResponse)
      response = await reception.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: reception.queryString } })
      expect(response).toEqual(new Response(failedResponse))
      expect(reception.message).toEqual('There was an error')
    })

    it('when no tubes exist', async () => {
      request.get.mockReturnValue(emptyResponse)
      response = await reception.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: reception.queryString } })
      expect(response).toEqual(new Response(emptyResponse))
      expect(reception.message).toEqual('No tubes found')
    })

    it('when there is no query string', async () => {
      reception.barcodes = ''
      response = await reception.findTubes(request)
      expect(request.get).not.toBeCalled()
    })
  })

  describe('#handleTractionTubes', () => {

    beforeEach(() => {
      reception.tractionTubeRequest.get = jest.fn()
    })

    it('will build a request', () => {
      expect(reception.tractionTubeRequest).toBeDefined()
    })

    it('successfully', async () => {
      reception.tractionTubeRequest.get.mockResolvedValue(TractionTubesJson)
      input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#findTractionTubes')
      button.trigger('click')
      await flushPromises()
      expect(reception.message).toEqual('Tubes successfully found')
      expect(reception.$route.path).toEqual('/table')
    })

  })

  describe('#handleSequencescapeTubes', () => {

    let sequencescapeBarcodes

    beforeEach(() => {
      sequencescapeBarcodes = 'DN1\nDN2\nDN3\nDN4\nDN5'
      reception.sequencescapeTubeRequest.get = jest.fn()
      reception.exportSampleTubesIntoTraction = jest.fn()
      reception.handleTractionTubes = jest.fn()
    })

    it('will build a request', () => {
      expect(reception.sequencescapeTubeRequest).toBeDefined()
    })

    it('successfully', async () => {
      reception.sequencescapeTubeRequest.get.mockResolvedValue(SequencescapeTubesJson)
      const input = wrapper.find('textarea')
      input.setValue(sequencescapeBarcodes)
      let button = wrapper.find('#findSequencescapeTubes')
      button.trigger('click')
      await flushPromises()
      await flushPromises()
      await flushPromises()

      let tubes = new Response(SequencescapeTubesJson).deserialize.tubes
      expect(reception.exportSampleTubesIntoTraction).toBeCalledWith(tubes)
      expect(reception.handleTractionTubes).toBeCalled()
      expect(reception.message).toEqual('Tubes successfully found')
    })

  })

  describe('#sampleTubesJson', () => {

    it('will convert a deserialized response to the correct format', () => {
      let tubes = new Response(SequencescapeTubesJson).deserialize.tubes
      let json = reception.sampleTubesJson(tubes)
      let tube = json[0]
      expect(tube.external_id).toBeDefined()
      expect(tube.external_id.includes('-')).toBeTruthy()
      expect(tube.external_study_id).toBeDefined()
      expect(tube.external_id.includes('-')).toBeTruthy()
      expect(tube.name).toBeDefined()
      expect(tube.species).toBeDefined()
    })
  })

  describe('#exportSampleTubesIntoTraction', () => {
    let ssTubes

    beforeEach(() => {
      reception.sampleRequest.create = jest.fn()
      ssTubes = new Response(SequencescapeTubesJson).deserialize.tubes
    })

    it('successfully', async () => {
      reception.sampleRequest.create.mockResolvedValue(SamplesJson)
      let response = await reception.exportSampleTubesIntoTraction(ssTubes)

      expect(reception.sampleRequest.create).toBeCalled()
      let tractionSamplesTubesBarcode = new Response(SamplesJson).deserialize.samples.map(s=> s.barcode).join('\n')
      expect(reception.barcodes).toEqual(tractionSamplesTubesBarcode)
      expect(response).toEqual(new Response(SamplesJson))
    })

    it('unsuccessfully', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }

      reception.sampleRequest.create.mockResolvedValue(failedResponse)
      let response = await reception.exportSampleTubesIntoTraction(ssTubes)

      expect(reception.sampleRequest.create).toBeCalled()
      expect(response).toEqual(new Response(failedResponse))
      expect(reception.message).toEqual('name error message')
    })

  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      wrapper.setData({ message: 'show this message' })
      reception.showAlert()
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })
  })

  describe('#sequencescapeTubeRequest', () => {
    it('will have a request', () => {
      expect(reception.sequencescapeTubeRequest).toBeDefined()
    })
  })

  describe('#tractionTubeRequest', () => {
    it('will have a request', () => {
      expect(reception.tractionTubeRequest).toBeDefined()
    })
  })

  describe('#sampleRequest', () => {
    it('will have a request', () => {
      expect(reception.sampleRequest).toBeDefined()
    })
  })
})
