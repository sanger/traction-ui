import Store from '@/store/traction/index'

describe('index', () => {
  it('has state', () => {
    expect(Store.state).toBeDefined()
  })
  it('has getters', () => {
    expect(Store.getters).toBeDefined()
  })
  it('has mutations', () => {
    expect(Store.mutations).toBeDefined()
  })
  it('has actions', () => {
    expect(Store.actions).toBeDefined()
  })
  it('has saphyr modules', () => {
    expect(Store.modules.saphyr).toBeDefined()
  })
  it('has pacbio modules', () => {
    expect(Store.modules.pacbio).toBeDefined()
  })
  it('has ont modules', () => {
    expect(Store.modules.ont).toBeDefined()
  })
})
