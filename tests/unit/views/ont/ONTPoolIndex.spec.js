import ONTPoolIndex from '@/views/ONT/ONTPoolIndex.vue'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import { vi } from 'vitest'
import flushPromises from 'flush-promises'

describe('OntPoolIndex', () => {
  beforeEach(() => {
    // Ideally I'd love to mock the http response here, but swrv seems to tun
    // into problems mounting via-vue test utils, and `getCurrentInstance` fails
    // to find the instance
    vi.mock('swrv', () => ({
      default: vi.fn(() => ({
        data: {
          flipper_id: 'User',
          features: {
            dpl_279_ont_libraries_and_pools: { enabled: true },
          },
        },
      })),
    }))
  })

  it('displays each of the pools', async () => {
    const get = vi.spyOn(store.state.api.traction.ont.pools, 'get')
    get.mockResolvedValue(Data.TractionOntPools)
    const expectedPools = Data.TractionOntPools.data.data.length
    const wrapper = mount(ONTPoolIndex, {
      localVue,
      store,
      router,
    })
    await flushPromises()
    expect(wrapper.findAll('tbody>tr').length).toEqual(expectedPools)
  })
})
