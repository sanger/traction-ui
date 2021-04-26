import Store from '@/store'

describe('index', () => {
  describe('state', () => {
    it('has a label template id', () => {
      expect(Store.state.traction.ont.labelTemplateId).toBeDefined()
    })
  })

  describe('getters', () => {
    it('labelTemplateId', () => {
      expect(Store.getters['traction/ont/labelTemplateId']).toBeDefined()
    })
  })
})
