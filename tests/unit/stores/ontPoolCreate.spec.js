import {
  createPinia,
  setActivePinia,
  // successfulResponse,
  // failedResponse,
} from '@support/testHelper.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
// import { useOntRootStore } from '@/stores/ontRoot.js'
// import useRootStore from '@/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'

const ontRequestFactory = OntRequestFactory()

vi.mock('@/api/FeatureFlag', () => ({
  checkFeatureFlag: vi.fn().mockReturnValue(true),
}))

describe('useOntPoolCreateStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('getters', () => {
    let store

    beforeEach(() => {
      store = useOntPoolCreateStore()
    })

    it('return the requests', () => {
      store.resources.requests = ontRequestFactory.storeData
      expect(store.requests).toEqual(Object.values(ontRequestFactory.storeData))
    })
  })
})
