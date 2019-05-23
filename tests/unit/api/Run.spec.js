import Vue from 'vue'
import { mount } from '../testHelper'
import Request from '@/api/Request'
import createRunJson from '../../data/createRun'
import createChipJson from '../../data/createChip'
import createFlowcellJson from '../../data/createFlowcell'
import successfulDestroyJson from '../../data/successfulDestroy'
import LibraryTubeJson from '../../data/tubeWithLibrary'
import SampleTubeJson from '../../data/tractionTubesWithSample'
import Response from '@/api/Response'
import * as Run from '@/api/Run'
import build from '@/api/ApiBuilder'
import Api from '@/api'

describe('Run', () => {

  let cmp, props, wrapper, request, mockResponse, response, failedResponse, chipBarcode, barcode1

  beforeEach(() => {
    cmp = Vue.extend({
      mixins: [Request],
      render () { return ''}
    })

    props = { baseURL: 'http://sequencescape.com',
              apiNamespace: 'api/v2',
              resource: 'requests' }
    wrapper = mount(cmp, { propsData: props })

    request = wrapper.vm.api
    request.get = jest.fn()

    failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['The record identified by 100 could not be found.'] }} }

    chipBarcode = 'XYZ1234567891012'
    barcode1 = 'DN123'
  })

  let run

  describe('build', () => {

    beforeEach(() => {
      run = Run.build()
    })

    it('will have an empty chip', () => {
      expect(run.chip).toBeDefined()
    })

    it('will have two flowcells', () => {
      expect(run.chip.flowcells.length).toEqual(2)
    })

    it('each flowcell will have a library', () => {
      expect(run.chip.flowcells[0].library).toBeDefined()
    })

    it('each flowcell will have a position', () => {
      let flowcells = run.chip.flowcells
      expect(flowcells[0].position).toEqual(1)
      expect(flowcells[1].position).toEqual(2)
    })

  })

  describe('getLibrary', () => {
    it('when it returns a library', async () => {
      mockResponse = new Response(LibraryTubeJson).deserialize.tubes[0].material
      request.get.mockResolvedValue(LibraryTubeJson)
      response = await Run.getLibrary(barcode1, request)
      expect(response).toEqual(mockResponse)
    })

    it('when it returns a sample', async () => {
      request.get.mockResolvedValue(SampleTubeJson)
      response = await Run.getLibrary(barcode1, request)
      expect(response).not.toBeDefined()
    })

    it('when it returns nothing', async() => {
      request.get.mockResolvedValue(failedResponse)
      response = await Run.getLibrary(barcode1, request)
      expect(response).not.toBeDefined()
    })
  })

  describe('validate', () => {
    let result

    beforeEach(() => {
      run = Run.build()
    })

    describe('chip', () => {

      it('will raise an error if the barcode is not present', async () => {
        result = await Run.validate(run)
        expect(result.chip).toEqual("barcode not present")
      })

      it('will raise an error if the barcode is not in the correct format', async () => {
        run.chip['barcode'] = 'XYZ1234'
        result = await Run.validate(run)
        expect(result.chip).toEqual("barcode not in correct format")
      })
    })

    describe('flowcell', () => {

      beforeEach(() => {
        run.chip['barcode'] = chipBarcode
        run.chip.flowcells[0].library.barcode = barcode1
      })

      it('will raise an error if the library is not present', async () => {
        mockResponse = new Response(LibraryTubeJson).deserialize.tubes[0].material
        request.get.mockResolvedValue(LibraryTubeJson)
        result = await Run.validate(run, request)
        expect(result.flowcells['2']).toEqual('library not present')
      })

      it('will raise an error if the library does not exist', async () => {
        request.get.mockResolvedValue(failedResponse)
        result = await Run.validate(run, request)
        expect(result.flowcells['1']).toEqual('library does not exist')

        request.get.mockResolvedValue(SampleTubeJson)
        result = await Run.validate(run, request)
        expect(result.flowcells['1']).toEqual('library does not exist')
      })
    })
  })

  describe('creating a run', () => {

    beforeEach(() => {
      run = Run.build()
      run['name'] = 'run1'
      run.chip['barcode'] = chipBarcode
      run.chip.flowcells[0] = { position: 1, library: { id: 1 } }
      run.chip.flowcells[1] = { position: 2, library: { id: 2 } }
      request.create = jest.fn()
    })

    describe('createRun', () => {

      it('success', async () => {
        request.create.mockResolvedValue(createRunJson)

        let mockResponse = new Response(createRunJson)
        let response = await Run.createResource({ data: { type: "runs", attributes: { name: run.name } } }, request)

        expect(response).toEqual(mockResponse)
      })

      it('failure', async () => {
        request.create.mockReturnValue(failedResponse)

        let message
        try {
          await Run.createResource({ data: { type: "runs", attributes: { name: run.name } } }, request)
        } catch (err) {
          message = err.message
        }
        expect(message).toEqual("title The record identified by 100 could not be found.")
      })
    })

    describe('createChip', () => {
      let chip, runId

      beforeEach(() => {
        chip = run.chip
        runId = 1
      })

      it('will create a chip and return a response', async () => {
        request.create.mockResolvedValue(createChipJson)

        let mockResponse = new Response(createChipJson)
        let response = await Run.createResource({ data: { type: "chips", attributes: { barcode: run.chip.barcode, run_id: runId } } }, request)
        expect(response).toEqual(mockResponse)
      })

      it('failure', async () => {
        request.create.mockReturnValue(failedResponse)

        let message
        try {
          await Run.createResource({ data: { type: "chips", attributes: { barcode: run.chip.barcode, run_id: runId } } }, request)
        } catch (err) {
          message = err.message
        }
        expect(message).toEqual("title The record identified by 100 could not be found.")
      })
    })

    describe('createFlowcell', () => {
      let flowcell, chipId

      beforeEach(() => {
        flowcell = run.chip.flowcells[0]
        chipId = 1
      })

      it('will create a flowcell and return a response', async () => {
        request.create.mockResolvedValue(createFlowcellJson)

        let mockResponse = new Response(createFlowcellJson)
        let response = await Run.createResource({ data: { type: "flowcells", attributes: { position: flowcell.position, library_id: flowcell.library.id, chip_id: chipId } } }, request)
        expect(response).toEqual(mockResponse)
      })

      it('failure', async () => {
        request.create.mockReturnValue(failedResponse)

        let message
        try {
          await Run.createResource({ data: { type: "flowcells", attributes: { position: flowcell.position, library_id: flowcell.library.id, chip_id: chipId } } }, request)
        } catch (err) {
          message = err.message
        }
        expect(message).toEqual("title The record identified by 100 could not be found.")
      })

    })

    describe('create', () => {
      let api

      beforeEach(() => {
        api = build(Api.Config, process.env)
        api.traction.runs.create = jest.fn()
        api.traction.chips.create = jest.fn()
        api.traction.flowcells.create = jest.fn()
        api.traction.runs.destroy = jest.fn()
        api.traction.chips.destroy = jest.fn()
      })

      it('returns true', async () => {
        api.traction.runs.create.mockResolvedValue(createRunJson)
        api.traction.chips.create.mockResolvedValue(createChipJson)
        api.traction.flowcells.create.mockResolvedValue(createFlowcellJson)
        expect(await Run.create(run, api.traction)).toBeTruthy()
      })

      it('returns false if the run cannot be created', async () => {
        api.traction.runs.create.mockReturnValue(failedResponse)
        expect(api.traction.chips.create).not.toBeCalled()
        expect(api.traction.flowcells.create).not.toBeCalled()
        expect(await Run.create(run, api.traction)).toBeFalsy()
      })

      it('returns false and rollsback if the chip cannot be created', async () => {
        api.traction.runs.create.mockReturnValue(createRunJson)
        api.traction.chips.create.mockResolvedValue(failedResponse)

        api.traction.runs.destroy.mockResolvedValue(successfulDestroyJson)

        let runResponse = new Response(createRunJson)
        let runId = runResponse.deserialize.runs[0].id

        let resp = await Run.create(run, api.traction)

        expect(api.traction.runs.destroy).toBeCalledWith(runId)
        expect(api.traction.flowcells.create).not.toBeCalled()
        
        expect(resp).toBeFalsy()
      })

      it('returns false and rollsback if the flowcells cannot be created', async () => {
        api.traction.runs.create.mockResolvedValue(createRunJson)
        api.traction.chips.create.mockResolvedValue(createChipJson)
        api.traction.flowcells.create.mockResolvedValue(failedResponse)

        api.traction.chips.destroy.mockResolvedValue(successfulDestroyJson)
        api.traction.runs.destroy.mockResolvedValue(successfulDestroyJson)

        let runResponse = new Response(createRunJson)
        let runId = runResponse.deserialize.runs[0].id

        let chipResponse = new Response(createChipJson)
        let chipId = chipResponse.deserialize.chips[0].id

        let resp = await Run.create(run, api.traction)

        expect(api.traction.runs.destroy).toBeCalledWith(runId)
        expect(api.traction.chips.destroy).toBeCalledWith(chipId)

        expect(resp).toBeFalsy()
      })
    })

    // TODO: fix UnhandledPromiseRejectionWarning
    describe('rollback', () => {
      let responses, api, runResponse, chipResponse

      beforeEach(() =>{
        api = build(Api.Config, process.env)
        runResponse = new Response(createRunJson)
        chipResponse = new Response(createChipJson)
        responses = [runResponse, chipResponse]

        api.traction.runs.destroy = jest.fn()
        api.traction.chips.destroy = jest.fn()
      })

      it ('gets a list of responses', () => {
        api.traction.runs.destroy.mockResolvedValue(successfulDestroyJson)
        api.traction.chips.destroy.mockResolvedValue(successfulDestroyJson)

        Run.rollback(responses, api.traction)
        expect(api.traction.runs.destroy).toBeCalledWith(runResponse.deserialize.runs[0].id)
        expect(api.traction.chips.destroy).toBeCalledWith(chipResponse.deserialize.chips[0].id)
      })
    })

    describe('destroy', () =>{
      let api

      beforeEach(() =>{
        api = build(Api.Config, process.env)
        api.traction.runs.destroy = jest.fn()
      })

      it('rolls back the request', async () => {
        api.traction.runs.destroy.mockResolvedValue(successfulDestroyJson)
        let expected = new Response(successfulDestroyJson)

        let runResponse = new Response(createRunJson)
        let response = await Run.destroy(runResponse, api.traction.runs)

        expect(response).toEqual(expected)
      })
    })
  })
})
