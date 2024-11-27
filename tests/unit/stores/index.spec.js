import { createPinia, setActivePinia } from 'pinia'
import useRootStore from '@/stores'
import rootVuexStore from '@/store/index.js'
import PlateMap from '@/config/PlateMap.json'
import { expect } from 'vitest'

describe('index', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  describe('state', () => {
    it('has api state', () => {
      const store = useRootStore()
      expect(store.api).toBeDefined()
      // TODO: Remove use of v1
      expect(store.api.v1).toBeDefined()
      expect(store.api.v2).toBeDefined()
    })

    it('has a plate map', () => {
      const store = useRootStore()
      const plateMap = store.plateMap
      expect(plateMap).toBeDefined()
      expect(plateMap.rows).toBeDefined()
      expect(plateMap.columns).toBeDefined()
      expect(plateMap.wells).toBeDefined()
      expect(store.plateMap).toEqual(PlateMap)
    })
  })

  describe('actions', () => {
    describe('addVuexMessage', () => {
      it('adds a message to the vuex root store', () => {
        const store = useRootStore()
        store.addVuexMessage({
          type: 'warning',
          message: 'foo',
        })
        expect(Object.values(rootVuexStore.state.traction.messages)).toEqual([
          { type: 'warning', message: 'foo' },
        ])
      })
    })

    describe('clearMessages', () => {
      it('clears all messages', () => {
        const store = useRootStore()
        store.messages = [
          { type: 'warning', message: 'foo' },
          { type: 'danger', message: 'bar' },
        ]
        store.clearMessages()
        expect(store.messages).toEqual({})
      })
    })

    describe('addMessage', () => {
      it('adds a message to the store', () => {
        const store = useRootStore()
        store.addMessage({
          type: 'warning',
          message: 'foo',
        })
        expect(Object.values(store.messages)).toEqual([{ type: 'warning', message: 'foo' }])
      })
    })

    describe('removeMessage', () => {
      it('removes a message from the store', () => {
        const store = useRootStore()
        store.messages = {
          1: { type: 'warning', message: 'foo' },
          2: { type: 'danger', message: 'bar' },
        }
        store.removeMessage(1)
        expect(store.messages).toEqual({
          2: { type: 'danger', message: 'bar' },
        })
      })
    })

    describe('fetchTagSets', () => {
      it('fetches pacbio tag sets by default', async () => {
        const store = useRootStore()
        store.api.v2.traction.pacbio.tag_sets.get = vi.fn().mockResolvedValue({
          status: '200',
          statusText: 'OK',
          json: () =>
            Promise.resolve({ data: [{ id: 1, attributes: { name: 'foo' }, type: 'tag_set' }] }),
          ok: true,
        })
        await store.fetchTagSets()
        expect(store.tagSets).toEqual({ 1: { id: 1, name: 'foo', type: 'tag_set' } })
      })

      it('fetches ont tag sets when called with ont', async () => {
        const store = useRootStore()
        store.api.v2.traction.ont.tag_sets.get = vi.fn().mockResolvedValue({
          status: '200',
          statusText: 'OK',
          json: () =>
            Promise.resolve({ data: [{ id: 1, attributes: { name: 'foo' }, type: 'tag_set' }] }),
          ok: true,
        })
        await store.fetchTagSets('ont')
        expect(store.tagSets).toEqual({ 1: { id: 1, name: 'foo', type: 'tag_set' } })
      })

      it('returns an error if an invalid pipeline is passed', async () => {
        const store = useRootStore()
        const result = await store.fetchTagSets('foo')
        expect(result).toEqual({
          success: false,
          errors: ['Tag sets cannot be retrieved for pipeline foo'],
        })
      })
    })
  })
})
