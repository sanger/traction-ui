import ONTPoolCreate from '@/views/ont/ONTPoolCreate.vue'
import { mount, localVue, store, Data, router, flushPromises } from '@support/testHelper'
import { expect } from 'vitest'

describe('OntPoolCreate', () => {
  it('will fetch all of the data', async () => {
    const {
      state: {
        api: {
          traction: {
            ont: { tag_sets: tagSetsRequest, pools: poolsRequest },
          },
        },
      },
    } = store

    tagSetsRequest.get = vi.fn(() => Data.TractionOntTagSets)
    poolsRequest.find = vi.fn()

    router.push({ name: 'ONTPoolCreate', params: { id: 'new' } })

    mount(ONTPoolCreate, {
      localVue,
      store,
      router,
    })

    await flushPromises()

    const {
      state: {
        traction: {
          ont: {
            pools: {
              resources: { tagSets },
            },
          },
        },
      },
    } = store

    expect(Object.keys(tagSets).length).toBeGreaterThan(0)
    expect(poolsRequest.find).not.toBeCalled()
  })

  it('will fetch existing pools', async () => {
    const {
      state: {
        api: {
          traction: {
            ont: { tag_sets: tagSetsRequest, pools: poolsRequest },
          },
        },
      },
    } = store

    tagSetsRequest.get = vi.fn(() => Data.TractionOntTagSets)
    poolsRequest.find = vi.fn(() => Data.TractionOntPool)

    router.push({ name: 'ONTPoolCreate', params: { id: 3 } })
    mount(ONTPoolCreate, {
      localVue,
      store,
      router,
    })

    await flushPromises()

    const {
      state: {
        traction: {
          ont: {
            pools: {
              resources: { plates, tagSets, wells, requests, tags },
              pooling: { pool, tube, libraries },
            },
          },
        },
      },
    } = store

    expect(Object.keys(plates).length).toBeGreaterThan(0)
    expect(Object.keys(tagSets).length).toBeGreaterThan(0)
    expect(Object.keys(wells).length).toBeGreaterThan(0)
    expect(Object.keys(requests).length).toBeGreaterThan(0)
    expect(Object.keys(tags).length).toBeGreaterThan(0)
    expect(Object.keys(pool).length).toBeGreaterThan(0)
    expect(Object.keys(tube).length).toBeGreaterThan(0)
    expect(Object.keys(libraries).length).toBeGreaterThan(0)
  })
})
