import Store from '@/store/index'

describe('index', () => {

  describe('state', () => {
    it('has state', () => {
      expect(Store.state.api).toBeDefined()
    })

    describe('api', () => {
      it('contains multiple resources', () => {
        expect(Store.state.api.sequencescape).toBeDefined()
        expect(Store.state.api.traction).toBeDefined()
      })
    })
  })

  describe('getters', () => {
    it('api', () => {
      expect(Store.getters.api).toBeDefined()
    })
  })

})
