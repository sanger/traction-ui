import Store from '@/store/index'
import * as Run from '@/api/Run'

describe('index', () => {

  describe('state', () => {
    it('has api state', () => {
      expect(Store.state.api).toBeDefined()
    })

    it('has a list of printers', () => {
      expect(Store.state.printers).toBeDefined()
    })

    it('has a label template id', () => {
      expect(Store.state.labelTemplateId).toBeDefined()
    })

    describe('api', () => {
      it('contains multiple resources', () => {
        expect(Store.state.api.sequencescape).toBeDefined()
        expect(Store.state.api.traction).toBeDefined()
        expect(Store.state.api.printMyBarcode).toBeDefined()
      })
    })
  })

  describe('getters', () => {
    it('api', () => {
      expect(Store.getters.api).toBeDefined()
    })

    it('printers', () => {
      expect(Store.getters.printers).toBeDefined()
    })

    it('labelTemplateId', () => {
      expect(Store.getters.labelTemplateId).toBeDefined()
    })

  })

  describe('runs', () => {

    let run1, run2

    beforeEach(() => {
      run1 = Run.build()
      run1.id = '1'

      run2 = Run.build()
      run2.id = '2'
    })

    afterEach(() => {
      Store.commit('clearRuns')
    })

    it('has a getter', () => {
      expect(Store.getters.runs).toBeDefined()
    })

    it('can add an individual run', () => {
      Store.commit('addRun', run1)
      Store.commit('addRun', run2)
      expect(Object.keys(Store.getters.runs).length).toEqual(2)
    })

    it('can add multiple runs', () => {
      Store.commit('addRuns', [run1, run2])
      expect(Object.keys(Store.getters.runs).length).toEqual(2)
    })

  })

})
