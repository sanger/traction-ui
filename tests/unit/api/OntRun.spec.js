import { Data } from '@support/testHelper'
import Response from '@/api/Response'
import * as Run from '@/api/OntRun'
import build from '@/api/ApiBuilder'
import Api from '@/api'
import { describe, expect, it } from 'vitest'

describe('OntRun', () => {
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

      it('will have an instrument_name', () => {
        expect(run.instrument_name).toBeDefined()
      })

      it('will have an state', () => {
        expect(run.state).toBeDefined()
      })
    })
  })

  describe('create', () => {
    let api, runRequest

    //  add well library
    beforeEach(() => {
      run = Run.build()
      run['instrument_name'] = 'gridion'
      run['state'] = 'pending'

      api = build({ config: Api.Config, environment: import.meta.env })
      runRequest = api.traction.ont.runs
      runRequest.create = vi.fn()
      runRequest.destroy = vi.fn()
    })

    it('returns true', async () => {
      runRequest.create.mockResolvedValue(Data.OntRun)

      let resp = await Run.create(run, runRequest)

      expect(runRequest.create).toBeCalled()
      expect(resp).toEqual([])
    })

    it('returns false if the run cannot be created', async () => {
      runRequest.create.mockReturnValue(failedResponse)

      // let promise = new Promise((resolve) => {
      //   resolve(Data.SuccessfulDestroy)
      // })
      // pacbioRequest.runs.destroy.mockReturnValue([promise])

      let resp = await Run.create(run, runRequest)

      expect(runRequest.create).toBeCalled()

      expect(resp).toEqual('title The record identified by 100 could not be found.')
    })

    describe('createResource', () => {
      it('success', async () => {
        const request = { create: vi.fn() }
        request.create.mockResolvedValue(Data.OntRun)
        let mockResponse = new Response(Data.OntRun)

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
        run = new Response(Data.OntRun).deserialize.runs[0]
      })

      it('returns a runs payload', async () => {
        let result = Run.createRunPayload(run)

        expect(result.data.type).toEqual('runs')
        expect(result.data.attributes.ont_instrument_id).toEqual(1)
        expect(result.data.attributes.state).toEqual(run.state)
        expect(result.data.attributes.flowcell_attributes).toEqual([])
      })
    })
  })
})
