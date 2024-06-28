import { usePacbioRunsStore } from '@/stores/pacbioRuns'
import { Data, createPinia, setActivePinia } from '@support/testHelper'
import { beforeEach, describe } from 'vitest'
import api from '@/api/JsonApi'
import { newResponse } from '@/api/v1/ResponseHelper'
import { extractAttributes } from '@/api/JsonApi'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'

const pacbioRunsFactory = PacbioRunFactory()

describe('usePacbioRunsStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('state', () => {
    it('should have an empty array on initial load', () => {
      const store = usePacbioRunsStore()
      expect(store.runs).toEqual([])
    })
  })
  describe('getters', () => {
    it('returns "runsArray" the given runs state', () => {
      const store = usePacbioRunsStore()
      const runs = pacbioRunsFactory.content.data
      store.runs = {
        runs: runs,
      }
      expect(store.runsArray).toEqual([runs])
    })
  })
  describe('actions', () => {
    describe('fetchPacbioRuns', () => {
      it('runs successfully', async () => {
        const store = usePacbioRunsStore()
        store.runs = []
        store.runRequest.get = vi.fn().mockReturnValue(pacbioRunsFactory.responses.axios)
        const data = pacbioRunsFactory.content.data
        api.dataToObjectById = vi.fn().mockReturnValue(data)
        const { success, errors } = await store.fetchPacbioRuns()
        expect(store.runsArray.length).toEqual(data.length)
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it('runs unsuccessfully', async () => {
        const store = usePacbioRunsStore()
        store.runs = []

        const failedResponse = {
          data: { data: { errors: { error1: ['There was an error'] } } },
          status: 500,
          statusText: 'Internal Server Error',
        }
        store.runRequest.get = vi.fn().mockRejectedValue({ response: failedResponse })
        const expectedResponse = newResponse({ ...failedResponse, success: false })
        const { success, errors } = await store.fetchPacbioRuns()

        expect(store.runs.length).toEqual(0)
        expect(success).toEqual(false)
        expect(errors).toEqual(expectedResponse.errors)
      })
    })
    describe('updateRun', () => {
      let updatedRun
      beforeEach(() => {
        updatedRun = Data.PacbioRun.data.data
      })
      it('runs successfully', async () => {
        const store = usePacbioRunsStore()
        store.runs = []
        store.runRequest.update = vi.fn().mockReturnValue(pacbioRunsFactory.responses.axios)
        const updatedRun = pacbioRunsFactory.content.data

        const { success, errors } = await store.updateRun({ ...updatedRun })
        expect(store.runs[updatedRun.id]).toEqual(extractAttributes(updatedRun))
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })
      it(' runs unsuccessfully', async () => {
        const store = usePacbioRunsStore()
        store.runs = []
        const failedResponse = {
          data: { data: { errors: { error1: ['There was an error'] } } },
          status: 500,
          statusText: 'Internal Server Error',
        }
        store.runRequest.update = vi.fn().mockRejectedValue({ response: failedResponse })
        const expectedResponse = newResponse({ ...failedResponse, success: false })

        const { success, errors } = await store.updateRun({ ...updatedRun })

        expect(store.runs.length).toEqual(0)
        expect(success).toEqual(false)
        expect(errors).toEqual(expectedResponse.errors)
      })
    })
  })
})
