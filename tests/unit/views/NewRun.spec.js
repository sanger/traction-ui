import NewRun from '@/views/NewRun'
import Flowcell from '@/components/Flowcell'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'
import Runs from '@/views/Runs'
import Vuetify from 'vuetify'
import Response from '@/api/Response'
import RunJson from '../../data/run'
import RunNoLibraryJson from '../../data/run_no_library'
import RunWithLibraryJson from '../../data/run_with_library'
import LibrariesJson from '../../data/libraries'
import flushPromises from 'flush-promises'
import Alert from '@/components/Alert'

describe('NewRun.vue', () => {

  let wrapper, data, newRun

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [{ path: '/runs', name: 'Runs', component: Runs }]
    })
    localVue.use(Vuetify)

    wrapper = mount(NewRun, {
      localVue,
      router,
      propsData: {
        runId: 123
      }
    })
    newRun = wrapper.vm
  })

  it('creates suitable props', () => {
    expect(newRun.runId).toEqual(123)
  })

  it('contains a back to runs button', () => {
    expect(wrapper.contains('#backToRunsButton')).toBe(true)
  })

  it('contains a start run button', () => {
    expect(wrapper.contains('#startRun')).toBe(true)
  })

  it('has a alert', () => {
    expect(wrapper.contains(Alert)).toBe(true)
  })

  it('can have run data', () => {
    wrapper.setData({ id: 1, state: 'pending', chipBarcode: 'TRAC123', chipId: '123', flowcell1: [], flowcell2: [], libraries: [] })
    expect(newRun.id).toEqual(1)
    expect(newRun.state).toEqual('pending')
    expect(newRun.chipBarcode).toEqual('TRAC123')
    expect(newRun.chipId).toEqual('123')
    expect(newRun.flowcell1).toEqual([])
    expect(newRun.flowcell2).toEqual([])
    expect(newRun.libraries).toEqual([])
  })

  describe('#getRun', () => {
      it('when flowcell libraries exist, flowcells have their respective library', async () => {
        newRun.runRequest.execute = jest.fn()
        newRun.runRequest.execute.mockResolvedValue(RunWithLibraryJson)

        let id = 1
        await newRun.getRun(id)

        let expectedRun = new Response(RunWithLibraryJson).deserialize.runs[0]

        expect(newRun.id).toEqual(expectedRun.id)
        expect(newRun.state).toEqual(expectedRun.state)
        expect(newRun.chipBarcode).toEqual(expectedRun.chip.barcode)
        expect(newRun.chipId).toEqual(expectedRun.chip.id)
        expect(newRun.flowcell1).toEqual([expectedRun.chip.flowcells[0]])
        expect(newRun.flowcell2).toEqual([expectedRun.chip.flowcells[1]])
      })

      it('when flowcell libraries do not exist, flowcell1 is an empty list', async () => {
        newRun.runRequest.execute = jest.fn()
        newRun.runRequest.execute.mockResolvedValue(RunNoLibraryJson)

        let id = 1
        await newRun.getRun(id)

        let expectedRun = new Response(RunNoLibraryJson).deserialize.runs[0]

        expect(newRun.id).toEqual(expectedRun.id)
        expect(newRun.state).toEqual(expectedRun.state)
        expect(newRun.chipBarcode).toEqual('')
        expect(newRun.chipId).toEqual(expectedRun.chip.id)
        expect(newRun.flowcell1).toEqual([{"id": "27", "position": 1, "type": "flowcells"}])
        expect(newRun.flowcell2).toEqual([{"id": "28", "position": 2, "type": "flowcells"}])
      })
  })

  it('#getLibraries will get a list of libraries', async () => {
    newRun.librariesRequest.execute = jest.fn()
    newRun.librariesRequest.execute.mockResolvedValue(LibrariesJson)

    await newRun.getLibraries()

    let libraries = new Response(LibrariesJson).deserialize.libraries
    expect(newRun.libraries).toEqual(libraries)
  })

  describe('#updateBarcode', () => {
    it('success', async () => {

      let mockResponse =  {
        data: { id: 1, type: "chips", attributes: { barcode: "TRAC123" } },
        status: 200,
        statusText: "OK"
      }

      newRun.chipsRequest.execute = jest.fn()
      newRun.chipsRequest.execute.mockResolvedValue(mockResponse)

      newRun.chipId = 1
      newRun.chipBarcode = "barcode12345"

      await newRun.updateBarcode()
      expect(newRun.message).toEqual('Chip barcode updated')
    })

    it('failure', async () => {
      let mockResponse = {
        data: { errors: { barcode: ['error message 1'] }},
        status: 422,
        statusText: "Unprocessible entity"
      }

      newRun.chipsRequest.execute = jest.fn()
      newRun.chipsRequest.execute.mockReturnValue(mockResponse)

      newRun.chipId = 1
      newRun.chipBarcode = "barcode12345"

      let fn = newRun.updateBarcode()
      await expect(fn).rejects.toEqual("barcode error message 1")
      await flushPromises()
      expect(newRun.message).toEqual("barcode error message 1")
    })

  })

  describe('#startRun', () => {
    it('success', async () => {

      let mockResponse =  {
        data: { id: 1, type: "runs", attributes: { state: "started" } },
        status: 200,
        statusText: "OK"
      }

      newRun.runRequest.execute = jest.fn()
      newRun.runRequest.execute.mockResolvedValue(mockResponse)

      await newRun.startRun()
      expect(newRun.message).toEqual('Sequencing Run started')
    })

    it('failure', async () => {
      let mockResponse = {
        data: { errors: { state: ['error message 1'] }},
        status: 422,
        statusText: "Unprocessible entity"
      }

      newRun.runRequest.execute = jest.fn()
      newRun.runRequest.execute.mockReturnValue(mockResponse)

      let fn = newRun.startRun()
      await expect(fn).rejects.toEqual("state error message 1")
      // await flushPromises()
      expect(newRun.message).toEqual("state error message 1")
    })

  })

  describe('#updateFlowcell', () => {
    it('replaces the library value of the flowcell with the new library', () => {
      let library = {type: 'libraries', id: "123"}

      wrapper.setData({ flowcell1: [
        {type: 'flowcells', id: '12345', library: {barcode: 'TRAC123'}},
        library
      ]})

      newRun.updateFlowcell('flowcell1', library)
      expect(newRun.flowcell1).toEqual([{type: 'flowcells', id: "12345", library: library}])
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

      newRun.flowcellsRequest.execute = jest.fn()
      newRun.flowcellsRequest.execute.mockResolvedValue(mockResponse)

      await newRun.updateFlowcellInTraction(flowcellId, libraryId)
      expect(newRun.message).toEqual('Library added to flowcell')
    })

    it('failure', async () => {
      let mockResponse = {
        data: { errors: { library: ['error message 1'] }},
        status: 422,
        statusText: "Unprocessible entity"
      }

      newRun.flowcellsRequest.execute = jest.fn()
      newRun.flowcellsRequest.execute.mockReturnValue(mockResponse)

      let flowcellId = 1
      let libraryId = 123

      let fn = newRun.updateFlowcellInTraction(flowcellId, libraryId)
      await expect(fn).rejects.toEqual("library error message 1")
      // await flushPromises()
      expect(newRun.message).toEqual("library error message 1")
    })

  })
})
