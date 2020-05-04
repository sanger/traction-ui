import Reception from '@/views/pacbio/PacbioReception'
import { mount, localVue, Vuex, Data } from '../../testHelper'
import Response from '@/api/Response'
import Samples from '@/views/pacbio/PacbioSamples'
import Libraries from '@/views/pacbio/PacbioLibraries'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'

describe('Reception', () => {

  let wrapper, reception, barcodes, barcode, input, router

  beforeEach(() => {
    router = new VueRouter({ routes:
      [
        { path: '/pacbio/samples', name: 'PacbioSamples', component: Samples, props: true },
        { path: '/pacbio/libraries', name: 'PacbioLibraries', component: Libraries, props: true }
      ]
    })

    barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
    wrapper = mount(Reception, { localVue, router } )
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
  })

  describe('findSampleExtractionTubes button', () => {

    beforeEach(() => {
      reception.handleSampleExtractionTubes = jest.fn()
    })

    it('calls the right function', () => {
      let input = wrapper.find('textarea')
      input.setValue(barcodes)
      let button = wrapper.find('#findSampleExtractionTubes')
      button.trigger('click')
      expect(reception.handleSampleExtractionTubes).toBeCalled()
    })

  })

  describe('#handleSampleExtractionTubes', () => {
    let failedResponse

    beforeEach(() => {
      let store = new Vuex.Store({
        modules: {
          sampleExtraction: {
            namespaced: true,
            state: {
              sampleExtractionTubes: []
            }
          }
        }
      })

      wrapper = mount(Reception, { localVue, store } )
      reception = wrapper.vm

      reception.getSampleExtractionTubesForBarcodes = jest.fn()
      reception.exportSampleExtractionTubesIntoTraction = jest.fn()
      // reception.handleTractionTubes = jest.fn()
      reception.showAlert = jest.fn()
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })

      failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['Tube could not be found.'] }} }
    })

    it('successfully for samples', async () => {
      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(new Response(Data.SampleExtractionTubesWithSample))
      reception.exportSampleExtractionTubesIntoTraction.mockResolvedValue(new Response(Data.Requests))

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).toBeCalled()
      expect(reception.showAlert).not.toBeCalled()
    })

    it('is unsuccessful when getSampleExtractionTubesForBarcodes fails', async () => {
      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(new Response(Data.SampleExtractionTubesWithSample))
      reception.exportSampleExtractionTubesIntoTraction.mockResolvedValue(new Response(failedResponse))

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).toBeCalled()
      // expect(reception.handleTractionTubes).not.toBeCalled()
      expect(reception.showAlert).toBeCalled()
    })

  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      reception.showAlert('show this message')
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })
  })

  describe('#getBarcodes', () => {
    it('single barcode', () => {
      wrapper.setData({ barcodes: 'TRAC-1\n' })
      let result = reception.getBarcodes()
      expect(result).toEqual(['TRAC-1'])
    })

    it('multiple barcodes', () => {
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5' })
      let result = reception.getBarcodes()
      expect(result).toEqual(['TRAC-1','TRAC-2','TRAC-3','TRAC-4','TRAC-5'])
    })
  })
})
