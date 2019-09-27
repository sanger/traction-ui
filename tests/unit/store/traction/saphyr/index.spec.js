//TODO: fix loading issues
import Store from '@/store'

describe('index', () => {
  describe('state', () => {
    it('has a label template id', () => {
      expect(Store.state.traction.saphyr.labelTemplateId).toBeDefined()
    })
  })

  describe('getters', () => {
    it('labelTemplateId', () => {
      expect(Store.getters['traction/saphyr/labelTemplateId']).toBeDefined()
    })
  })
})
