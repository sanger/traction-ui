import Store from '@/store/index'

describe('index', () => {

  describe('state', () => {
    it('has state', () => {
      expect(Store.state).toHaveProperty('traction')
      expect(Store.state).toHaveProperty('sequencescape')
    })

    describe('traction', () => {
      it('has traction resources', () => {
        expect(Store.state.traction.samples).toBeDefined()
        expect(Store.state.traction.libraries).toBeDefined()
        expect(Store.state.traction.enzymes).toBeDefined()
        expect(Store.state.traction.runs).toBeDefined()
        expect(Store.state.traction.chips).toBeDefined()
        expect(Store.state.traction.flowcells).toBeDefined()
        expect(Store.state.traction.tubes).toBeDefined()
      })
    })

    describe('sequencescape', () => {
      it('sequencescape resources', () => {
        expect(Store.state.sequencescape.tubes).toBeDefined()
      })
    })
  })

  describe('getters', () => {
    it('sequencescape', () => {
      expect(Store.getters.sequencescape).toEqual(Store.state.sequencescape)
    })

    it('traction', () => {
      expect(Store.getters.traction).toEqual(Store.state.traction)
    })
  })

})
