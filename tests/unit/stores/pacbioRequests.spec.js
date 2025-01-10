import { createPinia, setActivePinia } from '@support/testHelper.js'
import PacbioRequestFactory from '@tests/factories/PacbioRequestFactory.js'
import usePacbioRequestsStore from '@/stores/pacbioRequests.js'
import { describe, expect } from 'vitest'
import useRootStore from '@/stores'

const pacbioRequestFactory = PacbioRequestFactory({ includeRelationships: false })

describe('pacbioRequests', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
        up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('getters', () => {
    it('"requests" returns "state.requests"', () => {
      const pacbioRequestsStore = usePacbioRequestsStore()
      pacbioRequestsStore.$state = { requests: pacbioRequestFactory.storeData.requests }
      expect(pacbioRequestsStore.requestsArray).toEqual(
        pacbioRequestFactory.storeData.requestsArray,
      )
    })
  })

  describe('actions', () => {
    let store
    beforeEach(() => {
      store = usePacbioRequestsStore()
    })
    describe('setRequests', () => {
      it('fetches the requets from the service, and sets the state', async () => {
        const rootStore = useRootStore()
        rootStore.api.traction.pacbio.requests.get = vi
          .fn()
          .mockResolvedValue(pacbioRequestFactory.responses.fetch)
        const { success } = await store.setRequests()
        expect(success).toEqual(true)
        expect(store.requests).toEqual(pacbioRequestFactory.storeData.requests)
      })
      it('returns success false if request fails', async () => {
        const rootStore = useRootStore()
        rootStore.api.traction.pacbio.requests.get = vi.fn().mockResolvedValue({ success: false })
        const { success } = await store.setRequests()
        expect(success).toEqual(false)
      })
    })
  })
})
