import PacbioRunShow from '@/views/pacbio/PacbioRunShow.vue'
import { mountWithStore, flushPromises } from '@support/testHelper.js'
import { describe, expect, it } from 'vitest'
import { newRunType, existingRunType } from '@/stores/utilities/run.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'
import PacbioTubeFactory from '@tests/factories/PacbioTubeFactory.js'

const pacbioRunFactory = PacbioRunFactory({ count: 1 })
const pacbioTubeFactory = PacbioTubeFactory()

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
function mountPacbioRunShow(props) {
  const plugins = [
    ({ store }) => {
      if (store.$id === 'root') {
        ;((store.api.traction.pacbio.smrt_link_versions.get = vi.fn()),
          (store.api.traction.pacbio.runs.find = vi.fn(() => pacbioRunFactory.responses.fetch)),
          (store.api.traction.pacbio.tubes.get = vi.fn(() => pacbioTubeFactory.responses.fetch)))
      }
    },
  ]
  return mountWithStore(PacbioRunShow, {
    initialState: {
      pacbioRunCreate: {
        resources: { smrtLinkVersions },
      },
    },
    plugins,
    stubs: {
      PacbioPlateList: true,
      PacbioRunPoolLibraryList: true,
      PacbioRunInfoEdit: true,
      PacbioRunWellDefaultEdit: true,
    },
    props,
  })
}
describe('PacbioRunShow.vue', () => {
  describe('new', () => {
    it('shows as a new run ', async () => {
      const { wrapper } = mountPacbioRunShow({ id: 'new' })
      await flushPromises()

      const type = newRunType

      const button = wrapper.find(`[data-action=${type.id}]`)
      expect(button.element.id).toEqual(type.id)
      expect(button.text()).toEqual(type.label)
    })
  })

  describe('existing run', () => {
    it('shows as an existing run ', async () => {
      const { wrapper } = mountPacbioRunShow({ id: pacbioRunFactory.storeData.run.id })

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
