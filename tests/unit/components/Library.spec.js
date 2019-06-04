import { mount, localVue, store } from '../testHelper'
import Library from '@/components/Library'
import LibraryTubeJson from '../../data/tubeWithLibrary'
import SampleTubeJson from '../../data/tractionTubesWithSample'
import Response from '@/api/Response'

describe('Library', () => {

  let wrapper, library, props, material

  beforeEach(() => {
    props = { id: 1, barcode: 'TRAC-1', runId: 'new', flowcellPosition: 1 }
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

    it('can have a run id', () => {
      expect(library.runId).toEqual(props.runId)
    })

    it('can have a flowcell position', () => {
      expect(library.flowcellPosition).toEqual(props.flowcellPosition)
    })
  })

  describe('#updateLibrary', () => {
    beforeEach(() => {
      library.tractionTubeRequest.get = jest.fn()
      library.alert = jest.fn()
    })

    it('successfully', async () => {
      library.tractionTubeRequest.get.mockResolvedValue(LibraryTubeJson)
      let apiResponse = new Response(LibraryTubeJson)
      await library.updateLibrary()
      expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
      // expect(wrapper.emitted().updateLibrary).toBeTruthy()
      material = apiResponse.deserialize.tubes[0].material
      // expect(wrapper.emitted().updateLibrary[0]).toEqual([material])
      expect(library.libraryId).toEqual(material.id)
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      library.tractionTubeRequest.get.mockReturnValue(failedResponse)
      await library.updateLibrary()

      expect(library.libraryId).not.toBeDefined()

      // expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
      // expect(library.alert).toBeCalledWith('There was an error')

    })

    // it('when there is no library', async () => {
    //   let emptyResponse = { 'data': { 'data': []}, 'status': 200, 'statusText': 'Success'}
    //   library.tractionTubeRequest.get.mockReturnValue(emptyResponse)
    //   await library.updateLibrary()

    //   expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
    //   expect(library.alert).toBeCalledWith('There was an error')
    // })

    // it('when it is not a library', async () => {
    //   library.tractionTubeRequest.get.mockResolvedValue(SampleTubeJson)
    //   await library.updateLibrary()

    //   expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
    //   expect(library.alert).toBeCalledWith('This is not a library')
    // })
  })

  describe('#tractionTubeRequest', () => {
    it('will have a request', () => {
      expect(library.tractionTubeRequest).toBeDefined()
    })
  })

  describe('alert', () => {
    it('emits an event with the message', () => {
      library.alert('emit this message')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0]).toEqual(['emit this message'])
    })
  })

})
