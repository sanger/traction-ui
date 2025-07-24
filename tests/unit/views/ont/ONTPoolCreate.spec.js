import ONTPoolCreate from '@/views/ont/ONTPoolCreate.vue'
import { mountWithStore, router, flushPromises } from '@support/testHelper'
import { expect } from 'vitest'
import OntTagSetFactory from '@tests/factories/OntTagSetFactory.js'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const ontTagSetFactory = OntTagSetFactory()
const singleOntPoolFactory = OntPoolFactory({ count: 1 })

const tagSetGetMock = vi.fn(() => ontTagSetFactory.responses.fetch)
const poolFindMock = vi.fn(() => singleOntPoolFactory.responses.fetch)
const mountComponent = () => {
  const plugins = [
    ({ store }) => {
      if (store.$id === 'root') {
        store.api.traction.ont.tag_sets.get = tagSetGetMock
        store.api.traction.ont.pools.find = poolFindMock
      }
    },
  ]
  const { wrapper, store } = mountWithStore(ONTPoolCreate, {
    plugins,
    createStore: () => useOntPoolCreateStore(),
  })
  return { wrapper, store }
}
describe('OntPoolCreate', () => {
  it('will fetch all of the data', async () => {
    await router.push({ name: 'ONTPoolCreate', params: { id: 'new' } })
    const { store } = mountComponent()

    await flushPromises()

    expect(Object.keys(store.resources.tagSets).length).toBeGreaterThan(0)
    expect(poolFindMock).not.toBeCalled()
  })

  it('will fetch existing pools', async () => {
    await router.push({
      name: 'ONTPoolCreate',
      params: { id: singleOntPoolFactory.content.data.id },
    })
    const { store } = mountComponent()

    await flushPromises()

    expect(Object.keys(store.resources.plates).length).toBeGreaterThan(0)
    expect(Object.keys(store.resources.tagSets).length).toBeGreaterThan(0)
    expect(Object.keys(store.resources.wells).length).toBeGreaterThan(0)
    expect(Object.keys(store.resources.requests).length).toBeGreaterThan(0)
    expect(Object.keys(store.resources.tags).length).toBeGreaterThan(0)
    expect(Object.keys(store.pooling.pool).length).toBeGreaterThan(0)
    expect(Object.keys(store.pooling.tube).length).toBeGreaterThan(0)
    expect(Object.keys(store.pooling.libraries).length).toBeGreaterThan(0)
  })
})
