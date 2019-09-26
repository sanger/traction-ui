import Store from '@/store/traction/pacbio/index'

describe('index', () => {
  describe('state', () => {
    it('has a label template id', () => {
      expect(Store.state.labelTemplateId).toBeDefined()
    })
  })

  describe('getters', () => {
    it('labelTemplateId', () => {
      expect(Store.getters.labelTemplateId).toBeDefined()
    })
  })
})
