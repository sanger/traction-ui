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

  let cmp, props, wrapper, request, mockResponse, response, failedResponse, chipBarcode, barcode1, run, updatedRun

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

  describe('build', () => {

    describe('new object', () => {
      beforeEach(() => {
        run = Run.build()
      })

      it('will have a temporary id', () => {
        expect(run.id).toEqual('new')
      })

      it('will have a name', () => {
        expect(run.name).toBeDefined()
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
        expect(flowcells['0'].position).toEqual(1)
        expect(flowcells['1'].position).toEqual(2)
      })

    })

    describe('existing object', () => {
      beforeEach(() => {
        run = Run.build({id: 1, name: 'name1'})
      })

      it('assigns the object correctly', () => {
        expect(run.id).toEqual(1)
        expect(run.name).toEqual('name1')
      })
    })



  })

  describe('assign', () => {
    let object, assigned

    beforeEach(() => {
      object = { a: 'a', b: { c: 'c', d: { e: 'e', f: 'f' } } }
    })

    it('if the key exists at the top level', () => {
      assigned = Run.assign(object, {a: 'why'})
      expect(assigned).toEqual({ a: 'why', b: { c: 'c', d: { e: 'e', f: 'f' } } })
    })

    it('if the key exists at the second level', () => {
      assigned = Run.assign(object, {b: {c: 'dont'}})
      expect(assigned).toEqual({ a: 'a', b: { c: 'dont', d: { e: 'e', f: 'f' } } })
    })

    it('if the key exists at the third level', () => {
      assigned = Run.assign(object, {d: {e: 'dont', g: 'you'}})
      expect(assigned).toEqual({ a: 'a', b: { c: 'c', d: { e: 'dont', f: 'f', g: 'you' } } })
    })

    it('if the key does not exist', () => {
      assigned = Run.assign(object, {h: 'just turn off your television set and go and do something less boring instead'})
      expect(assigned).toEqual(object)
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
    let errors, flowcells, validFlowcell, invalidFlowcell, validChip, invalidChip

    beforeEach(() => {
      run = Run.build()

      validFlowcell = { position: 1, library: { barcode: 'TRAC-1', id: 1}}
      invalidFlowcell = { position: 2, library: { barcode: 'TRAC-1' }}

      validChip = {barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX'}
      invalidChip = {barcode: 'XYZ1234'}
    })

    describe('chip', () => {

      it('will raise an error if the barcode is not present', () => {
        expect(Run.validateChip(run.chip)).toEqual("barcode not present")
      })

      it('will raise an error if the barcode is not in the correct format', () => {
        expect(Run.validateChip(invalidChip)).toEqual("barcode not in correct format")
      })

      it('will be valid if barcode is in correct format', () => {
        expect(Run.validateChip(validChip)).not.toBeDefined()
      })
    })

    describe('flowcell', () => {

      let flowcell

      beforeEach(() => {
        flowcell = {library: {}}
      })

      it('will raise an error if the library is not present', () => {
        expect(Run.validateFlowcell(flowcell)).toEqual('library does not exist')
      })

      it('will be valid if the library id is present', () => {
        flowcell.library.barcode = barcode1
        flowcell.library.id = 1
        expect(Run.validateFlowcell(flowcell)).not.toBeDefined()
      })
    })

    describe('flowcells', () => {

      it('will raise an error if one of the flowcells is not valid', () => {
        flowcells = [validFlowcell, invalidFlowcell]
        errors = Run.validateFlowcells(flowcells)
        expect(errors['2']).toBeDefined()
      })

      it('will be valid if both flowcells are valid', () => {
        flowcells = [validFlowcell, validFlowcell]
        errors = Run.validateFlowcells(flowcells)
        expect(Object.keys(errors).length).toEqual(0)
      })

    })

    describe('run', () => {
      it('will raise an error if the chip is not valid', () => {
        run.chip = invalidChip
        run.chip.flowcells = [validFlowcell, validFlowcell]
        expect(Run.validate(run).chip).toBeDefined()
      })

      it('will raise an error if one of the flowcells is not valid', () => {
        run.chip = validChip
        run.chip.flowcells = [validFlowcell, invalidFlowcell]
        expect(Run.validate(run).flowcells[invalidFlowcell.position]).toBeDefined()
      })

      it('if valid will raise no errors', () => {
        run.chip = validChip
        run.chip.flowcells = [validFlowcell, validFlowcell]
        expect(Object.keys(Run.validate(run)).length).toEqual(0)
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
      let runId

      beforeEach(() => {
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
        api.traction.saphyr.runs.create = jest.fn()
        api.traction.saphyr.chips.create = jest.fn()
        api.traction.saphyr.flowcells.create = jest.fn()
        api.traction.saphyr.runs.destroy = jest.fn()
        api.traction.saphyr.chips.destroy = jest.fn()
      })

      it('returns true', async () => {
        api.traction.saphyr.runs.create.mockResolvedValue(createRunJson)
        api.traction.saphyr.chips.create.mockResolvedValue(createChipJson)
        api.traction.saphyr.flowcells.create.mockResolvedValue(createFlowcellJson)
        expect(await Run.create(run, api.traction.saphyr)).toBeTruthy()
      })

      it('returns false if the run cannot be created', async () => {
        api.traction.saphyr.runs.create.mockReturnValue(failedResponse)
        expect(api.traction.saphyr.chips.create).not.toBeCalled()
        expect(api.traction.saphyr.flowcells.create).not.toBeCalled()
        expect(await Run.create(run, api.traction.saphyr)).toBeFalsy()
      })

      it('returns false and rollsback if the chip cannot be created', async () => {
        api.traction.saphyr.runs.create.mockReturnValue(createRunJson)
        api.traction.saphyr.chips.create.mockResolvedValue(failedResponse)

        api.traction.saphyr.runs.destroy.mockResolvedValue(successfulDestroyJson)

        let runResponse = new Response(createRunJson)
        let runId = runResponse.deserialize.runs[0].id

        let resp = await Run.create(run, api.traction.saphyr)

        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runId)
        expect(api.traction.saphyr.flowcells.create).not.toBeCalled()

        expect(resp).toBeFalsy()
      })

      it('returns false and rollsback if the flowcells cannot be created', async () => {
        api.traction.saphyr.runs.create.mockResolvedValue(createRunJson)
        api.traction.saphyr.chips.create.mockResolvedValue(createChipJson)
        api.traction.saphyr.flowcells.create.mockResolvedValue(failedResponse)

        api.traction.saphyr.chips.destroy.mockResolvedValue(successfulDestroyJson)
        api.traction.saphyr.runs.destroy.mockResolvedValue(successfulDestroyJson)

        let runResponse = new Response(createRunJson)
        let runId = runResponse.deserialize.runs[0].id

        let chipResponse = new Response(createChipJson)
        let chipId = chipResponse.deserialize.chips[0].id

        let resp = await Run.create(run, api.traction.saphyr)

        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runId)
        expect(api.traction.saphyr.chips.destroy).toBeCalledWith(chipId)

        expect(resp).toBeFalsy()
      })
    })

    describe('rollback', () => {
      let responses, api, runResponse, chipResponse

      beforeEach(() =>{
        api = build(Api.Config, process.env)
        runResponse = new Response(createRunJson)
        chipResponse = new Response(createChipJson)
        responses = [runResponse, chipResponse]

        api.traction.saphyr.runs.destroy = jest.fn()
        api.traction.saphyr.chips.destroy = jest.fn()
      })

      it ('gets a list of responses', () => {
        api.traction.saphyr.runs.destroy.mockResolvedValue(successfulDestroyJson)
        api.traction.saphyr.chips.destroy.mockResolvedValue(successfulDestroyJson)

        Run.rollback(responses, api.traction.saphyr)
        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runResponse.deserialize.runs[0].id)
        expect(api.traction.saphyr.chips.destroy).toBeCalledWith(chipResponse.deserialize.chips[0].id)
      })
    })

    describe('destroy', () =>{
      let api

      beforeEach(() =>{
        api = build(Api.Config, process.env)
        api.traction.saphyr.runs.destroy = jest.fn()
      })

      it('rolls back the request', async () => {
        api.traction.saphyr.runs.destroy.mockResolvedValue(successfulDestroyJson)
        let expected = new Response(successfulDestroyJson)

        let runResponse = new Response(createRunJson)
        let response = await Run.destroy(runResponse, api.traction.saphyr.runs)

        expect(response).toEqual(expected)
      })
    })
  })

  describe('updateFlowcell', () => {

    let flowcell, libraryId

    beforeEach(() => {
      run = Run.build()
      libraryId = 1
      flowcell = run.chip.flowcells[0]
      updatedRun = Run.updateFlowcell(run, flowcell.position, libraryId)
    })

    it('will update the correct flowcell in the run', () => {
      expect(updatedRun.chip.flowcells[0].library.id).toEqual(libraryId)
    })
  })

  describe('updateChip', () => {

    beforeEach(() => {
      run = Run.build()
      chipBarcode = 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX'
      updatedRun = Run.updateChip(run, chipBarcode)
    })


    it('will update the chip barcode', () => {
      expect(updatedRun.chip.barcode).toEqual(chipBarcode)
    })

  })

})
