import PacbioRunShow from '@/views/pacbio/PacbioRunShow.vue'
import { mount, Data, router, flushPromises, createTestingPinia } from '@support/testHelper.js'
import { describe, expect, it } from 'vitest'
import { newRunType, existingRunType } from '@/stores/utilities/run.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

const smrtLinkVersions = {
  1: {
    id: 1,
    name: 'v11',
    default: true,
    active: true,
  },
}

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given 'props'.
 * @param {*} props - props to be passed to the component while mounting
 *
 */
function mountWithStore(props) {
  const wrapper = mount(PacbioRunShow, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRunCreate: {
              resources: { smrtLinkVersions },
            },
          },
          stubActions: false,
          plugins: [
            ({ store }) => {
              if (store.$id === 'root') {
                ;(store.api.traction.pacbio.smrt_link_versions.get = vi.fn()),
                  (store.api.traction.pacbio.runs.find = vi.fn(() => Data.PacbioRun)),
                  (store.api.traction.pacbio.tubes.get = vi.fn(() => Data.PacbioTubeWithPool))
              }
            },
          ],
        }),
      ],
      stubs: {
        PacbioPlateList: true,
        PacbioRunPoolLibraryList: true,
        PacbioRunInfoEdit: true,
        PacbioRunWellDefaultEdit: true,
      },
    },
    router,
    props,
  })
  usePacbioRunCreateStore()
  return { wrapper }
}
describe('PacbioRunShow.vue', () => {
  describe('new', () => {
    it('shows as a new run ', async () => {
      const { wrapper } = mountWithStore({ id: 'new' })
      await flushPromises()

      const type = newRunType

      const button = wrapper.find(`[data-action=${type.id}]`)
      expect(button.element.id).toEqual(type.id)
      expect(button.text()).toEqual(type.label)
    })
  })

  describe('existing run', () => {
    it('shows as an existing run ', async () => {
      const { wrapper } = mountWithStore({ id: 1 })

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
