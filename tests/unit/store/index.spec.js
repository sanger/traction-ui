import Store from '@/store/index'
import PlateMap from '@/config/PlateMap'

describe('index', () => {
  describe('state', () => {
    it('has api state', () => {
      expect(Store.state.api).toBeDefined()
    })

    describe('api', () => {
      it('contains multiple resources', () => {
        expect(Store.state.api.traction).toBeDefined()
        expect(Store.state.api.printMyBarcode).toBeDefined()
      })
    })

    it('has a plate map', () => {
      const plateMap = Store.state.plateMap
      expect(plateMap).toBeDefined()
      expect(plateMap.rows).toBeDefined()
      expect(plateMap.columns).toBeDefined()
      expect(plateMap.wells).toBeDefined()
    })
  })

  describe('getters', () => {
    it('api', () => {
      expect(Store.getters.api).toBeDefined()
    })

    it('PlateMap', () => {
      expect(Store.getters.plateMap).toEqual(PlateMap)
    })
  })
})
