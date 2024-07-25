import ONTPoolCreate from '@/views/ont/ONTPoolCreate.vue'
import { mount, store, Data, router, flushPromises } from '@support/testHelper'
import { expect } from 'vitest'
import OntTagSetFactory from '@tests/factories/OntTagSetFactory.js'

const ontTagSetFactory = OntTagSetFactory()

describe('OntPoolCreate', () => {
  it('will fetch all of the data', async () => {
    const {
      state: {
        api: {
          v1: {
            traction: {
              ont: { pools: poolsRequest },
            },
          },
          v2: {
            traction: {
              ont: { tag_sets: tagSetsRequest },
            },
          },
        },
      },
    } = store

    tagSetsRequest.get = vi.fn(() => ontTagSetFactory.responses.fetch)
    poolsRequest.find = vi.fn()

    await router.push({ name: 'ONTPoolCreate', params: { id: 'new' } })

    mount(ONTPoolCreate, {
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
          v1: {
            traction: {
              ont: { pools: poolsRequest },
            },
          },
          v2: {
            traction: {
              ont: { tag_sets: tagSetsRequest },
            },
          },
        },
      },
    } = store

    tagSetsRequest.get = vi.fn(() => ontTagSetFactory.responses.fetch)
    // when I moved the tag response to the factory, I broke this test
    // The pool has the id of the tag set so I had to change it.
    // it might be worth passing in the id of the tag set to the pool
    // factory to make it less brittle
    poolsRequest.find = vi.fn(() => Data.TractionOntPool)

    await router.push({ name: 'ONTPoolCreate', params: { id: 3 } })
    mount(ONTPoolCreate, {
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
