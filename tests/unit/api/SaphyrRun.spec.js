import { Data } from 'testHelper'
import Response from '@/api/Response'
import * as Run from '@/api/SaphyrRun'
import build from '@/api/ApiBuilder'
import Api from '@/api'

describe('Run', () => {
  let failedResponse, chipBarcode, run

  beforeEach(() => {
    failedResponse = {
      status: 404,
      statusText: 'Record not found',
      data: { errors: { title: ['The record identified by 100 could not be found.'] } },
    }

    chipBarcode = 'XYZ1234567891012'
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
        run = Run.build({ id: 1, name: 'name1' })
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
      assigned = Run.assign(object, { a: 'why' })
      expect(assigned).toEqual({ a: 'why', b: { c: 'c', d: { e: 'e', f: 'f' } } })
    })

    it('if the key exists at the second level', () => {
      assigned = Run.assign(object, { b: { c: 'dont' } })
      expect(assigned).toEqual({ a: 'a', b: { c: 'dont', d: { e: 'e', f: 'f' } } })
    })

    it('if the key exists at the third level', () => {
      assigned = Run.assign(object, { d: { e: 'dont', g: 'you' } })
      expect(assigned).toEqual({ a: 'a', b: { c: 'c', d: { e: 'dont', f: 'f', g: 'you' } } })
    })

    it('if the key does not exist', () => {
      assigned = Run.assign(object, {
        h: 'just turn off your television set and go and do something less boring instead',
      })
      expect(assigned).toEqual(object)
    })
  })

  describe('creating a run', () => {
    beforeEach(() => {
      run = Run.build()
      run['name'] = 'run1'
      run.chip['barcode'] = chipBarcode
      run.chip.flowcells[0] = { position: 1, library: { id: 1 } }
      run.chip.flowcells[1] = { position: 2, library: { id: 2 } }
    })

    describe('createRun', () => {
      it('success', async () => {
        const request = { create: jest.fn() }
        request.create.mockResolvedValue(Data.CreateRun)

        let mockResponse = new Response(Data.CreateRun)
        let response = await Run.createResource(
          { data: { type: 'runs', attributes: { name: run.name } } },
          request,
        )

        expect(response).toEqual(mockResponse)
      })

      it('failure', async () => {
        const request = { create: jest.fn() }
        request.create.mockReturnValue(failedResponse)

        let message
        try {
          await Run.createResource(
            { data: { type: 'runs', attributes: { name: run.name } } },
            request,
          )
        } catch (err) {
          message = err.message
        }
        expect(message).toEqual('title The record identified by 100 could not be found.')
      })
    })

    describe('createChip', () => {
      let runId

      beforeEach(() => {
        runId = 1
      })

      it('will create a chip and return a response', async () => {
        const request = { create: jest.fn() }
        request.create.mockResolvedValue(Data.CreateChip)

        let mockResponse = new Response(Data.CreateChip)
        let response = await Run.createResource(
          { data: { type: 'chips', attributes: { barcode: run.chip.barcode, run_id: runId } } },
          request,
        )
        expect(response).toEqual(mockResponse)
      })

      it('failure', async () => {
        const request = { create: jest.fn() }
        request.create.mockReturnValue(failedResponse)

        let message
        try {
          await Run.createResource(
            { data: { type: 'chips', attributes: { barcode: run.chip.barcode, run_id: runId } } },
            request,
          )
        } catch (err) {
          message = err.message
        }
        expect(message).toEqual('title The record identified by 100 could not be found.')
      })
    })

    describe('createFlowcell', () => {
      let flowcell, chipId

      beforeEach(() => {
        flowcell = run.chip.flowcells[0]
        chipId = 1
      })

      it('will create a flowcell and return a response', async () => {
        const request = { create: jest.fn() }
        request.create.mockResolvedValue(Data.CreateFlowcell)

        let mockResponse = new Response(Data.CreateFlowcell)
        let response = await Run.createResource(
          {
            data: {
              type: 'flowcells',
              attributes: {
                position: flowcell.position,
                library_id: flowcell.library.id,
                chip_id: chipId,
              },
            },
          },
          request,
        )
        expect(response).toEqual(mockResponse)
      })

      it('failure', async () => {
        const request = { create: jest.fn() }
        request.create.mockReturnValue(failedResponse)

        let message
        try {
          await Run.createResource(
            {
              data: {
                type: 'flowcells',
                attributes: {
                  position: flowcell.position,
                  library_id: flowcell.library.id,
                  chip_id: chipId,
                },
              },
            },
            request,
          )
        } catch (err) {
          message = err.message
        }
        expect(message).toEqual('title The record identified by 100 could not be found.')
      })
    })

    describe('create', () => {
      let api

      beforeEach(() => {
        api = build({ config: Api.Config, environment: process.env })
        api.traction.saphyr.runs.create = jest.fn()
        api.traction.saphyr.chips.create = jest.fn()
        api.traction.saphyr.flowcells.create = jest.fn()
        api.traction.saphyr.runs.destroy = jest.fn()
        api.traction.saphyr.chips.destroy = jest.fn()
      })

      it('returns true', async () => {
        api.traction.saphyr.runs.create.mockResolvedValue(Data.CreateRun)
        api.traction.saphyr.chips.create.mockResolvedValue(Data.CreateChip)
        api.traction.saphyr.flowcells.create.mockResolvedValue(Data.CreateFlowcell)
        expect(await Run.create(run, api.traction.saphyr)).toBeTruthy()
      })

      it('returns false if the run cannot be created', async () => {
        api.traction.saphyr.runs.create.mockReturnValue(failedResponse)
        expect(api.traction.saphyr.chips.create).not.toBeCalled()
        expect(api.traction.saphyr.flowcells.create).not.toBeCalled()
        expect(await Run.create(run, api.traction.saphyr)).toBeFalsy()
      })

      it('returns false and rollsback if the chip cannot be created', async () => {
        api.traction.saphyr.runs.create.mockReturnValue(Data.CreateRun)
        api.traction.saphyr.chips.create.mockResolvedValue(failedResponse)

        api.traction.saphyr.runs.destroy.mockResolvedValue(Data.SuccessfulDestroy)

        let runResponse = new Response(Data.CreateRun)
        let runId = runResponse.deserialize.runs[0].id

        let resp = await Run.create(run, api.traction.saphyr)

        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runId)
        expect(api.traction.saphyr.flowcells.create).not.toBeCalled()

        expect(resp).toBeFalsy()
      })

      it('returns false and rollsback if the flowcells cannot be created', async () => {
        api.traction.saphyr.runs.create.mockResolvedValue(Data.CreateRun)
        api.traction.saphyr.chips.create.mockResolvedValue(Data.CreateChip)
        api.traction.saphyr.flowcells.create.mockResolvedValue(failedResponse)

        api.traction.saphyr.chips.destroy.mockResolvedValue(Data.SuccessfulDestroy)
        api.traction.saphyr.runs.destroy.mockResolvedValue(Data.SuccessfulDestroy)

        let runResponse = new Response(Data.CreateRun)
        let runId = runResponse.deserialize.runs[0].id

        let chipResponse = new Response(Data.CreateChip)
        let chipId = chipResponse.deserialize.chips[0].id

        let resp = await Run.create(run, api.traction.saphyr)

        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runId)
        expect(api.traction.saphyr.chips.destroy).toBeCalledWith(chipId)

        expect(resp).toBeFalsy()
      })
    })

    describe('rollback', () => {
      let responses, api, runResponse, chipResponse

      beforeEach(() => {
        api = build({ config: Api.Config, environment: process.env })
        runResponse = new Response(Data.CreateRun)
        chipResponse = new Response(Data.CreateChip)
        responses = [runResponse, chipResponse]

        api.traction.saphyr.runs.destroy = jest.fn()
        api.traction.saphyr.chips.destroy = jest.fn()
      })

      it('gets a list of responses', () => {
        api.traction.saphyr.runs.destroy.mockResolvedValue(Data.SuccessfulDestroy)
        api.traction.saphyr.chips.destroy.mockResolvedValue(Data.SuccessfulDestroy)

        Run.rollback(responses, api.traction.saphyr)
        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runResponse.deserialize.runs[0].id)
        expect(api.traction.saphyr.chips.destroy).toBeCalledWith(
          chipResponse.deserialize.chips[0].id,
        )
      })
    })

    describe('destroy', () => {
      let api

      beforeEach(() => {
        api = build({ config: Api.Config, environment: process.env })
        api.traction.saphyr.runs.destroy = jest.fn()
      })

      it('rolls back the request', async () => {
        api.traction.saphyr.runs.destroy.mockResolvedValue(Data.SuccessfulDestroy)
        let expected = new Response(Data.SuccessfulDestroy)

        let runResponse = new Response(Data.CreateRun)
        let response = await Run.destroy(runResponse, api.traction.saphyr.runs)

        expect(response).toEqual(expected)
      })
    })
  })

  describe('updateResource', () => {
    let request, payload

    beforeEach(() => {
      let api = build({ config: Api.Config, environment: process.env })
      request = api.traction.saphyr
      request.update = jest.fn()

      payload = { data: { type: 'runs', attributes: { name: run.name } } }
    })

    it('successful', async () => {
      request.update.mockResolvedValue(Data.CreateRun)
      let mockResponse = new Response(Data.CreateRun)

      let response = await Run.updateResource(payload, request)
      expect(response).toEqual(mockResponse)
    })

    it('unsuccessful', async () => {
      let failedResponse = {
        status: 404,
        statusText: 'Record not found',
        data: { errors: { run: ['Failed to update.'] } },
      }

      request.update.mockReturnValue(failedResponse)
      let mockResponse = new Response(failedResponse)

      await expect(Run.updateResource(payload, request)).rejects.toEqual(mockResponse.errors)
    })
  })

  describe('#update', () => {
    let run, request

    beforeEach(() => {
      run = Run.build()
      run['name'] = 'run1'
      run.chip['barcode'] = chipBarcode
      run.chip.flowcells[0] = { position: 1, library: { baroce: 'TRAC-1' } }
      run.chip.flowcells[1] = { position: 2, library: { baroce: 'TRAC-2' } }

      let api = build({ config: Api.Config, environment: process.env })
      request = api.traction.saphyr

      request.runs.update = jest.fn()
      request.chips.update = jest.fn()
      request.flowcells.update = jest.fn()

      request.runs.destroy = jest.fn()
      request.chips.destroy = jest.fn()
      request.flowcells.destroy = jest.fn()
    })

    it('returns true', async () => {
      request.runs.update.mockResolvedValue(Data.CreateRun)
      request.chips.update.mockResolvedValue(Data.CreateChip)
      request.flowcells.update.mockResolvedValue(Data.CreateFlowcell)

      expect(await Run.update(run, request)).toBeTruthy()
    })

    it('returns false if the run cannot be created', async () => {
      request.runs.update.mockReturnValue(failedResponse)
      request.runs.destroy.mockReturnValue(Data.SuccessfulDestroy)

      expect(await Run.update(run, request)).toBeFalsy()
    })

    it('returns false and rollsback if the chip cannot be created', async () => {
      request.runs.update.mockResolvedValue(Data.CreateRun)
      request.chips.update.mockReturnValue(failedResponse)

      request.runs.destroy.mockReturnValue(Data.SuccessfulDestroy)
      request.chips.destroy.mockReturnValue(Data.SuccessfulDestroy)

      expect(await Run.update(run, request)).toBeFalsy()
    })

    it('returns false and rollsback if the flowcells cannot be created', async () => {
      request.runs.update.mockResolvedValue(Data.CreateRun)
      request.chips.update.mockResolvedValue(Data.CreateRun)
      request.flowcells.update.mockReturnValue(failedResponse)

      request.runs.destroy.mockReturnValue(Data.SuccessfulDestroy)
      request.chips.destroy.mockReturnValue(Data.SuccessfulDestroy)
      request.flowcells.destroy.mockReturnValue(Data.SuccessfulDestroy)

      expect(await Run.update(run, request)).toBeFalsy()
    })
  })
})
