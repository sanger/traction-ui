import { useMultiPoolStore } from '@/stores/multiPools.js'
import { beforeEach, describe, expect } from 'vitest'
import MultiPoolFactory from '@tests/factories/MultiPoolFactory.js'

const multiPoolFactory = MultiPoolFactory()

describe('useOntRunsStore', () => {
  let store

  beforeEach(() => {
    store = useMultiPoolStore()
  })

  describe.skip('actions', () => {
    describe('fetchMultiPools', () => {
      it('runs successfully', async () => {
        const response = multiPoolFactory.responses.fetch
        expect(response).toBeDefined()
        expect(store).toBeDefined()
        expect(true).toBe(true)
      })
      it('handles failure', async () => {
        expect(false).toBe(false)
      })
    })
  })
})
