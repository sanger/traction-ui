import Store from '@/store/index'
import PlateMap from '@/config/PlateMap'

describe('index', () => {
  describe('getters', () => {
    it('api', () => {
      expect(Store.getters.api).toBeDefined()
    })

    it('PlateMap', () => {
      expect(Store.getters.plateMap).toEqual(PlateMap)
    })
  })
})
