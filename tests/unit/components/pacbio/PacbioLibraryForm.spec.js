import { mount, nextTick, createTestingPinia } from '@support/testHelper.js'
import PacbioLibraryForm from '@/components/pacbio/PacbioLibraryForm.vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { beforeEach, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'

// TODO: tests are brittle as they are using actual ids related to data.
const pacbioTagSetFactory = PacbioTagSetFactory()

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
      library: { sample: {}, tag_id: '113' },
    }
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.v2.traction.pacbio.tag_sets.get = vi.fn(
            () => pacbioTagSetFactory.responses.fetch,
          )
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
    expect(wrapper.find('#libraryForm').element).toBeTruthy()
  })
  it('should display a form with the correct fields', async () => {
    wrapper.vm.showModal = true
    await nextTick()
    expect(wrapper.find('#tag-input').element).toBeTruthy()
    expect(wrapper.find('#tag-set-input').element).toBeTruthy()
    expect(wrapper.find('#library-volume').element).toBeTruthy()
    expect(wrapper.find('#library-concentration').element).toBeTruthy()
    expect(wrapper.find('#library-templatePrepKitBoxBarcode').element).toBeTruthy()
    expect(wrapper.find('#library-insertSize').element).toBeTruthy()
    expect(wrapper.find('#library-volume').element.value).toBe('')
    expect(wrapper.find('#library-concentration').element.value).toBe('')
    expect(wrapper.find('#library-templatePrepKitBoxBarcode').element.value).toBe('')
    expect(wrapper.find('#library-insertSize').element.value).toBe('')
    expect(wrapper.find('#tooltip-div').exists()).toBeFalsy()
  })

  it('must have tagSetOptions data', () => {
    expect(modal.tagSetOptions).toEqual([
      { value: '', text: 'Please select a tag set' },
      {
        text: 'Sequel_16_barcodes_v3',
        value: '1',
      },
      {
        text: 'IsoSeq_v1',
        value: '6',
      },
    ])
  })

  it('must have tagOptions data', () => {
    expect(modal.tagOptions).toEqual([{ value: '', text: 'Please select a tag' }])
  })

  it('should update tagOptions when tagSet is selected', async () => {
    expect(modal.tagOptions).toHaveLength(1)
    modal.selectedTagSetId = '1'
    await nextTick()
    expect(modal.tagOptions).toHaveLength(3)
  })
  it('shows an alert when fetcPaclbioTagSets fails', async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.v2.traction.pacbio.tag_sets.get = vi.fn().mockRejectedValue('Error')
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
  describe('when a library with all fields is passed as a prop', () => {
    beforeEach(() => {
      const plugins = [
        ({ store }) => {
          if (store.$id === 'root') {
            store.api.v2.traction.pacbio.tag_sets.get = vi.fn(
              () => pacbioTagSetFactory.responses.fetch,
            )
          }
        },
      ]

      props = {
        disabled: true,
        isStatic: true,
        library: {
          tag_id: '3',
          volume: 15,
          concentration: '1',
          template_prep_kit_box_barcode: 'barcode',
          insert_size: '1',
          used_volume: 10.4222,
        },
      }
      const { wrapperObj } = mountWithStore({
        props,
        plugins,
      })
      wrapper = wrapperObj
      modal = wrapperObj.vm
    })
    it('should display a form with the correct field values', async () => {
      await flushPromises()
      expect(wrapper.find('#library-volume').element.value).toBe('15')
      expect(wrapper.find('#library-concentration').element.value).toBe('1')
      expect(wrapper.find('#library-templatePrepKitBoxBarcode').element.value).toBe('barcode')
      expect(wrapper.find('#library-insertSize').element.value).toBe('1')
      expect(wrapper.find('#tag-set-input').element.value).toBe('1')
      expect(wrapper.find('#library-used-volume').element).exist.toBeTruthy()
      expect(wrapper.find('#library-used-volume').text()).toContain('10.42')
      expect(wrapper.find('#tooltip-div').exists()).toBeTruthy()
      expect(modal.selectedTagSetId).toBe('1')
    })

    it('shows error when new value when entered volume is less than used_volume', async () => {
      const input = wrapper.find('#library-volume')
      await input.setValue(5)
      await nextTick()
      expect(wrapper.find('[data-attribute=volume-error]').text()).toEqual(
        'Volume cannot be less than used volume',
      )
    })
    it('removes error when new value when entered volume is greater than used_volume', async () => {
      const input = wrapper.find('#library-volume')
      await input.setValue(5)
      await nextTick()
      expect(wrapper.find('[data-attribute=volume-error]').text()).toEqual(
        'Volume cannot be less than used volume',
      )
      await input.setValue(25)
      expect(wrapper.find('[data-attribute=volume-error]').exists()).toBe(false)
    })
  })
})
