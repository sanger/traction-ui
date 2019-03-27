import { mount, localVue, store } from '../testHelper'
import Library from '@/components/Library'
import LibraryTubeJson from '../../data/tubeWithLibrary'
import SampleTubeJson from '../../data/tractionTubesWithSample'
import Response from '@/api/Response'

describe('Library', () => {

  let wrapper, library, props, input, response

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

  describe('#updateLibrary', () => {
    beforeEach(() => {
      library.tubeRequest.get = jest.fn()
    })

    it('successfully', async () => {
      library.tubeRequest.get.mockResolvedValue(LibraryTubeJson)
      let apiResponse = new Response(LibraryTubeJson)
      response = await library.updateLibrary()
      expect(library.tubeRequest.get).toBeCalledWith({ filter: { barcode: library.queryString } })
      expect(response).toEqual(new Response(LibraryTubeJson))
      expect(library.message).toEqual('Library updated')
      expect(wrapper.emitted().updateLibrary).toBeTruthy()
      expect(wrapper.emitted().updateLibrary[0]).toEqual([apiResponse.deserialize.tubes[0].material])
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      library.tubeRequest.get.mockReturnValue(failedResponse)
      response = await library.updateLibrary()
      expect(library.tubeRequest.get).toBeCalledWith({ filter: { barcode: library.queryString } })
      expect(response).toEqual(new Response(failedResponse))
      expect(library.message).toEqual('there was an error')
    })

    it('when there is no library', async () => {
      let emptyResponse = { 'data': { 'data': []}, 'status': 200, 'statusText': 'Success'}
      library.tubeRequest.get.mockReturnValue(emptyResponse)
      response = await library.updateLibrary()
      expect(library.tubeRequest.get).toBeCalledWith({ filter: { barcode: library.queryString } })
      expect(response).toEqual(new Response(emptyResponse))
      expect(library.message).toEqual('There is no library')
    })

    it('when it is not a library', async () => {
      library.tubeRequest.get.mockResolvedValue(SampleTubeJson)
      response = await library.updateLibrary()
      expect(library.tubeRequest.get).toBeCalledWith({ filter: { barcode: library.queryString } })
      expect(response).toEqual(new Response(SampleTubeJson))
      expect(library.message).toEqual('This is not a library')
    })
  })

  describe('#tubeRequest', () => {
    it('will have a request', () => {
      expect(library.tubeRequest).toBeDefined()
    })
  })

  describe('#queryString', () => {
    it('will populate the barcode from the tube', () => {
      expect(library.libraryBarcode).toEqual(props.barcode)
    })

    it('will allow the user to scan in a barcopde', () => {
      input = wrapper.find('#barcode')
      input.setValue('TRAC-2')
      expect(library.libraryBarcode).toEqual('TRAC-2')
    })

    it('will create a query string', () => {
      input = wrapper.find('#barcode')
      input.setValue('TRAC-2\n')
      expect(library.queryString).toEqual('TRAC-2')
    })
  })

})
