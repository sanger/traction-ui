import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate'
import { mount, localVue, store, Data } from 'testHelper'
import flushPromises from 'flush-promises'

describe('PacbioPoolCreate', () => {
  it('will fetch all of the data', async () => {
    const {
      state: {
        api: {
          traction: {
            pacbio: { plates: platesRequest, tag_sets: tagSetsRequest },
          },
        },
      },
    } = store

    platesRequest.get = jest.fn(() => Data.PacbioPlatesRequest)
    tagSetsRequest.get = jest.fn(() => Data.PacbioTagSets)

    mount(PacbioPoolCreate, {
      localVue,
      store,
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

    // TODO: implement fetchPacbioPlates
    expect(Object.keys(plates).length).toBeGreaterThan(0)
    expect(Object.keys(tagSets).length).toBeGreaterThan(0)
  })
})
