import { usePacbioRunsStore } from '@/stores/pacbioRuns.js'
import {
  createPinia,
  setActivePinia,
  failedResponse,
  successfulResponse,
} from '@support/testHelper.js'
import { beforeEach, describe } from 'vitest'
import { extractAttributes } from '@/api/JsonApi.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'
import useRootStore from '@/stores'

const pacbioRunsFactory = PacbioRunFactory()

describe('usePacbioRunsStore', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('actions', () => {
    let rootStore, store

    beforeEach(() => {
      rootStore = useRootStore()
      store = usePacbioRunsStore()
      store.$state.runs = []
    })

    describe('fetchPacbioRuns', () => {
      let get

      beforeEach(() => {
        get = vi.fn()
        rootStore.api.traction.pacbio.runs.get = get
      })

      it('runs successfully', async () => {
        get.mockResolvedValue(pacbioRunsFactory.responses.fetch)
        const { success, errors } = await store.fetchPacbioRuns()
        expect(store.runsArray.length).toEqual(pacbioRunsFactory.content.data.length)
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it('runs unsuccessfully', async () => {
        const failureResponse = failedResponse()
        get.mockResolvedValue(failureResponse)
        const { success, errors } = await store.fetchPacbioRuns()
        expect(store.runs.length).toEqual(0)
        expect(success).toEqual(false)
        expect(errors).toEqual(failureResponse.errorSummary)
      })
    })

    describe('updateRun', () => {
      let updatedRun, update
      beforeEach(() => {
        update = vi.fn()
        rootStore.api.traction.pacbio.runs.update = update
        updatedRun = pacbioRunsFactory.content.data
      })

      it('runs successfully', async () => {
        update.mockResolvedValue(successfulResponse())
        const updatedRun = pacbioRunsFactory.content.data
        const { success, errors } = await store.updateRun({ ...updatedRun })
        expect(store.runs[updatedRun.id]).toEqual(extractAttributes(updatedRun))
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it(' runs unsuccessfully', async () => {
        const failureResponse = failedResponse()
        update.mockResolvedValue(failureResponse)
        const { success, errors } = await store.updateRun({ ...updatedRun })
        expect(store.runs.length).toEqual(0)
        expect(success).toEqual(false)
        expect(errors).toEqual(failureResponse.errorSummary)
      })
    })
  })
})
