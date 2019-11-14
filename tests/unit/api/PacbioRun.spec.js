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

      it('will have an plate with wells', () => {
        expect(run.plate.wells).toBeDefined()
      })

      describe('wells', () => {

        let wells

        beforeEach(() => {
          wells = run.plate.wells
        })

        it('will create 96 wells', () => {
          expect(wells.length).toEqual(96)
        })

        describe('each', () => {

          let firstWell, lastWell

          beforeEach(() => {
            firstWell = wells[0]
            lastWell = wells[95]
          })

          it('will have a row', () => {
            expect(firstWell.row).toEqual('A')
            expect(lastWell.row).toEqual('H')
          })

          it('will have a column', () => {
            expect(firstWell.column).toEqual('1')
            expect(lastWell.column).toEqual('12')
          })

          it('will have a position', () => {
            expect(firstWell.position).toEqual('A1')
            expect(lastWell.position).toEqual('H12')
          })

          it('will have movie_time', () => {
            expect(firstWell.movie_time).toBeDefined()
            expect(lastWell.movie_time).toBeDefined()
          })

          it('will have an insert_size', () => {
            expect(firstWell.insert_size).toBeDefined()
            expect(lastWell.insert_size).toBeDefined()
          })

          it('will have an on_plate_laoding_concentration', () => {
            expect(firstWell.on_plate_loading_concentration).toBeDefined()
            expect(lastWell.on_plate_loading_concentration).toBeDefined()
          })

          it('will have a sequencing_mode', () => {
            expect(firstWell.sequencing_mode).toBeDefined()
            expect(lastWell.sequencing_mode).toBeDefined()
          })

          it('will have a library', () => {
            // Assuming there is only one library in a well
            expect(firstWell.libraries[0]).toEqual({id: '', barcode: ''})
            expect(lastWell.libraries[0]).toEqual({id: '', barcode: ''})
          })
        })
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

  describe('create', () => {
    let api

    //  add well library
    beforeEach(() => {
      run = Run.build()
      run['name'] = 'run1'
      run.plate.wells[0] = { position: 'A1', libraries: [{ id: 1 }] }
      run.plate.wells[1] = { position: 'A2', libraries: [{ id: 2 }] }

      api = build(Api.Config, process.env)
      api.traction.pacbio.runs.create = jest.fn()
      api.traction.pacbio.plates.create = jest.fn()
      api.traction.pacbio.wells.create = jest.fn()
      api.traction.pacbio.runs.destroy = jest.fn()
      api.traction.pacbio.plates.destroy = jest.fn()
      api.traction.pacbio.wells.destroy = jest.fn()
    })

    it('returns true', async () => {
      api.traction.pacbio.runs.create.mockResolvedValue(Data.PacbioRun)
      api.traction.pacbio.plates.create.mockResolvedValue(Data.PacbioPlate)
      api.traction.pacbio.wells.create.mockResolvedValue(Data.PacbioWell)

      let resp = await Run.create(run, api.traction.pacbio)

      expect(api.traction.pacbio.runs.create).toBeCalled()
      expect(api.traction.pacbio.plates.create).toBeCalled()
      expect(api.traction.pacbio.wells.create).toBeCalled()

      expect(resp).toEqual([])
    })

    it('returns false if the run cannot be created', async () => {
      api.traction.pacbio.runs.create.mockReturnValue(failedResponse)
      
      let resp = await Run.create(run, api.traction.pacbio)

      expect(api.traction.pacbio.runs.create).toBeCalled()
      expect(api.traction.pacbio.plates.create).not.toBeCalled()
      expect(api.traction.pacbio.wells.create).not.toBeCalled()

      expect(resp).toEqual("title The record identified by 100 could not be found.")
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

      expect(api.traction.pacbio.runs.destroy).toBeCalledWith(runId)
  
      expect(resp).toEqual("title The record identified by 100 could not be found.")
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

      expect(api.traction.pacbio.runs.destroy).toBeCalledWith(runId)

      expect(resp).toEqual("title The record identified by 100 could not be found.")
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

  describe('update', () => {
    let api

    beforeEach(() => {
      run = Run.build()
      run['name'] = 'run1'
      run.plate.wells[0] = { position: 'A1', libraries: [{ id: 1 }] }
      run.plate.wells[1] = { position: 'A2', libraries: [{ id: 2 }] }

      api = build(Api.Config, process.env)
      api.traction.pacbio.runs.update = jest.fn()
    })

    it('returns true', async () => {
      api.traction.pacbio.runs.update.mockResolvedValue(Data.PacbioRun)
      let resp = await Run.update(run, api.traction.pacbio)

      expect(api.traction.pacbio.runs.update).toBeCalled()
      expect(resp).toEqual([])
    })
  })

  describe('updateResource', () => {
    beforeEach(() => {
      request.update = jest.fn()
    })

    it('success', async () => {
      request.update.mockResolvedValue([Data.PacbioRun])
      let mockResponse = new Response(Data.PacbioRun)

      let response = await Run.updateResource({}, request)
      expect(response).toEqual(mockResponse)
    })

    it('failure', async () => {
      request.update.mockReturnValue([failedResponse])

      let message
      try {
        await Run.updateResource({}, request)
      } catch (err) {
        message = err.message
      }
      expect(message).toEqual("title The record identified by 100 could not be found.")
    })
  })

  describe('updateRunPayload', () => {
    let run

    beforeEach(() => {
      run = new Response(Data.PacbioRun).deserialize.runs[0]
    })

    it('return run payload', async () => {
      let result = Run.updateRunPayload(run)

      expect(result.data.id).toEqual(run.id)
      expect(result.data.type).toEqual("runs")
      expect(result.data.attributes.name).toEqual(run.name)
      expect(result.data.attributes.template_prep_kit_box_barcode).toEqual(run.template_prep_kit_box_barcode)
      expect(result.data.attributes.binding_kit_box_barcode).toEqual(run.binding_kit_box_barcode)
      expect(result.data.attributes.sequencing_kit_box_barcode).toEqual(run.sequencing_kit_box_barcode)
      expect(result.data.attributes.dna_control_complex_box_barcode).toEqual(run.dna_control_complex_box_barcode)
      expect(result.data.attributes.system_name).toEqual(run.system_name)
    })
  })

  describe('updateWellPayload', () => {
    let well

    beforeEach(() => {
      well = new Response(Data.PacbioWell).deserialize.wells[0]
      well.libraries = [{id: 1}]
    })

    it('return run payload', async () => {
      let result = Run.updateWellPayload(well)

      expect(result.data.id).toEqual(well.id)
      expect(result.data.type).toEqual("wells")
      expect(result.data.attributes.row).toEqual(well.row)
      expect(result.data.attributes.column).toEqual(well.column)
      expect(result.data.attributes.movie_time).toEqual(well.movie_time)
      expect(result.data.attributes.insert_size).toEqual(well.insert_size)
      expect(result.data.attributes.on_plate_loading_concentration).toEqual(well.on_plate_loading_concentration)
      expect(result.data.attributes.sequencing_mode).toEqual(well.sequencing_mode)
      expect(result.data.relationships.libraries.data[0].type).toEqual("libraries")
      expect(result.data.relationships.libraries.data[0].id).toEqual(well.libraries[0].id)
    })
  })
})
