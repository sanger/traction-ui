import * as Run from '@/api/SaphyrRun.js'
import build from '@/api/ApiBuilder.js'
import config from '@/api/Config.js'
import { handleResponse } from '@/api/ResponseHelper.js'

describe('Run', () => {
  let failedResponse, chipBarcode, run

  const CreatedRunResponse = {
    status: '200',
    statusText: 'OK',
    json: () =>
      Promise.resolve({
        data: {
          id: '1',
          type: 'runs',
          attributes: {
            name: 'run1',
          },
        },
      }),
    ok: true,
  }
  const CreatedFlowcellResponse = {
    status: '200',
    statusText: 'OK',
    json: () =>
      Promise.resolve({
        data: {
          id: '1',
          type: 'flowcells',
          attributes: {
            chip_id: 1,
            library_id: 1,
            position: 1,
          },
        },
      }),
    ok: true,
  }

  const CreatedChipResponse = {
    status: '200',
    statusText: 'OK',
    json: () =>
      Promise.resolve({
        data: { id: '1', type: 'chips', attributes: { barcode: 'barcodebarcodebarcode' } },
      }),
    ok: true,
  }

  const SuccessfulDestroyResponse = {
    status: '200',
    statusText: 'OK',
    json: () =>
      Promise.resolve({
        data: {},
      }),
    ok: true,
  }

  beforeEach(() => {
    failedResponse = {
      status: 404,
      statusText: 'Record not found',
      json: () =>
        Promise.resolve({
          errors: { title: ['The record identified by 100 could not be found.'] },
        }),
      ok: false,
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
        const flowcells = run.chip.flowcells
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
        const request = { create: vi.fn() }
        request.create.mockResolvedValue(CreatedRunResponse)

        const mockResponse = await handleResponse(CreatedRunResponse)
        const response = await Run.createResource(
          { data: { type: 'runs', attributes: { name: run.name } } },
          request,
        )

        expect(response).toEqual(mockResponse)
      })

      it('failure', async () => {
        const request = { create: vi.fn() }
        request.create.mockResolvedValue(failedResponse)
        let message
        try {
          await Run.createResource(
            { data: { type: 'runs', attributes: { name: run.name } } },
            request,
          )
        } catch (err) {
          message = err
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
        const request = { create: vi.fn() }
        request.create.mockResolvedValue(CreatedChipResponse)

        const mockResponse = await handleResponse(CreatedChipResponse)
        const response = await Run.createResource(
          { data: { type: 'chips', attributes: { barcode: run.chip.barcode, run_id: runId } } },
          request,
        )
        expect(response).toEqual(mockResponse)
      })

      it('failure', async () => {
        const request = { create: vi.fn() }
        request.create.mockReturnValue(failedResponse)

        let message
        try {
          await Run.createResource(
            { data: { type: 'chips', attributes: { barcode: run.chip.barcode, run_id: runId } } },
            request,
          )
        } catch (err) {
          message = err
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
        const request = { create: vi.fn() }
        request.create.mockResolvedValue(CreatedFlowcellResponse)

        const mockResponse = await handleResponse(CreatedFlowcellResponse)
        const response = await Run.createResource(
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
        const request = { create: vi.fn() }
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
          message = err
        }
        expect(message).toEqual('title The record identified by 100 could not be found.')
      })
    })

    describe('create', () => {
      let api

      beforeEach(() => {
        api = build({ config })
        api.traction.saphyr.runs.create = vi.fn()
        api.traction.saphyr.chips.create = vi.fn()
        api.traction.saphyr.flowcells.create = vi.fn()
        api.traction.saphyr.runs.destroy = vi.fn()
        api.traction.saphyr.chips.destroy = vi.fn()
      })

      it('returns true', async () => {
        api.traction.saphyr.runs.create.mockResolvedValue(CreatedRunResponse)
        api.traction.saphyr.chips.create.mockResolvedValue(CreatedChipResponse)
        api.traction.saphyr.flowcells.create.mockResolvedValue(CreatedFlowcellResponse)
        expect(await Run.create(run, api.traction.saphyr)).toBeTruthy()
      })

      it('returns false if the run cannot be created', async () => {
        api.traction.saphyr.runs.create.mockReturnValue(failedResponse)
        expect(api.traction.saphyr.chips.create).not.toBeCalled()
        expect(api.traction.saphyr.flowcells.create).not.toBeCalled()
        expect(await Run.create(run, api.traction.saphyr)).toBeFalsy()
      })

      it('returns false and rollsback if the chip cannot be created', async () => {
        api.traction.saphyr.runs.create.mockResolvedValue(CreatedRunResponse)
        api.traction.saphyr.chips.create.mockResolvedValue(failedResponse)

        api.traction.saphyr.runs.destroy.mockResolvedValue(SuccessfulDestroyResponse)

        const runResponse = await handleResponse(CreatedRunResponse)
        const runId = runResponse.body.data.id

        const resp = await Run.create(run, api.traction.saphyr)

        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runId)
        expect(api.traction.saphyr.flowcells.create).not.toBeCalled()

        expect(resp).toBeFalsy()
      })

      it('returns false and rollsback if the flowcells cannot be created', async () => {
        api.traction.saphyr.runs.create.mockResolvedValue(CreatedRunResponse)
        api.traction.saphyr.chips.create.mockResolvedValue(CreatedChipResponse)
        api.traction.saphyr.flowcells.create.mockResolvedValue(failedResponse)

        api.traction.saphyr.chips.destroy.mockResolvedValue(SuccessfulDestroyResponse)
        api.traction.saphyr.runs.destroy.mockResolvedValue(SuccessfulDestroyResponse)

        const runResponse = await handleResponse(CreatedRunResponse)
        const runId = runResponse.body.data.id

        const chipResponse = await handleResponse(CreatedChipResponse)
        const chipId = chipResponse.body.data.id

        const resp = await Run.create(run, api.traction.saphyr)

        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runId)
        expect(api.traction.saphyr.chips.destroy).toBeCalledWith(chipId)

        expect(resp).toBeFalsy()
      })
    })

    describe('rollback', () => {
      let responses, api, runResponse, chipResponse

      beforeEach(async () => {
        api = build({ config })
        runResponse = await handleResponse(CreatedRunResponse)
        chipResponse = await handleResponse(CreatedChipResponse)
        responses = [runResponse, chipResponse]

        api.traction.saphyr.runs.destroy = vi.fn()
        api.traction.saphyr.chips.destroy = vi.fn()
      })

      it('gets a list of responses', () => {
        api.traction.saphyr.runs.destroy.mockResolvedValue(SuccessfulDestroyResponse)
        api.traction.saphyr.chips.destroy.mockResolvedValue(SuccessfulDestroyResponse)

        Run.rollback(responses, api.traction.saphyr)
        expect(api.traction.saphyr.runs.destroy).toBeCalledWith(runResponse.body.data.id)
        expect(api.traction.saphyr.chips.destroy).toBeCalledWith(chipResponse.body.data.id)
      })
    })

    describe('destroy', () => {
      let api

      beforeEach(() => {
        api = build({ config })
        api.traction.saphyr.runs.destroy = vi.fn()
      })

      it('rolls back the request', async () => {
        api.traction.saphyr.runs.destroy.mockResolvedValue(SuccessfulDestroyResponse)
        const expected = await handleResponse(SuccessfulDestroyResponse)

        const runResponse = await handleResponse(CreatedRunResponse)
        const response = await Run.destroy(runResponse, api.traction.saphyr.runs)

        expect(response).toEqual(expected)
      })
    })
  })

  describe('updateResource', () => {
    let request, payload

    beforeEach(() => {
      const api = build({ config })
      request = api.traction.saphyr
      request.update = vi.fn()

      payload = { data: { type: 'runs', attributes: { name: run.name } } }
    })

    it('successful', async () => {
      request.update.mockResolvedValue(CreatedRunResponse)
      const mockResponse = await handleResponse(CreatedRunResponse)

      const response = await Run.updateResource(payload, request)
      expect(response).toEqual(mockResponse)
    })

    it('unsuccessful', async () => {
      failedResponse = {
        status: 404,
        statusText: 'Record not found',
        json: () =>
          Promise.resolve({
            errors: { run: ['Failed to update.'] },
          }),
        ok: false,
      }

      request.update.mockReturnValue(failedResponse)
      const mockResponse = await handleResponse(failedResponse)

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

      const api = build({ config })
      request = api.traction.saphyr

      request.runs.update = vi.fn()
      request.chips.update = vi.fn()
      request.flowcells.update = vi.fn()

      request.runs.destroy = vi.fn()
      request.chips.destroy = vi.fn()
      request.flowcells.destroy = vi.fn()
    })

    it('returns true', async () => {
      request.runs.update.mockResolvedValue(CreatedRunResponse)
      request.chips.update.mockResolvedValue(CreatedChipResponse)
      request.flowcells.update.mockResolvedValue(CreatedFlowcellResponse)

      expect(await Run.update(run, request)).toBeTruthy()
    })

    it('returns false if the run cannot be created', async () => {
      request.runs.update.mockReturnValue(failedResponse)
      request.runs.destroy.mockReturnValue(SuccessfulDestroyResponse)

      expect(await Run.update(run, request)).toBeFalsy()
    })

    it('returns false and rollsback if the chip cannot be created', async () => {
      request.runs.update.mockResolvedValue(CreatedRunResponse)
      request.chips.update.mockReturnValue(failedResponse)

      request.runs.destroy.mockReturnValue(SuccessfulDestroyResponse)
      request.chips.destroy.mockReturnValue(SuccessfulDestroyResponse)

      expect(await Run.update(run, request)).toBeFalsy()
    })

    it('returns false and rollsback if the flowcells cannot be created', async () => {
      request.runs.update.mockResolvedValue(CreatedRunResponse)
      request.chips.update.mockResolvedValue(CreatedRunResponse)
      request.flowcells.update.mockReturnValue(failedResponse)

      request.runs.destroy.mockReturnValue(SuccessfulDestroyResponse)
      request.chips.destroy.mockReturnValue(SuccessfulDestroyResponse)
      request.flowcells.destroy.mockReturnValue(SuccessfulDestroyResponse)

      expect(await Run.update(run, request)).toBeFalsy()
    })
  })
})
