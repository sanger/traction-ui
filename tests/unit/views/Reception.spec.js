import Reception from '@/views/Reception'
import { mount, localVue, Vuex } from '../testHelper'
import TractionSaphyrTubesWithRequestJson from '../../data/tractionSaphyrTubesWithRequest'
import TractionTubesWithLibrariesJson from '../../data/tubeWithLibrary'
import SequencescapeTubesJson from '../../data/sequencescapeTubesWithSample'
import RequestsJson from '../../data/requests'
import Response from '@/api/Response'
import Samples from '@/views/Samples'
import Libraries from '@/views/Libraries'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'

describe('Reception', () => {

  let wrapper, reception, barcodes, barcode, input, router

  beforeEach(() => {
    router = new VueRouter({ routes:
      [
        { path: '/samples', name: 'Samples', component: Samples },
        { path: '/libraries', name: 'Libraries', component: Libraries }
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

    // let store = new Vuex.Store({
    //   modules: {
    //     sequencescape: {
    //       namespaced: true,
    //       state: {
    //         sequencescapeTubes: mockSSTubes
    //       }
    //     }
    //   }
    // })

    beforeEach(() => {
      reception.getTractionTubesForBarcodes = jest.fn()
      reception.handleTubeRedirect = jest.fn()
      reception.showAlert = jest.fn()
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })
    })

    describe('successful', () => {
      it('calls the correct functions when the tubes are requests', async () => {
        let expectedResponse = new Response(TractionSaphyrTubesWithRequestJson)
        reception.getTractionTubesForBarcodes.mockReturnValue(expectedResponse)

        await reception.handleTractionTubes()
        expect(reception.getTractionTubesForBarcodes).toBeCalled()
        expect(reception.handleTubeRedirect).toBeCalled()
        expect(reception.showAlert).not.toBeCalled()
      })

      await reception.handleSequencescapeTubes()
      expect(reception.getSequencescapeTubes).toBeCalled()
      expect(reception.exportSampleTubesIntoTraction).toBeCalled()
      expect(reception.handleTractionTubes).toBeCalled()
      expect(reception.showAlert).toBeCalled()
    })
  })

  describe('#getSequencescapeTubes', () => {

        await reception.handleTractionTubes()
        expect(reception.getTractionTubesForBarcodes).toBeCalled()
        expect(reception.handleTubeRedirect).toBeCalled()
        expect(reception.showAlert).not.toBeCalled()
      })
    })

    it('unsuccessfully', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }
      reception.sequencescapeTubeRequest.get.mockResolvedValue(failedResponse)
      wrapper.setData({ barcodes: sequencescapeBarcodes })

      await expect(reception.getSequencescapeTubes()).rejects.toThrow(
        'Failed to find tubes in Sequencescape')
    })
  })

  describe('#handleSequencescapeTubes', () => {
    let failedResponse

    beforeEach(() => {
      reception.tractionSaphyrRequestsRequest.create = jest.fn()
      ssTubes = new Response(SequencescapeTubesJson).deserialize.tubes
    })

    it('successfully', async () => {
      reception.tractionSaphyrRequestsRequest.create.mockResolvedValue(RequestsJson)
      await reception.exportSampleTubesIntoTraction(ssTubes)

      expect(reception.tractionSaphyrRequestsRequest.create).toBeCalled()

      let tractionSaphyrRequestTubesBarcode = new Response(RequestsJson).deserialize.requests.map(s=> s.barcode).join('\n')
      expect(reception.barcodes).toEqual(tractionSaphyrRequestTubesBarcode)
    })

    it('unsuccessfully', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }

      reception.tractionSaphyrRequestsRequest.create.mockResolvedValue(failedResponse)

      await expect(reception.exportSampleTubesIntoTraction(ssTubes)).rejects.toThrow(
        'Failed to create tubes in Traction: name error message')

      expect(reception.tractionSaphyrRequestsRequest.create).toBeCalled()
    })
  })

  describe('#handleTractionTubes', () => {
    let emptyResponse, failedResponse

      reception.getSequencescapeTubesForBarcodes = jest.fn()
      reception.exportSampleTubesIntoTraction = jest.fn()
      reception.handleTubeRedirect = jest.fn()
      reception.showAlert = jest.fn()
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })

      failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['Tube could not be found.'] }} }
    })

    it('successfully for samples', async () => {
      wrapper.setData({ barcodes: 'TRAC-1' })
      reception.tractionSaphyrTubeRequest.get.mockResolvedValue(TractionSaphyrTubesWithRequestJson)
      await reception.handleTractionTubes()
      expect(reception.$route.path).toEqual('/samples')
    })

    it('invalid barcodes', async () => {
      reception.tractionSaphyrTubeRequest.get.mockResolvedValue(TractionSaphyrTubesWithRequestJson)
      await reception.findTractionTubes()
      expect(wrapper.find(Alert).vm.message).toMatch(consts.MESSAGE_ERROR_INVALID_BARCODES)
    })

    it('successfully for libraries', async () => {
      wrapper.setData({ barcodes: 'TRAC-3' })
      reception.tractionSaphyrTubeRequest.get.mockResolvedValue(TractionTubesWithLibrariesJson)
      await reception.handleTractionTubes()
      expect(reception.$route.path).toEqual('/libraries')
    })

    it('unsuccessfully', async () => {
      reception.tractionSaphyrTubeRequest.get.mockResolvedValue(failedResponse)
      await expect(reception.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
    })

    it('when no tubes exist', async () => {
      reception.tractionSaphyrTubeRequest.get.mockResolvedValue(emptyResponse)
      await expect(reception.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
    })

    it('when there are no barcodes', async () => {
      wrapper.setData({ barcodes: '' })
      await expect(reception.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_WARNING_NO_BARCODES)
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

})
