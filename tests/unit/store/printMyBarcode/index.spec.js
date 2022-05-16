import Store from '@/store/printMyBarcode/index'

describe('index', () => {
  it('has state', () => {
    expect(Store.state).toBeDefined()
  })
  it('has getters', () => {
    expect(Store.getters).toBeDefined()
  })
  it('has actions', () => {
    expect(Store.actions).toBeDefined()
  })
})
