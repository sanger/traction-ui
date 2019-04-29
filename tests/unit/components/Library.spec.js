import { mount, localVue, store } from '../testHelper'
import Library from '@/components/Library'
import LibraryTubeJson from '../../data/tubeWithLibrary'
import SampleTubeJson from '../../data/tractionTubesWithSample'
import Response from '@/api/Response'

describe('Library', () => {

  let wrapper, library, props

  beforeEach(() => {
    props = { id: 1, barcode: 'TRAC-1'}
    wrapper = mount(Library, { localVue, store, propsData: props } )
    library = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Library')
  })

  describe('props', () => {
    it('can have an id', () => {
      expect(library.id).toEqual(props.id)
    })

    it('can have a barcode and sets the libraryBarcode data', () => {
      expect(library.libraryBarcode).toEqual(props.barcode)
    })
  })

  describe('#handleLibraryUpdate', () => {
    beforeEach(() => {
      library.updateLibrary = jest.fn()
      library.emitAlert = jest.fn()
    })

    it('calls updateLibrary', async () => {
      await library.handleLibraryUpdate()
      expect(library.updateLibrary).toBeCalled()
      expect(library.emitAlert).not.toBeCalled()
    })

    it('calls showAlert when there is an error', async () => {
      library.updateLibrary.mockImplementation(() => {
        throw 'Raise this error'
      })

      await library.handleLibraryUpdate()
      expect(library.updateLibrary).toBeCalled()
      expect(library.message).toEqual('Raise this error')
      expect(library.emitAlert).toBeCalled()
    })
  })

  describe('#updateLibrary', () => {
    beforeEach(() => {
      library.tractionTubeRequest.get = jest.fn()
    })

    it('successfully', async () => {
      library.tractionTubeRequest.get.mockResolvedValue(LibraryTubeJson)
      let apiResponse = new Response(LibraryTubeJson)
      await library.updateLibrary()
      expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
      expect(wrapper.emitted().updateLibrary).toBeTruthy()
      expect(wrapper.emitted().updateLibrary[0]).toEqual([apiResponse.deserialize.tubes[0].material])
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      library.tractionTubeRequest.get.mockReturnValue(failedResponse)

      let message
      try {
        await library.updateLibrary()
      } catch (err) {
        message = err
      }

      expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
      expect(message).toEqual('There was an error')
    })

    it('when there is no library', async () => {
      let emptyResponse = { 'data': { 'data': []}, 'status': 200, 'statusText': 'Success'}
      library.tractionTubeRequest.get.mockReturnValue(emptyResponse)

      let message
      try {
        await library.updateLibrary()
      } catch (err) {
        message = err
      }

      expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
      expect(message).toEqual('There was an error')
    })

    it('when it is not a library', async () => {
      library.tractionTubeRequest.get.mockResolvedValue(SampleTubeJson)

      let message
      try {
        await library.updateLibrary()
      } catch (err) {
        message = err
      }

      expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
      expect(message).toEqual('This is not a library')
    })
  })

  describe('#tractionTubeRequest', () => {
    it('will have a request', () => {
      expect(library.tractionTubeRequest).toBeDefined()
    })
  })

  describe('emitAlert', () => {
    it('emits an event with the message', () => {
      library.message = 'emit this message'
      library.emitAlert()
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0]).toEqual(['emit this message'])
    })
  })

})
