import PacbioRun from '@/views/pacbio/PacbioRunShow'
import { mount, store, router, Data, flushPromises } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'
import { newRunType, existingRunType } from '@/store/traction/pacbio/runCreate/run'

const smrtLinkVersions = {
  1: {
    id: 1,
    name: 'v11',
    default: true,
    active: true,
  },
}

describe('PacbioRunShow.vue', () => {
  beforeEach(() => {
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
  })

  describe('new', () => {
    it('shows as a new run ', async () => {
      const {
        state: {
          api: {
            traction: {
              pacbio: { smrt_link_versions: smrtLinkVersionsRequest },
            },
          },
        },
      } = store

      smrtLinkVersionsRequest.get = vi.fn()

      const wrapper = mount(PacbioRun, {
        store,
        router,
        stubs: {
          PacbioPlateList: true,
          PacbioPoolList: true,
          PacbioRunInfoEdit: true,
          PacbioRunWellDefaultEdit: true,
        },
        props: { id: 'new' },
      })
      await flushPromises()

      const type = newRunType

      const button = wrapper.find(`[data-action=${type.id}]`)
      expect(button.element.id).toEqual(type.id)
      expect(button.text()).toEqual(type.label)
    })
  })

  describe('existing run', () => {
    it('shows as an existing run ', async () => {
      const {
        state: {
          api: {
            traction: {
              pacbio: {
                smrt_link_versions: smrtLinkVersionsRequest,
                runs: runsRequest,
                pools: poolsRequest,
              },
            },
          },
        },
      } = store

      smrtLinkVersionsRequest.get = vi.fn()
      runsRequest.find = vi.fn(() => Data.PacbioRun)
      poolsRequest.get = vi.fn(() => Data.PacbioPool)

      const wrapper = mount(PacbioRun, {
        store,
        router,
        stubs: {
          PacbioPlateList: true,
          pacbioPoolList: true,
          PacbioRunInfoEdit: true,
          PacbioRunWellDefaultEdit: true,
        },
        props: { id: 1 },
      })
      // ClearData is getting rid of the smrtLinkVersion we manually set
      wrapper.vm.clearData = vi.fn()
      await flushPromises()

      const type = existingRunType

      const button = wrapper.find(`[data-action=${type.id}]`)
      expect(button.element.id).toEqual(type.id)
      expect(button.text()).toEqual(type.label)
    })
  })
})
