import { Data } from '@support/testHelper'
import Response from '@/api/Response'
import * as Run from '@/api/PacbioRun'
import build from '@/api/ApiBuilder'
import Api from '@/api'
import { it } from 'vitest'

describe('Run', () => {
  let run, failedResponse

  beforeEach(() => {
    failedResponse = {
      status: 404,
      statusText: 'Record not found',
      data: { errors: { title: ['The record identified by 100 could not be found.'] } },
    }
  })

  describe('build', () => {
    describe('new object', () => {
      beforeEach(() => {
        run = Run.build()
      })

      it('will have a temporary id', () => {
        expect(run.id).toEqual('new')
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

      it('will have a plate with wells', () => {
        expect(run.plate.wells).toBeDefined()
      })

      it('will have a plate with wellsToDelete', () => {
        expect(run.plate.wellsToDelete).toBeDefined()
      })

      it('will have a smrt link version', () => {
        expect(run.smrt_link_version).toBeDefined()
      })
    })
  })

  describe('create', () => {
    let api, well1, well2, pacbioRequest

    //  add well library
    beforeEach(() => {
      run = Run.build()
      run['name'] = 'run1'
      run.plate.wells[0] = { position: 'A1', pools: [{ id: 1 }] }
      run.plate.wells[1] = { position: 'A2', pools: [{ id: 2 }] }

      api = build({ config: Api.Config, environment: import.meta.env })
      pacbioRequest = api.traction.pacbio
      pacbioRequest.runs.create = vi.fn()
      pacbioRequest.runs.plates.create = vi.fn()
      pacbioRequest.runs.wells.create = vi.fn()
      pacbioRequest.runs.destroy = vi.fn()
      pacbioRequest.runs.plates.destroy = vi.fn()
      pacbioRequest.runs.wells.destroy = vi.fn()
    })

    it('returns true', async () => {
      pacbioRequest.runs.create.mockResolvedValue(Data.PacbioRun)
      pacbioRequest.runs.plates.create.mockResolvedValue(Data.PacbioSequencingPlate)
      pacbioRequest.runs.wells.create.mockResolvedValue(Data.PacbioWell)

      let resp = await Run.create(run, pacbioRequest)

      expect(pacbioRequest.runs.create).toBeCalled()
      expect(pacbioRequest.runs.plates.create).toBeCalled()
      expect(pacbioRequest.runs.wells.create).toBeCalled()

      expect(resp).toEqual([])
    })

    it('returns false if the run cannot be created', async () => {
      pacbioRequest.runs.create.mockReturnValue(failedResponse)

      let promise = new Promise((resolve) => {
        resolve(Data.SuccessfulDestroy)
      })
      pacbioRequest.runs.destroy.mockReturnValue([promise])

      let resp = await Run.create(run, pacbioRequest)

      expect(pacbioRequest.runs.create).toBeCalled()
      expect(pacbioRequest.runs.plates.create).not.toBeCalled()
      expect(pacbioRequest.runs.wells.create).not.toBeCalled()

      expect(resp).toEqual('title The record identified by 100 could not be found.')
    })

    it('returns false and rollsback if the plate cannot be created', async () => {
      pacbioRequest.runs.create.mockReturnValue(Data.PacbioRun)
      pacbioRequest.runs.plates.create.mockResolvedValue(failedResponse)

      let promise = new Promise((resolve) => {
        resolve(Data.SuccessfulDestroy)
      })
      pacbioRequest.runs.destroy.mockReturnValue([promise])

      let runResponse = new Response(Data.PacbioRun)
      let runId = runResponse.deserialize.runs[0].id

      let resp = await Run.create(run, pacbioRequest)

      expect(pacbioRequest.runs.create).toBeCalled()
      expect(pacbioRequest.runs.plates.create).toBeCalled()
      expect(pacbioRequest.runs.wells.create).not.toBeCalled()

      expect(pacbioRequest.runs.destroy).toBeCalledWith(runId)

      expect(resp).toEqual('title The record identified by 100 could not be found.')
    })

    it('returns false and rollsback if the wells cannot be created', async () => {
      pacbioRequest.runs.create.mockResolvedValue(Data.PacbioRun)
      pacbioRequest.runs.plates.create.mockResolvedValue(Data.PacbioSequencingPlate)
      pacbioRequest.runs.wells.create.mockResolvedValue(failedResponse)

      let promise = new Promise((resolve) => {
        resolve(Data.SuccessfulDestroy)
      })
      pacbioRequest.runs.destroy.mockReturnValue([promise])

      let runResponse = new Response(Data.PacbioRun)
      let runId = runResponse.deserialize.runs[0].id

      let resp = await Run.create(run, pacbioRequest)

      expect(pacbioRequest.runs.create).toBeCalled()
      expect(pacbioRequest.runs.plates.create).toBeCalled()
      expect(pacbioRequest.runs.wells.create).toBeCalled()

      expect(pacbioRequest.runs.destroy).toBeCalledWith(runId)

      expect(resp).toEqual('title The record identified by 100 could not be found.')
    })

    describe('when a well has no pools', () => {
      beforeEach(() => {
        well1 = new Response(Data.PacbioWells).deserialize.wells[0]
        well2 = new Response(Data.PacbioWells).deserialize.wells[1]

        well1['pools'] = [{ id: 1 }, { id: 2 }]
        well2['pools'] = []

        run = {
          id: '1',
          name: 'run1',
          plate: {
            wells: [well1, well2],
          },
        }
      })

      it('should remove that well from the payload', () => {
        pacbioRequest.runs.create.mockResolvedValue([Data.PacbioRun])

        let promise = new Promise((resolve) => {
          resolve(Data.SuccessfulDestroy)
        })
        pacbioRequest.runs.destroy.mockReturnValue([promise])

        Run.create(run, pacbioRequest)
        expect(pacbioRequest.runs.create).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('createResource', () => {
    it('success', async () => {
      const request = { create: vi.fn() }
      request.create.mockResolvedValue(Data.PacbioRun)
      let mockResponse = new Response(Data.PacbioRun)

      let response = await Run.createResource({}, request)
      expect(response).toEqual(mockResponse)
    })

    it('failure', async () => {
      const request = { create: vi.fn() }
      request.create.mockReturnValue(failedResponse)

      let message
      try {
        await Run.createResource({}, request)
      } catch (err) {
        message = err.message
      }
      expect(message).toEqual('title The record identified by 100 could not be found.')
    })
  })

  describe('createRunPayload', () => {
    let run

    beforeEach(() => {
      run = new Response(Data.PacbioRun).deserialize.runs[0]
    })

    it('returns a runs payload', async () => {
      let result = Run.createRunPayload(run)

      expect(result.data.type).toEqual('runs')
      expect(result.data.attributes.sequencing_kit_box_barcode).toEqual(
        run.sequencing_kit_box_barcode,
      )
      expect(result.data.attributes.dna_control_complex_box_barcode).toEqual(
        run.dna_control_complex_box_barcode,
      )
      expect(result.data.attributes.system_name).toEqual(run.system_name)

      expect(result.data.attributes.smrt_link_version).toEqual(run.smrt_link_version)
    })
  })

  describe('createPlatePayload', () => {
    it('returns a plates payload', async () => {
      let result = Run.createPlatePayload(123)

      expect(result.data.type).toEqual('plates')
      expect(result.data.attributes.pacbio_run_id).toEqual(123)
    })
  })

  describe('createWellsPayload', () => {
    let wells, plateID

    beforeEach(() => {
      run = Run.build()

      run.plate.wells[0] = { position: 'A1', pools: [{ id: 1 }, { id: 2 }] }
      run.plate.wells[1] = { position: 'A2', pools: [{ id: 2 }] }

      wells = run.plate.wells
      plateID = 1
    })

    it('returns wells payload', async () => {
      let result = Run.createWellsPayload(wells, plateID)

      expect(result.data.type).toEqual('wells')
      expect(result.data.attributes.wells[0].row).toEqual(wells[0].row)
      expect(result.data.attributes.wells[0].column).toEqual(wells[0].column)
      expect(result.data.attributes.wells[0].movie_time).toEqual(wells[0].movie_time)
      expect(result.data.attributes.wells[0].on_plate_loading_concentration).toEqual(
        wells[0].on_plate_loading_concentration,
      )
      expect(result.data.attributes.wells[0].generate_hifi).toEqual(wells[0].generate_hifi)
      expect(result.data.attributes.wells[0].ccs_analysis_output).toEqual(
        wells[0].ccs_analysis_output,
      )
      expect(result.data.attributes.wells[0].pre_extension_time).toEqual(
        wells[0].pre_extension_time,
      )
      expect(result.data.attributes.wells[0].ccs_analysis_output).toEqual(
        wells[0].ccs_analysis_output,
      )
      expect(result.data.attributes.wells[0].binding_kit_box_barcode).toEqual(
        wells[0].binding_kit_box_barcode,
      )
      expect(result.data.attributes.wells[0].loading_target).toEqual(wells[0].loading_target)
      expect(result.data.attributes.wells[0].relationships.plate.data.type).toEqual('plates')
      expect(result.data.attributes.wells[0].relationships.plate.data.id).toEqual(plateID)
      expect(result.data.attributes.wells[0].relationships.pools.data[0].type).toEqual('pools')
      expect(result.data.attributes.wells[0].relationships.pools.data[0].id).toEqual(
        wells[0].pools[0].id,
      )
      expect(result.data.attributes.wells[0].relationships.pools.data[1].type).toEqual('pools')
      expect(result.data.attributes.wells[0].relationships.pools.data[1].id).toEqual(
        wells[0].pools[1].id,
      )
      expect(result.data.attributes.wells[1].relationships.pools.data[0].type).toEqual('pools')
      expect(result.data.attributes.wells[1].relationships.pools.data[0].id).toEqual(
        wells[1].pools[0].id,
      )
    })
  })

  describe('update', () => {
    let api, well1, well2, failedResponse, pacbioRequest

    beforeEach(() => {
      well1 = new Response(Data.PacbioWells).deserialize.wells[0]
      well2 = new Response(Data.PacbioWells).deserialize.wells[1]

      well1['pools'] = [{ id: 1 }, { id: 2 }]
      well2['pools'] = [{ id: 2 }]

      run = {
        id: '1',
        name: 'run1',
        plate: {
          wells: [well1, well2],
          wellsToDelete: [],
        },
      }

      api = build({ config: Api.Config, environment: import.meta.env })
      pacbioRequest = api.traction.pacbio
      pacbioRequest.runs.update = vi.fn()
      pacbioRequest.runs.wells.update = vi.fn()

      failedResponse = {
        status: 404,
        statusText: 'Record not found',
        data: { errors: { title: ['The record identified by 100 could not be found.'] } },
      }
    })

    it('on succuess, it returns an empty list when there are no errors', async () => {
      pacbioRequest.runs.update.mockResolvedValue(Data.PacbioRun)
      pacbioRequest.runs.wells.update.mockResolvedValue(Data.PacbioWell)

      let resp = await Run.update(run, pacbioRequest)

      let expectedRunPayload = Run.updateRunPayload(run)
      let expectedWell1Payload = Run.updateWellPayload(well1)
      let expectedWell2Payload = Run.updateWellPayload(well2)

      expect(pacbioRequest.runs.update).toBeCalledWith(expectedRunPayload)
      expect(pacbioRequest.runs.wells.update).toHaveBeenNthCalledWith(1, expectedWell1Payload)
      expect(pacbioRequest.runs.wells.update).toHaveBeenNthCalledWith(2, expectedWell2Payload)

      expect(resp).toEqual([])
    })

    it('on failure, it returns a list of errors', async () => {
      pacbioRequest.runs.update.mockResolvedValue(failedResponse)
      let resp = await Run.update(run, pacbioRequest)

      expect(pacbioRequest.runs.update).toHaveBeenCalled()
      expect(pacbioRequest.runs.wells.update).not.toHaveBeenCalled()

      expect(resp).toEqual(['title The record identified by 100 could not be found.'])
    })

    describe('when a well has no pools', () => {
      beforeEach(() => {
        well1 = new Response(Data.PacbioWells).deserialize.wells[0]
        well2 = new Response(Data.PacbioWells).deserialize.wells[1]

        well1['pools'] = [{ id: 1 }, { id: 2 }]
        well2['pools'] = []

        run = {
          id: '1',
          name: 'run1',
          plate: {
            wells: [well1, well2],
          },
        }
      })

      it('should remove that well from the payload', () => {
        pacbioRequest.runs.update.mockResolvedValue(Data.PacbioRun)

        Run.update(run, pacbioRequest)
        expect(pacbioRequest.runs.update).toHaveBeenCalledTimes(1)
      })
    })

    describe('wellsToDelete', () => {
      beforeEach(() => {
        run = {
          id: '1',
          name: 'run1',
          plate: {
            wells: [],
            wellsToDelete: ['1', '2'],
          },
        }
        pacbioRequest.runs.wells.destroy = vi.fn()
      })

      it('should call destroy method for each id in wellsToDelete', async () => {
        let promise = new Promise((resolve) => {
          resolve(Data.SuccessfulDestroy)
        })
        pacbioRequest.runs.update.mockResolvedValue(Data.PacbioRun)
        pacbioRequest.runs.wells.destroy.mockReturnValue([promise])

        await Run.update(run, pacbioRequest)

        expect(pacbioRequest.runs.wells.destroy).toHaveBeenCalledTimes(2)
        expect(pacbioRequest.runs.wells.destroy).toHaveBeenCalledWith('1')
        expect(pacbioRequest.runs.wells.destroy).toHaveBeenCalledWith('2')
      })
    })
  })

  describe('updateResource', () => {
    it('success', async () => {
      const request = { update: vi.fn() }
      request.update.mockResolvedValue(Data.PacbioRun)
      let mockResponse = new Response(Data.PacbioRun)

      let response = await Run.updateResource({}, request)
      expect(response).toEqual(mockResponse)
    })

    it('failure', async () => {
      const request = { update: vi.fn() }
      request.update.mockReturnValue(failedResponse)

      let message
      try {
        await Run.updateResource({}, request)
      } catch (err) {
        message = err.message
      }
      expect(message).toEqual('title The record identified by 100 could not be found.')
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
      expect(result.data.type).toEqual('runs')
      expect(result.data.attributes.sequencing_kit_box_barcode).toEqual(
        run.sequencing_kit_box_barcode,
      )
      expect(result.data.attributes.dna_control_complex_box_barcode).toEqual(
        run.dna_control_complex_box_barcode,
      )
      expect(result.data.attributes.system_name).toEqual(run.system_name)
      expect(result.data.attributes.comments).toEqual(run.comments)
    })
  })

  describe('updateWellPayload', () => {
    let well

    beforeEach(() => {
      well = new Response(Data.PacbioWell).deserialize.wells[0]
      well.pools = [{ id: 1 }]
    })

    it('return run payload', async () => {
      let result = Run.updateWellPayload(well)

      expect(result.data.id).toEqual(well.id)
      expect(result.data.type).toEqual('wells')
      expect(result.data.attributes.row).toEqual(well.row)
      expect(result.data.attributes.column).toEqual(well.column)
      expect(result.data.attributes.movie_time).toEqual(well.movie_time)
      expect(result.data.attributes.on_plate_loading_concentration).toEqual(
        well.on_plate_loading_concentration,
      )
      expect(result.data.attributes.generate_hifi).toEqual(well.generate_hifi)
      expect(result.data.attributes.ccs_analysis_output).toEqual(well.ccs_analysis_output)
      expect(result.data.attributes.pre_extension_time).toEqual(well.pre_extension_time)
      expect(result.data.attributes.binding_kit_box_barcode).toEqual(well.binding_kit_box_barcode)
      expect(result.data.attributes.loading_target).toEqual(well.loading_target)
      expect(result.data.relationships.pools.data[0].type).toEqual('pools')
      expect(result.data.relationships.pools.data[0].id).toEqual(well.pools[0].id)
    })
  })

  describe('destroy', () => {
    let api, pacbioRequest

    beforeEach(() => {
      api = build({ config: Api.Config, environment: import.meta.env })
      pacbioRequest = api.traction.pacbio
      pacbioRequest.runs.destroy = vi.fn()
    })

    it('rolls back the request', async () => {
      let promise = new Promise((resolve) => {
        resolve(Data.SuccessfulDestroy)
      })

      pacbioRequest.runs.destroy.mockReturnValue([promise])
      let expected = new Response(Data.SuccessfulDestroy)

      let response = await Run.destroy(1, pacbioRequest.runs)
      expect(response).toEqual(expected)
    })
  })
})
