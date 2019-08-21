import Reception from '@/views/Reception'
import { mount, localVue, store } from '../testHelper'
import TractionSaphyrTubesWithRequestJson from '../../data/tractionSaphyrTubesWithRequest'
// import TractionTubesWithLibrariesJson from '../../data/tubeWithLibrary'
import SequencescapeTubesJson from '../../data/sequencescapeTubesWithSample'
import RequestsJson from '../../data/requests'
import Response from '@/api/Response'
import Samples from '@/views/Samples'
import Libraries from '@/views/Libraries'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'

describe('Reception', () => {

  let wrapper, reception, barcodes, barcode, input

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [
        { path: '/samples', name: 'Samples', component: Samples, props: true },
        { path: '/libraries', name: 'Libraries', component: Libraries, props: true }
      ]
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

  describe('findSequencescapeTubes button', () => {

    beforeEach(() => {
      reception.handleSequencescapeTubes = jest.fn()
    })

    it('calls the right function', () => {
      let input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#findSequencescapeTubes')
      button.trigger('click')
      expect(reception.handleSequencescapeTubes).toBeCalled()
    })

  })

  describe('findTractionTubes button', () => {

    beforeEach(() => {
      reception.handleTractionTubes = jest.fn()
    })

    it('calls the right function', () => {
      const input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#findTractionTubes')
      button.trigger('click')
      expect(reception.handleTractionTubes).toBeCalled()
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
  })

  describe('#handleTractionTubes', () => {

    beforeEach(() => {
      reception.getTractionTubesForBarcodes = jest.fn()
      reception.handleTubeRedirect = jest.fn()
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })

      let expectedResponse = new Response(TractionSaphyrTubesWithRequestJson)
      reception.getTractionTubesForBarcodes.mockReturnValue(expectedResponse)
    })

    it('calls the correct functions', async () => {
      await reception.handleTractionTubes()
      expect(reception.getTractionTubesForBarcodes).toBeCalled()
      expect(reception.handleTubeRedirect).toBeCalled()
    })
  })

  describe('#handleSequencescapeTubes', () => {
    let emptyResponse

    beforeEach(() => {
      reception.getSequencescapeTubesForBarcodes = jest.fn()
      reception.exportSampleTubesIntoTraction = jest.fn()
      reception.handleTubeRedirect = jest.fn()
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })

      emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success'}
    })

    it('calls the correct functions when successful', async () => {
      let sequencescapeTubesResponse = new Response(SequencescapeTubesJson)
      reception.getSequencescapeTubesForBarcodes.mockReturnValue(sequencescapeTubesResponse)

      let requestsJsonResponse = new Response(RequestsJson)
      reception.exportSampleTubesIntoTraction.mockReturnValue(requestsJsonResponse)

      await reception.handleSequencescapeTubes()
      expect(reception.getSequencescapeTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleTubesIntoTraction).toBeCalled()
      expect(reception.handleTubeRedirect).toBeCalled()
    })

    it('errors when getSequencescapeTubesForBarcodes fails', async () => {
      let sequencescapeTubesResponse = new Response(emptyResponse)
      reception.getSequencescapeTubesForBarcodes.mockReturnValue(sequencescapeTubesResponse)

      await reception.handleSequencescapeTubes()
      expect(reception.getSequencescapeTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleTubesIntoTraction).not.toBeCalled()
      expect(reception.handleTubeRedirect).not.toBeCalled()
    })

    it('errors when exportSampleTubesIntoTraction fails', async () => {
      let sequencescapeTubesResponse = new Response(SequencescapeTubesJson)
      reception.getSequencescapeTubesForBarcodes.mockReturnValue(sequencescapeTubesResponse)

      let requestsJsonResponse = new Response(emptyResponse)
      reception.exportSampleTubesIntoTraction.mockReturnValue(requestsJsonResponse)

      await reception.handleSequencescapeTubes()
      expect(reception.getSequencescapeTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleTubesIntoTraction).toBeCalled()
      expect(reception.handleTubeRedirect).not.toBeCalled()
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      wrapper.setData({ message: 'show this message' })
      reception.showAlert()
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })
  })

  describe('#getBarcodes', () => {
    it('single barcode', () => {
      barcode = 'TRAC-1\n'
      input = wrapper.find('textarea')
      input.setValue(barcode)
      let result = reception.getBarcodes()
      expect(result).toEqual('TRAC-1')
    })

    it('multiple barcodes', () => {
      input = wrapper.find('textarea')
      input.setValue(barcodes)
      let result = reception.getBarcodes()
      expect(result).toEqual('TRAC-1,TRAC-2,TRAC-3,TRAC-4,TRAC-5')
    })
  })

  describe('#handleTubeRedirect', () => {

  })
})
