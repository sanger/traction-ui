import Vue from 'vue'
import { mount, Data } from '../testHelper'
import Request from '@/api/Request'
import Response from '@/api/Response'
import * as Run from '@/api/PacbioRun'
import build from '@/api/ApiBuilder'
import Api from '@/api'

describe('Run', () => {

  let cmp, props, wrapper, request, run, failedResponse

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

    failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['The record identified by 100 could not be found.'] } } }
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

      it('will have an template_prep_kit_box_barcode', () => {
        expect(run.template_prep_kit_box_barcode).toBeDefined()
      })

      it('will have an binding_kit_box_barcode', () => {
        expect(run.binding_kit_box_barcode).toBeDefined()
      })

      it('will have an sequencing_kit_box_barcode', () => {
        expect(run.sequencing_kit_box_barcode).toBeDefined()
      })

      it('will have an dna_control_complex_box_barcode', () => {
        expect(run.dna_control_complex_box_barcode).toBeDefined()
      })

      it('will have an comments', () => {
        expect(run.comments).toBeDefined()
      })
      
      it('will have an system_name', () => {
        expect(run.system_name).toBeDefined()
      })

      it('will have an empty plate', () => {
        expect(run.plate).toBeDefined()
      })

      it('will have a plate with a barcode', () => {
        expect(run.plate.barcode).toBeDefined()
      })

      it('will have a plate with wells', () => {
        expect(run.plate.wells.length).toEqual(4) //TODO
      })

      it('each well will have a library', () => {
        expect(run.plate.wells[0].library).toBeDefined()
      })

      it('each well will have a row', () => {
        let wells = run.plate.wells
        expect(wells['0'].row).toEqual('A')
        expect(wells['1'].row).toEqual('A')
        expect(wells['2'].row).toEqual('B')
        expect(wells['3'].row).toEqual('B')
      })

      it('each well will have a column', () => {
        let wells = run.plate.wells
        expect(wells['0'].column).toEqual('1')
        expect(wells['1'].column).toEqual('2')
        expect(wells['2'].column).toEqual('1')
        expect(wells['3'].column).toEqual('2')
      })

      // TODO: add other well metadata
    })
  })

  describe('createResource', () => {
    beforeEach(() => {
      request.create = jest.fn()
    })

    it('success', async () => {
      request.create.mockResolvedValue(Data.PacbioRun)
      let mockResponse = new Response(Data.PacbioRun)

      let response = await Run.createResource({}, request)
      expect(response).toEqual(mockResponse)
    })

    it('failure', async () => {
      request.create.mockReturnValue(failedResponse)

      let message
      try {
        await Run.createResource({}, request)
      } catch (err) {
        message = err.message
      }
      expect(message).toEqual("title The record identified by 100 could not be found.")
    })

  })

  describe('createRelationshipResource', () => {
    let id, relationship

    beforeEach(() => {
      request.createRelationship = jest.fn()
      id = 1
      relationship = 'libraries'
    })

    it('success', async () => {
      request.createRelationship.mockResolvedValue(Data.PacbioRun)
      let mockResponse = new Response(Data.PacbioRun)

      let response = await Run.createRelationshipResource({}, request, id, relationship)
      expect(response).toEqual(mockResponse)
    })

    it('failure', async () => {
      request.createRelationship.mockReturnValue(failedResponse)

      let message
      try {
        await Run.createRelationshipResource({}, request, id, relationship)
      } catch (err) {
        message = err.message
      }
      expect(message).toEqual("title The record identified by 100 could not be found.")
    })

  })

  describe('create', () => {
    let api

    //  add well library
    beforeEach(() => {
      run = Run.build()
      run['name'] = 'run1'
      run.plate['barcode'] = "abc123barcode"
      run.plate.wells[0] = { position: 'A1', library: { id: 1 } }
      run.plate.wells[1] = { position: 'A2', library: { id: 2 } }

      api = build(Api.Config, process.env)
      api.traction.pacbio.runs.create = jest.fn()
      api.traction.pacbio.plates.create = jest.fn()
      api.traction.pacbio.wells.create = jest.fn()
      api.traction.pacbio.wells.createRelationship = jest.fn()
      api.traction.pacbio.runs.destroy = jest.fn()
      api.traction.pacbio.plates.destroy = jest.fn()
      api.traction.pacbio.wells.destroy = jest.fn()
    })

    it('returns true', async () => {
      api.traction.pacbio.runs.create.mockResolvedValue(Data.PacbioRun)
      api.traction.pacbio.plates.create.mockResolvedValue(Data.PacbioPlate)
      api.traction.pacbio.wells.create.mockResolvedValue(Data.PacbioWell)
      api.traction.pacbio.wells.createRelationship.mockResolvedValue(Data.PacbioWellLibrary)

      let resp = await Run.create(run, api.traction.pacbio)

      expect(api.traction.pacbio.runs.create).toBeCalled()
      expect(api.traction.pacbio.plates.create).toBeCalled()
      expect(api.traction.pacbio.wells.create).toBeCalled()

      expect(resp).toBeTruthy()
    })

    it('returns false if the run cannot be created', async () => {
      api.traction.pacbio.runs.create.mockReturnValue(failedResponse)
      
      let resp = await Run.create(run, api.traction.pacbio)

      expect(api.traction.pacbio.runs.create).toBeCalled()
      expect(api.traction.pacbio.plates.create).not.toBeCalled()
      expect(api.traction.pacbio.wells.create).not.toBeCalled()
      expect(api.traction.pacbio.wells.createRelationship).not.toBeCalled()

      expect(resp).toBeFalsy()
    })

    it('returns false and rollsback if the plate cannot be created', async () => {
      api.traction.pacbio.runs.create.mockReturnValue(Data.PacbioRun)
      api.traction.pacbio.plates.create.mockResolvedValue(failedResponse)

      api.traction.pacbio.runs.destroy.mockResolvedValue(Data.SuccessfulDestroy)

      let runResponse = new Response(Data.PacbioRun)
      let runId = runResponse.deserialize.runs[0].id

      let resp = await Run.create(run, api.traction.pacbio)

      expect(api.traction.pacbio.runs.create).toBeCalled()
      expect(api.traction.pacbio.plates.create).toBeCalled()
      expect(api.traction.pacbio.wells.create).not.toBeCalled()
      expect(api.traction.pacbio.wells.createRelationship).not.toBeCalled()

      expect(api.traction.pacbio.runs.destroy).toBeCalledWith(runId)
  
      expect(resp).toBeFalsy()
    })

    it('returns false and rollsback if the wells cannot be created', async () => {
      api.traction.pacbio.runs.create.mockResolvedValue(Data.PacbioRun)
      api.traction.pacbio.plates.create.mockResolvedValue(Data.PacbioPlate)
      api.traction.pacbio.wells.create.mockResolvedValue(failedResponse)

      api.traction.pacbio.runs.destroy.mockResolvedValue(Data.SuccessfulDestroy)
      api.traction.pacbio.plates.destroy.mockResolvedValue(Data.SuccessfulDestroy)

      let runResponse = new Response(Data.PacbioRun)
      let runId = runResponse.deserialize.runs[0].id
      
      let resp = await Run.create(run, api.traction.pacbio)

      expect(api.traction.pacbio.runs.create).toBeCalled()
      expect(api.traction.pacbio.plates.create).toBeCalled()
      expect(api.traction.pacbio.wells.create).toBeCalled()
      expect(api.traction.pacbio.wells.createRelationship).not.toBeCalled()

      expect(api.traction.pacbio.runs.destroy).toBeCalledWith(runId)

      expect(resp).toBeFalsy()
    })

    it('returns false and rollsback if the well libraries cannot be created', async () => {
      api.traction.pacbio.runs.create.mockResolvedValue(Data.PacbioRun)
      api.traction.pacbio.plates.create.mockResolvedValue(Data.PacbioPlate)
      api.traction.pacbio.wells.create.mockResolvedValue(Data.PacbioWell)
      api.traction.pacbio.wells.createRelationship.mockResolvedValue(failedResponse)

      api.traction.pacbio.runs.destroy.mockResolvedValue(Data.SuccessfulDestroy)
      api.traction.pacbio.plates.destroy.mockResolvedValue(Data.SuccessfulDestroy)
      api.traction.pacbio.wells.destroy.mockResolvedValue(Data.SuccessfulDestroy)

      let runResponse = new Response(Data.PacbioRun)
      let runId = runResponse.deserialize.runs[0].id

      let resp = await Run.create(run, api.traction.pacbio)

      expect(api.traction.pacbio.runs.create).toBeCalled()
      expect(api.traction.pacbio.plates.create).toBeCalled()
      expect(api.traction.pacbio.wells.create).toBeCalled()
      expect(api.traction.pacbio.wells.createRelationship).toBeCalled()

      expect(api.traction.pacbio.runs.destroy).toBeCalledWith(runId)

      expect(resp).toBeFalsy()
    })
  })

  describe('destroy', () => {
    let api

    beforeEach(() => {
      api = build(Api.Config, process.env)
      api.traction.pacbio.runs.destroy = jest.fn()
    })

    it('rolls back the request', async () => {
      api.traction.pacbio.runs.destroy.mockResolvedValue(Data.SuccessfulDestroy)
      let expected = new Response(Data.SuccessfulDestroy)

      let response = await Run.destroy(1, api.traction.pacbio.runs)
      expect(response).toEqual(expected)
    })
  })


})
