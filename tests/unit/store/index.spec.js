import Store from '@/store/index'
import PlateMap from '@/config/PlateMap'

describe('index', () => {
  describe('state', () => {
    it('has api state', () => {
      expect(Store.state.api).toBeDefined()
    })

    it('has a list of printers', () => {
      expect(Store.state.printers).toBeDefined()
    })

    describe('api', () => {
      it('contains multiple resources', () => {
        expect(Store.state.api.traction).toBeDefined()
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

    it('printers', () => {
      expect(Store.getters.printers).toBeDefined()
    })

    it('PlateMap', () => {
      expect(Store.getters.plateMap).toEqual(PlateMap)
    })
  })
})
