import { usePacbioRunsStore } from '@/stores/pacbioRuns'
import {
  createPinia,
  setActivePinia,
  failedResponse,
  successfulResponse,
} from '@support/testHelper'
import { beforeEach, describe } from 'vitest'
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
        store.runRequest.get = vi.fn().mockReturnValue(pacbioRunsFactory.responses.fetch)
        const data = pacbioRunsFactory.content.data
        const { success, errors } = await store.fetchPacbioRuns()
        expect(store.runsArray.length).toEqual(data.length)
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it('runs unsuccessfully', async () => {
        const store = usePacbioRunsStore()
        store.runs = []

        const failureResponse = failedResponse()

        // fetch does not reject the promise.
        store.runRequest.get = vi.fn().mockResolvedValue(failureResponse)
        const { success, errors } = await store.fetchPacbioRuns()

        expect(store.runs.length).toEqual(0)
        expect(success).toEqual(false)
        expect(errors).toEqual(failureResponse.errorSummary)
      })
    })
    describe('updateRun', () => {
      let updatedRun
      beforeEach(() => {
        updatedRun = pacbioRunsFactory.content.data
      })
      it('runs successfully', async () => {
        const store = usePacbioRunsStore()
        store.runs = []
        store.runRequest.update = vi.fn().mockReturnValue(successfulResponse())
        const updatedRun = pacbioRunsFactory.content.data

        const { success, errors } = await store.updateRun({ ...updatedRun })
        expect(store.runs[updatedRun.id]).toEqual(extractAttributes(updatedRun))
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })
      it(' runs unsuccessfully', async () => {
        const store = usePacbioRunsStore()
        const failureResponse = failedResponse()
        store.runs = []
        // const failedResponse = {
        store.runRequest.update = vi.fn().mockResolvedValue(failureResponse)

        const { success, errors } = await store.updateRun({ ...updatedRun })

        expect(store.runs.length).toEqual(0)
        expect(success).toEqual(false)
        expect(errors).toEqual(failureResponse.errorSummary)
      })
    })
  })
})
