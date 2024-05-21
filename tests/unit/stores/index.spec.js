import { createPinia, setActivePinia } from 'pinia'
import useRootStore from '@/stores'
import rootVuexStore from '@/store/index.js'
import PlateMap from '@/config/PlateMap.json'

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
    })

    describe('api', () => {
      it('contains multiple resources', () => {
        const store = useRootStore()
        expect(store.api.traction).toBeDefined()
        expect(store.api.printMyBarcode).toBeDefined()
      })
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
  })
})
