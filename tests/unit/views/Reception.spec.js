import Reception from '@/views/Reception'
import { mount, localVue, store } from '../testHelper'
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

  describe('#handleSequencescapeTubes', () => {
    beforeEach(() => {
      reception.getSequencescapeTubes = jest.fn()
      reception.exportSampleTubesIntoTraction = jest.fn()
      reception.handleTractionTubes = jest.fn()
      reception.showAlert = jest.fn()
    })

    it('calls the correct functions', async () => {
      await reception.handleSequencescapeTubes()
      expect(reception.getSequencescapeTubes).toBeCalled()
      expect(reception.exportSampleTubesIntoTraction).toBeCalled()
      expect(reception.handleTractionTubes).toBeCalled()
      expect(reception.showAlert).not.toBeCalled()
    })

    it('calls showAlert when there is an error', async () => {
      reception.handleTractionTubes.mockImplementation(() => {
        throw 'Raise this error'
      })

      await reception.handleSequencescapeTubes()
      expect(reception.getSequencescapeTubes).toBeCalled()
      expect(reception.exportSampleTubesIntoTraction).toBeCalled()
      expect(reception.handleTractionTubes).toBeCalled()
      expect(reception.showAlert).toBeCalled()
    })
  })

  describe('#getSequencescapeTubes', () => {

    let sequencescapeBarcodes

    beforeEach(() => {
      sequencescapeBarcodes = 'DN1\nDN2\nDN3\nDN4\nDN5'
      reception.sequencescapeTubeRequest.get = jest.fn()
    })

    it('successfully', async () => {
      reception.sequencescapeTubeRequest.get.mockResolvedValue(SequencescapeTubesJson)
      wrapper.setData({ barcodes: sequencescapeBarcodes })

      let tubes = await reception.getSequencescapeTubes()
      let expectedTubes = new Response(SequencescapeTubesJson).deserialize.tubes

      expect(expectedTubes).toEqual(tubes)
    })

    it('unsuccessfully', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }
      reception.sequencescapeTubeRequest.get.mockResolvedValue(failedResponse)
      wrapper.setData({ barcodes: sequencescapeBarcodes })

      await expect(reception.getSequencescapeTubes()).rejects.toThrow(
        'Failed to find tubes in Sequencescape')
    })
  })

  describe('#exportSampleTubesIntoTraction', () => {
    let ssTubes

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

    beforeEach(() => {
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })
      reception.tractionSaphyrTubeRequest.get = jest.fn()

      emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success'}
      failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
    })

    it('successfully for samples', async () => {
      wrapper.setData({ barcodes: 'TRAC-1' })
      reception.tractionSaphyrTubeRequest.get.mockResolvedValue(TractionSaphyrTubesWithRequestJson)
      await reception.handleTractionTubes()
      expect(reception.$route.path).toEqual('/samples')
    })

    it('invalid barcodes', async () => {
      reception.tractionSaphyrTubeRequest.get.mockResolvedValue(TractionSaphyrTubesWithRequestJson)
      await reception.handleTractionTubes()
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

  describe('#sequencescapeTubeRequest', () => {
    it('will have a request', () => {
      expect(reception.sequencescapeTubeRequest).toBeDefined()
    })
  })

  describe('#tractionSaphyrTubeRequest', () => {
    it('will have a request', () => {
      expect(reception.tractionSaphyrTubeRequest).toBeDefined()
    })
  })

  describe('#tractionSaphyrRequestsRequest', () => {
    it('will have a saphyr request request', () => {
      expect(reception.tractionSaphyrRequestsRequest).toBeDefined()
    })
  })
})
