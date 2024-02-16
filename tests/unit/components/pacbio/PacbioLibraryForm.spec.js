import { mount, nextTick, createTestingPinia, Data } from '@support/testHelper.js'
import PacbioLibraryForm from '@/components/pacbio/PacbioLibraryForm.vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store.
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PacbioLibraryForm, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioLibraries: { ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  const storeObj = usePacbioLibrariesStore()
  return { wrapperObj, storeObj }
}

describe('PacbioLibraryForm.vue', () => {
  let wrapper, modal, props

  beforeEach(() => {
    props = {
      disabled: true,
      isStatic: true,
      selectedSample: { id: 1 },
    }
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.tag_sets.get = vi.fn(() => Data.TractionPacbioTagSets)
        }
      },
    ]

    const { wrapperObj } = mountWithStore({
      props,
      plugins,
    })
    wrapper = wrapperObj
    modal = wrapperObj.vm
  })

  it('will have an form component', async () => {
    wrapper.vm.showModal = true
    await nextTick()
    expect(wrapper.find('#librarForm').element).toBeTruthy()
  })

  it('must have tagSetOptions data', () => {
    expect(modal.tagSetOptions).toEqual([
      { value: '', text: 'Please select a tag set' },
      {
        text: 'Sequel_16_barcodes_v3',
        value: '3',
      },
      {
        text: 'IsoSeq_v1',
        value: '4',
      },
    ])
  })

  it('must have tagOptions data', () => {
    expect(modal.tagOptions).toEqual([{ value: '', text: 'Please select a tag' }])
  })

  it('should update tagOptions when tagSet is selected', async () => {
    expect(modal.tagOptions).toHaveLength(1)
    modal.selectedTagSetId = '3'
    await nextTick()
    expect(modal.tagOptions).toHaveLength(17)
  })
  it('shows an alert when fetcPaclbioTagSets fails', async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.tag_sets.get = vi.fn().mockRejectedValue('Error')
        }
      },
    ]
    const { wrapperObj } = mountWithStore({
      props,
      plugins,
    })
    wrapper = wrapperObj
    await flushPromises()
    expect(mockShowAlert).toHaveBeenCalled()
  })
})
