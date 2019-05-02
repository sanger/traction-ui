import Reception from '@/views/Reception'
import { mount, localVue, store } from '../testHelper'
import TractionTubesWithSamplesJson from '../../data/tractionTubesWithSample'
import TractionTubesWithLibrariesJson from '../../data/tubeWithLibrary'
import SequencescapeTubesJson from '../../data/sequencescapeTubesWithSample'
import SamplesJson from '../../data/samples'
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
      const input = wrapper.find('textarea')
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

    let sequencescapeBarcodes

    beforeEach(() => {
      sequencescapeBarcodes = 'DN1\nDN2\nDN3\nDN4\nDN5'
      reception.sequencescapeTubeRequest.get = jest.fn()
      reception.exportSampleTubesIntoTraction = jest.fn()
      reception.handleTractionTubes = jest.fn()
    })

    it('successfully', async () => {
      reception.sequencescapeTubeRequest.get.mockResolvedValue(SequencescapeTubesJson)
      wrapper.setData({ barcodes: sequencescapeBarcodes })
      await reception.handleSequencescapeTubes()

      let tubes = new Response(SequencescapeTubesJson).deserialize.tubes
      expect(reception.exportSampleTubesIntoTraction).toBeCalledWith(tubes)
      expect(reception.handleTractionTubes).toBeCalled()
    })


    it('unsuccessfully', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }
      reception.sequencescapeTubeRequest.get.mockResolvedValue(failedResponse)
      wrapper.setData({ barcodes: sequencescapeBarcodes })
      await reception.handleSequencescapeTubes()

      expect(reception.message).toEqual('There was an error')
      expect(reception.exportSampleTubesIntoTraction).not.toBeCalled()
      expect(reception.handleTractionTubes).not.toBeCalled()
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

  describe('#handleTractionTubes', () => {
    let emptyResponse, failedResponse

    beforeEach(() => {
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })
      reception.tractionTubeRequest.get = jest.fn()

      emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success'}
      failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
    })

    it('successfully for samples', async () => {
      reception.tractionTubeRequest.get.mockResolvedValue(TractionTubesWithSamplesJson)
      await reception.handleTractionTubes()
      expect(reception.$route.path).toEqual('/samples')
    })

    it('successfully for libraries', async () => {
      reception.tractionTubeRequest.get.mockResolvedValue(TractionTubesWithLibrariesJson)
      await reception.handleTractionTubes()
      expect(reception.$route.path).toEqual('/libraries')
    })

    it('unsuccessfully', async () => {
      reception.tractionTubeRequest.get.mockResolvedValue(failedResponse)
      await reception.handleTractionTubes()
      expect(reception.message).toEqual('There was an error')
    })

    it('when no tubes exist', async () => {
      reception.tractionTubeRequest.get.mockResolvedValue(emptyResponse)
      await reception.handleTractionTubes()
      expect(reception.message).toEqual('There was an error')
    })

    it('when there is no barcodes', async () => {
      wrapper.setData({ barcodes: '' })
      await reception.handleTractionTubes()
      expect(reception.message).toEqual("There are no barcodes")
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
