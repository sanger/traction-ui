import { mount, localVue } from '../testHelper'
import LibraryBarcodeScanner from '@/components/LibraryBarcodeScanner'
import flushPromises from 'flush-promises'
import Response from '@/api/Response'
import TubeWithLibrary from '../../data/tubeWithLibrary'
import TractionTubesJson from '../../data/tractionTubesWithSample'


describe('LibraryBarcodeScanner.vue', () => {

  let wrapper, scanner

  beforeEach(() => {
    wrapper = mount(LibraryBarcodeScanner, {
      localVue,
      propsData: {
        flowcell: {id: 123, library: {id: 1, barcode: 'TRAC-1' }}
      }
    })
    scanner = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('LibraryBarcodeScanner')
  })

  it('will have an button component', () => {
    expect(wrapper.contains('#libraryBarcodeScanner')).toBe(true)
  })

  it('has a flowcell property', () => {
    expect(wrapper.props().flowcell).toEqual({id: 123, library: {id: 1, barcode: 'TRAC-1' }})
  })

  it('has a libraryBarcode', () => {
    wrapper.setData({ libraryBarcode: 'TRAC-123' })
    expect(wrapper.vm.libraryBarcode).toBe('TRAC-123')
  })

  describe('#updateLibraryBarcode', () => {
    it('only allows a single barcode', async () => {
      let invalidBarcodes = 'TRAC-234 \n TRAC-123'
      wrapper.setData({libraryBarcode: invalidBarcodes})

      scanner.getLibraryFromBarcode = jest.fn()

      await scanner.updateLibraryBarcode()

      expect(scanner.getLibraryFromBarcode).toBeCalledTimes(0)
      expect(scanner.message).toEqual('You can only have one library in a flowcell')
    })

    it('gets the library for the barcode', async () => {
      let validBarcode = 'TRAC-234'
      wrapper.setData({libraryBarcode: validBarcode})

      scanner.getLibraryFromBarcode = jest.fn()
      scanner.getLibraryFromBarcode.mockResolvedValue({id: 123})

      scanner.updateFlowcellInTraction = jest.fn()

      await scanner.updateLibraryBarcode()

      expect(scanner.getLibraryFromBarcode).toBeCalledTimes(1)
      expect(scanner.updateFlowcellInTraction).toBeCalledTimes(1)
    })

    it('when the library for the barcode doesnt exist', () => {
      let validBarcode = 'TRAC-234'
      wrapper.setData({libraryBarcode: validBarcode})

      scanner.getLibraryFromBarcode = jest.fn()
      scanner.getLibraryFromBarcode.mockResolvedValue({})

      scanner.updateFlowcellInTraction = jest.fn()

      scanner.updateLibraryBarcode()

      expect(scanner.getLibraryFromBarcode).toBeCalledTimes(1)
      expect(scanner.updateFlowcellInTraction).toBeCalledTimes(0)
    })
  })

  describe('#getLibraryFromBarcode', () => {
    it('success when library for barcode exists', async () => {
      let validBarcode = 'TRAC-234'
      wrapper.setData({libraryBarcode: validBarcode})

      scanner.tubeRequest.execute = jest.fn()
      scanner.tubeRequest.execute.mockResolvedValue(TubeWithLibrary)

      let library = await scanner.getLibraryFromBarcode()

      let expected = new Response(TubeWithLibrary).deserialize.tubes
      expect(library).toEqual(expected[0].material)
    })

    it('failure when library for barcode does not exist', async () => {
      let mockResponse = {
        data: { errors: { tube: ['error message 1'] }},
        status: 422,
        statusText: "Unprocessible entity"
      }

      scanner.tubeRequest.execute = jest.fn()
      scanner.tubeRequest.execute.mockResolvedValue(mockResponse)

      await scanner.getLibraryFromBarcode()
      expect(scanner.message).toEqual("This library does not exist")
    })

    it('failure when the barcode does not contain a library', async () => {
      let validBarcode = 'TRAC-234'
      wrapper.setData({libraryBarcode: validBarcode})

      scanner.tubeRequest.execute = jest.fn()
      scanner.tubeRequest.execute.mockResolvedValue(TractionTubesJson)

      await scanner.getLibraryFromBarcode()
      expect(scanner.message).toEqual("This barcode does not contain a library")
    })
  })

  describe('#updateFlowcellInTraction', () => {
    it('success', async () => {
      let flowcellId = 1
      let libraryId = 123

      let mockResponse =  {
        data: { id: flowcellId, type: "flowcell", attributes: { library_id: libraryId } },
        status: 200,
        statusText: "OK"
      }

      scanner.flowcellsRequest.execute = jest.fn()
      scanner.flowcellsRequest.execute.mockResolvedValue(mockResponse)

      await scanner.updateFlowcellInTraction(flowcellId, libraryId)
      expect(scanner.message).toEqual('Library added to flowcell')
    })

    it('failure', async () => {
      let mockResponse = {
        data: { errors: { library: ['error message 1'] }},
        status: 422,
        statusText: "Unprocessible entity"
      }

      scanner.flowcellsRequest.execute = jest.fn()
      scanner.flowcellsRequest.execute.mockReturnValue(mockResponse)

      let flowcellId = 1
      let libraryId = 123

      await scanner.updateFlowcellInTraction(flowcellId, libraryId)
      await flushPromises()
      expect(scanner.message).toEqual("library error message 1")
    })

  })

  describe('showAlert', () => {
    it('emits an event with the message', () => {
      wrapper.setData({ message: 'show this message' })
      scanner.showAlert
      expect(wrapper.emitted().alert).toBeTruthy()
    })

  })

})
