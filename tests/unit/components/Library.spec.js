import { mount, localVue, store } from '../testHelper'
import Library from '@/components/Library'
import LibraryTubeJson from '../../data/tubeWithLibrary'
import Response from '@/api/Response'
import * as Run from '@/api/Run'

describe('Library', () => {

  let wrapper, library, props, material, run

  beforeEach(() => {
    run = Run.build()
    store.commit('addRun', run)
    props = { id: 1, barcode: 'TRAC-1', runId: run.id, flowcellPosition: 1 }
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

  describe('existing record', () => {
    it('if the run is new', () => {
      expect(library.existingRecord).toBeFalsy()
    })

    it('if the run is persisted', () => {
      wrapper.setProps({runId: 1})
      expect(library.existingRecord).toBeTruthy()
    })
  })

  describe('#updateLibrary', () => {

    beforeEach(() => {
      run.id = 1
      store.commit('addRun', run)
      wrapper.setProps({runId: run.id})
      library.tractionTubeRequest.get = jest.fn()
      library.alert = jest.fn()
    })

    it('successfully', async () => {
      library.tractionTubeRequest.get.mockResolvedValue(LibraryTubeJson)
      let apiResponse = new Response(LibraryTubeJson)
      await library.updateLibrary()
      expect(library.tractionTubeRequest.get).toBeCalledWith({ filter: { barcode: 'TRAC-1' } })
      expect(wrapper.emitted().updateLibrary).toBeTruthy()
      material = apiResponse.deserialize.tubes[0].material
      expect(wrapper.emitted().updateLibrary[0]).toEqual([material])
      expect(library.libraryId).toEqual(material.id)
      expect(store.getters.run(run.id).chip.flowcells[0].library.id).toEqual(material.id)
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      library.tractionTubeRequest.get.mockReturnValue(failedResponse)
      await library.updateLibrary()

      expect(library.libraryId).not.toBeDefined()

    })

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
