import Reception from '@/views/saphyr/SaphyrReception'
import { mount, localVue, store, Data } from '@support/testHelper'
import { newResponse } from '@/api/ResponseHelper'

describe('Reception', () => {
  let wrapper, reception, barcodes, barcode, input, router

  beforeEach(() => {
    barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
    wrapper = mount(Reception, { localVue, router, store })
    reception = wrapper.vm
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
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })
      reception.handleSampleExtractionTubes = vi.fn()
    })

    it('calls the right function', () => {
      const input = wrapper.find('textarea')
      input.setValue(barcodes)
      const button = wrapper.find('#findSampleExtractionTubes')
      button.trigger('click')
      expect(reception.handleSampleExtractionTubes).toBeCalled()
    })
  })

  describe('#handleSampleExtractionTubes', () => {
    let failedResponse

    beforeEach(() => {
      store.commit('sampleExtraction/setSampleExtractionTubes', [])

      wrapper = mount(Reception, { localVue, store })
      reception = wrapper.vm

      reception.getSampleExtractionTubesForBarcodes = vi.fn()
      reception.exportSampleExtractionTubesIntoTraction = vi.fn()
      reception.showAlert = vi.fn()
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })

      failedResponse = {
        success: false,
        errors: 'Sample Extraction tubes failed to be imported',
      }
    })

    it('successfully for samples', async () => {
      const mockSamplesExtractionResponse = newResponse({
        success: true,
        ...Data.SampleExtractionTubesWithSample,
      })

      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(mockSamplesExtractionResponse)

      const mockTractionResponse = newResponse({
        success: true,
        ...Data.Requests,
      })

      reception.exportSampleExtractionTubesIntoTraction.mockResolvedValue(mockTractionResponse)

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).toBeCalled()
      expect(reception.showAlert).toBeCalled()
    })

    it('is unsuccessful when getSampleExtractionTubesForBarcodes fails', async () => {
      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(failedResponse)

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).not.toBeCalled()
      expect(reception.showAlert).toBeCalledWith(
        'Sample Extraction tubes failed to be imported',
        'danger',
      )
    })

    it('is unsuccessful when getSampleExtractionTubesForBarcodes is empty', async () => {
      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(failedResponse)

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).not.toBeCalled()
      expect(reception.showAlert).toBeCalledWith(
        'Sample Extraction tubes failed to be imported',
        'danger',
      )
    })

    it('is unsuccessful when exportSampleExtractionTubesIntoTraction fails', async () => {
      const mockSamplesExtractionResponse = newResponse({
        success: true,
        ...Data.SampleExtractionTubesWithSample,
      })

      reception.getSampleExtractionTubesForBarcodes.mockResolvedValue(mockSamplesExtractionResponse)

      const failedResponse = {
        success: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { errors: { name: ['error message'] } },
      }

      const mockTractionResponse = newResponse({
        success: false,
        ...failedResponse,
      })

      reception.exportSampleExtractionTubesIntoTraction.mockResolvedValue(mockTractionResponse)

      await reception.handleSampleExtractionTubes()
      expect(reception.getSampleExtractionTubesForBarcodes).toBeCalled()
      expect(reception.exportSampleExtractionTubesIntoTraction).toBeCalled()
      expect(reception.showAlert).toBeCalled()
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      reception.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('#getBarcodes', () => {
    it('single barcode', () => {
      wrapper.setData({ barcodes: 'TRAC-1\n' })
      const result = reception.getBarcodes()
      expect(result).toEqual(['TRAC-1'])
    })

    it('multiple barcodes', () => {
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5' })
      const result = reception.getBarcodes()
      expect(result).toEqual(['TRAC-1', 'TRAC-2', 'TRAC-3', 'TRAC-4', 'TRAC-5'])
    })
  })
})
