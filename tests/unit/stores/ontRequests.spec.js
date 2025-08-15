import { useOntRequestsStore } from '@/stores/ontRequests.js'
import useRootStore from '@/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'
import { failedResponse, successfulResponse } from '@tests/support/testHelper.js'

const ontRequestFactory = OntRequestFactory()

describe('useOntRequestsStore', () => {
  let store

  beforeEach(() => {
    store = useOntRequestsStore()
  })

  describe('actions', () => {
    let rootStore

    beforeEach(() => {
      rootStore = useRootStore()
    })

    describe('fetchOntRequests', () => {
      let get

      beforeEach(() => {
        get = vi.fn()
        rootStore.api = { traction: { ont: { requests: { get } } } }
      })

      it('handles success', async () => {
        get.mockResolvedValue(ontRequestFactory.responses.fetch)
        const { success } = await store.fetchRequests()
        expect(store.resources.requests).toEqual(ontRequestFactory.storeData)
        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        get.mockResolvedValue(failedResponse())
        const { success } = await store.fetchRequests()
        expect(store.resources.requests).toEqual({})
        expect(success).toEqual(false)
      })
    })

    describe.skip('updateRequest', () => {
      it('updates an ONT request successfully', async () => {
        const update = vi.fn()
        const existingRequest = Object.values(ontRequestFactory.storeData)[0]
        const updatedRequest = { ...existingRequest, cost_code: 'new_cost_code' }

        update.mockResolvedValue(successfulResponse({ data: updatedRequest }))
        rootStore.api.traction.pacbio.runs.update = update
        rootStore.api = { traction: { ont: { requests: { update } } } }

        const { success } = await store.updateRequest({ data: updatedRequest })
        expect(success).toBeTruthy()
        expect(store.resources.requests[existingRequest.id]).toEqual(updatedRequest)
      })

      it('handles failure when updating an ONT request', async () => {
        const update = vi.fn()
        update.mockResolvedValue(failedResponse())

        rootStore.api = { traction: { ont: { requests: { update } } } }

        const { success, errors } = await store.updateRequest({ id: 1, name: 'Fail Request' })

        expect(success).toBeFalsy()
        expect(errors).toBeDefined()
      })
    })
  })
})
