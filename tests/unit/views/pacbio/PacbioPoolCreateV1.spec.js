import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreateV1.vue'
import { mount, store, Data, router, flushPromises } from '@support/testHelper.js'
import { expect } from 'vitest'

describe('PacbioPoolCreateV1', () => {
  it('will fetch all of the data', async () => {
    const {
      state: {
        api: {
          traction: {
            pacbio: { tag_sets: tagSetsRequest, pools: poolsRequest },
          },
        },
      },
    } = store

    tagSetsRequest.get = vi.fn(() => Data.PacbioTagSets)
    poolsRequest.find = vi.fn()

    await router.push('pacbio/pool/new')

    mount(PacbioPoolCreate, {
      store,
      router,
    })

    await flushPromises()

    const {
      state: {
        traction: {
          pacbio: {
            poolCreate: {
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
            pacbio: { tag_sets: tagSetsRequest, pools: poolsRequest },
          },
        },
      },
    } = store

    tagSetsRequest.get = vi.fn(() => Data.PacbioTagSets)
    poolsRequest.find = vi.fn(() => Data.TractionPacbioPool)

    mount(PacbioPoolCreate, {
      store,
      router,
    })

    await flushPromises()

    const {
      state: {
        traction: {
          pacbio: {
            poolCreate: {
              resources: { tagSets },
            },
          },
        },
      },
    } = store

    expect(Object.keys(tagSets).length).toBeGreaterThan(0)
  })
})
