import { createPinia, setActivePinia } from 'pinia'
import useRootStore from '@/stores'
import PlateMap from '@/config/PlateMap'
import PrinterList from '@/config/PrinterList'

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

    it('has a list of printers', () => {
      const store = useRootStore()
      expect(store.printers).toBeDefined()
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

  describe('getters', () => {
    it('has printerNmaes', () => {
      const store = useRootStore()
      expect(store.printerNames).toBeDefined()
      expect(store.printerNames).toEqual(PrinterList.map((obj) => obj.printerName))
    })
  })
})
