import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import flushPromises from 'flush-promises'
import { expect } from 'vitest'

describe('PacbioPoolCreate', () => {
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

    router.push('pacbio/pool/new')

    mount(PacbioPoolCreate, {
      localVue,
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

    router.push('pacbio/pool/1')

    mount(PacbioPoolCreate, {
      localVue,
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
