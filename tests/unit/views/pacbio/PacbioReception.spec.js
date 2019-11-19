import Reception from '@/views/pacbio/PacbioReception'
import { mount, localVue, Vuex, Data } from '../../testHelper'
import Response from '@/api/Response'
import Samples from '@/views/pacbio/PacbioSamples'
import Libraries from '@/views/pacbio/PacbioLibraries'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'

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

  describe('#handleTractionTubes', () => {
    let barcodeList

    beforeEach(() => {
      let store = new Vuex.Store({
        modules: {
          traction: {
            namespaced: true,
            modules: {
              pacbio: {
                namespaced: true,
                  modules: {
                    tubes: {
                      namespaced: true,
                      state: {
                        tractionTubes: []
                      }
                    }
                  }
              }
            }
          }
        }
      })

      wrapper = mount(Reception, { localVue, store } )
      reception = wrapper.vm

      reception.getTractionTubesForBarcodes = jest.fn()
      reception.checkBarcodes = jest.fn()
      reception.checkMaterialTypes = jest.fn()

      barcodeList = ['TRAC-1', 'TRAC-2']
    })

    describe('successful', () => {
      it('calls the correct functions when the tubes are requests', async () => {
        let expectedResponse = new Response(Data.TractionSaphyrTubesWithRequest)
        reception.getTractionTubesForBarcodes.mockReturnValue(expectedResponse)

        await reception.handleTractionTubes(barcodeList)

        expect(reception.getTractionTubesForBarcodes).toBeCalled()
        expect(reception.checkBarcodes).toBeCalled()
        expect(reception.checkMaterialTypes).toBeCalled()
      })

      it('calls the correct functions when the tubes are libraries', async () => {
        let expectedResponse = new Response(Data.TubeWithLibrary)
        reception.getTractionTubesForBarcodes.mockReturnValue(expectedResponse)

        await reception.handleTractionTubes(barcodeList)

        expect(reception.getTractionTubesForBarcodes).toBeCalled()
        expect(reception.checkBarcodes).toBeCalled()
        expect(reception.checkMaterialTypes).toBeCalled()
      })
    })

    describe('unsuccessful', () => {
      it('calls the correct functions when the tubes are requests', async () => {
        let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { it: ['did not work'] }} }

        let expectedResponse = new Response(failedResponse)
        reception.getTractionTubesForBarcodes.mockReturnValue(expectedResponse)

        await expect(reception.handleTractionTubes(barcodeList)).rejects.toThrow(
          consts.MESSAGE_ERROR_GET_TRACTION_TUBES)

        expect(reception.getTractionTubesForBarcodes).toBeCalled()
        expect(reception.checkBarcodes).not.toBeCalled()
        expect(reception.checkMaterialTypes).not.toBeCalled()
      })
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
      reception.handleTractionTubes = jest.fn()
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
      expect(reception.handleTractionTubes).toBeCalled()
      expect(reception.showAlert).not.toBeCalled()
    })

    it('is unsuccessful when getSampleExtractionTubesForBarcodes fails', async () => {
      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(new Response(Data.SampleExtractionTubesWithSample))
      reception.exportSampleExtractionTubesIntoTraction.mockResolvedValue(new Response(failedResponse))

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).toBeCalled()
      expect(reception.handleTractionTubes).not.toBeCalled()
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

  /* TODO: add
    checkMaterialTypes
    success:
    expect(reception.$route.path).toEqual('/pacbio/samples')
    failure:
    expect(reception.$route.path).toEqual('/pacbio/libraries')
    checkBarcodes 
  */
  describe.skip('#handleTractionTubes', () => {
    let failedResponse, emptyResponse, ssTubes
  
    beforeEach(() => {
      reception.getTractionTubesForBarcodes = jest.fn()
      reception.checkBarcodes = jest.fn()
      reception.checkMaterialTypes = jest.fn()
    })
  
    it('invalid barcodes', async () => {
      reception.tractionPacbioTubeRequest.get.mockResolvedValue(Data.TractionSaphyrTubesWithRequest)
      await reception.handleTractionTubes()
      expect(wrapper.find(Alert).vm.message).toMatch(consts.MESSAGE_ERROR_INVALID_BARCODES)
    })
  
    it('successfully for libraries', async () => {
      wrapper.setData({ barcodes: 'TRAC-3' })
      reception.tractionPacbioTubeRequest.get.mockResolvedValue(Data.TractionSaphyrTubesWithRequest)
      await reception.handleTractionTubes()
      expect(reception.$route.path).toEqual('/libraries')
    })
  
    it('unsuccessfully', async () => {
      reception.tractionPacbioTubeRequest.get.mockResolvedValue(failedResponse)
      await expect(reception.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
    })
  
    it('when no tubes exist', async () => {
      reception.tractionPacbioTubeRequest.get.mockResolvedValue(emptyResponse)
      await expect(reception.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
    })
  
    it('when there are no barcodes', async () => {
      wrapper.setData({ barcodes: '' })
      await expect(reception.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_WARNING_NO_BARCODES)
    })
  
  
    it('successfully', async () => {
      reception.tractionPacbioRequestsRequest.create.mockResolvedValue(Data.Requests)
      await reception.exportSampleTubesIntoTraction(ssTubes)
  
      expect(reception.tractionPacbioRequestsRequest.create).toBeCalled()
  
      let tractionPacbioRequestTubesBarcode = new Response(Data.Requests).deserialize.requests.map(s=> s.barcode).join('\n')
      expect(reception.barcodes).toEqual(tractionPacbioRequestTubesBarcode)
    })
  
    it('unsuccessfully', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }
  
      reception.tractionPacbioRequestsRequest.create.mockResolvedValue(failedResponse)
  
      await expect(reception.exportSampleTubesIntoTraction(ssTubes)).rejects.toThrow(
        'Failed to create tubes in Traction: name error message')
  
      expect(reception.tractionPacbioRequestsRequest.create).toBeCalled()
    })
  })

})
