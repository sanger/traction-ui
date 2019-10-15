import Store from '@/store'

describe('index', () => {
  describe('state', () => {
    it('has a label template id', () => {
      expect(Store.state.traction.pacbio.labelTemplateId).toBeDefined()
    })
  })

  describe('getters', () => {
    it('labelTemplateId', () => {
      expect(Store.getters['traction/pacbio/labelTemplateId']).toBeDefined()
    })
  })
})
