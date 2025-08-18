import { useOntRequestsStore } from '@/stores/ontRequests.js'
import useRootStore from '@/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'
import { failedResponse, successfulResponse } from '@tests/support/testHelper.js'
import { createRequestPayload } from '@/stores/utilities/ontRequests.js'

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

    describe('updateRequest', () => {
      let update, existingRequest, updatedRequest

      beforeEach(() => {
        store.resources.requests = ontRequestFactory.storeData
        update = vi.fn()
        existingRequest = Object.values(ontRequestFactory.storeData)[0]
        updatedRequest = { ...existingRequest, cost_code: 'new_cost_code' }
      })

      it('updates an ONT request successfully', async () => {
        const payload = createRequestPayload(updatedRequest)
        update.mockResolvedValue(
          successfulResponse({ data: { attributes: { ...updatedRequest } } }),
        )
        rootStore.api = { traction: { ont: { requests: { update } } } }

        const { success } = await store.updateRequest(updatedRequest)
        expect(success).toBeTruthy()
        expect(update).toHaveBeenCalledWith(payload)
        expect(store.resources.requests[existingRequest.id]).toEqual(updatedRequest)
      })

      it('handles failure when updating an ONT request', async () => {
        update.mockResolvedValue(failedResponse())

        rootStore.api = { traction: { ont: { requests: { update } } } }

        const { success, errors } = await store.updateRequest(updatedRequest)

        expect(success).toBeFalsy()
        expect(errors).toBeDefined()
        expect(store.resources.requests[existingRequest.id]).toEqual(existingRequest)
      })
    })
  })
})
