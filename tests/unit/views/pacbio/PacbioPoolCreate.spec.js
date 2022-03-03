import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate'
import { mount, localVue, store, Data, router } from 'testHelper'
import flushPromises from 'flush-promises'

describe('PacbioPoolCreate', () => {
  it('will fetch all of the data', async () => {
    const {
      state: {
        api: {
          traction: {
            pacbio: { requests: requestsRequest, tag_sets: tagSetsRequest },
          },
        },
      },
    } = store

    requestsRequest.get = jest.fn(() => Data.PacbioRequestsRequest)
    tagSetsRequest.get = jest.fn(() => Data.PacbioTagSets)

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
              resources: { plates, tagSets },
            },
          },
        },
      },
    } = store

    expect(Object.keys(plates).length).toBeGreaterThan(0)
    expect(Object.keys(tagSets).length).toBeGreaterThan(0)
  })
})
