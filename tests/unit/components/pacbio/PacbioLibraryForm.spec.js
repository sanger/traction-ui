import { mountWithStore, nextTick } from '@support/testHelper.js'
import PacbioLibraryForm from '@/components/pacbio/PacbioLibraryForm.vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { beforeEach, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'

const pacbioTagSetFactory = PacbioTagSetFactory()

// This is an improvement as we are not using hard coded ids but might be better as an object from store data.

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

function mountPacbioLibraryForm({ plugins = [], props } = {}) {
  return mountWithStore(PacbioLibraryForm, {
    plugins,
    props,
    createStore: () => usePacbioLibrariesStore(),
  })
}

describe('PacbioLibraryForm.vue', () => {
  let wrapper, modal, props

  beforeEach(() => {
    props = {
      disabled: true,
      isStatic: true,
      library: { sample: {}, tag_id: pacbioTagSetFactory.storeData.selected.tag.id },
    }
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.tag_sets.get = vi.fn(() => pacbioTagSetFactory.responses.fetch)
        }
      },
    ]

    ;({ wrapper } = mountPacbioLibraryForm({
      props,
      plugins,
    }))
    modal = wrapper.vm
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
      ...modal.pacbioRootStore.tagSetChoices,
    ])
  })

  it('must have tagOptions data', () => {
    expect(modal.tagOptions).toEqual([{ value: '', text: 'Please select a tag' }])
  })

  it('should update tagOptions when tagSet is selected', async () => {
    expect(modal.tagOptions).toHaveLength(1)
    modal.selectedTagSetId = pacbioTagSetFactory.storeData.selected.tagSet.id
    await nextTick()
    expect(modal.tagOptions).toHaveLength(
      pacbioTagSetFactory.storeData.selected.tagSet.tags.length + 1,
    )
  })
  it('shows an alert when fetcPaclbioTagSets fails', async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.tag_sets.get = vi.fn().mockRejectedValue('Error')
        }
      },
    ]
    ;({ wrapper } = mountPacbioLibraryForm({
      props,
      plugins,
    }))
    await flushPromises()
    expect(mockShowAlert).toHaveBeenCalled()
  })
  describe('when a library with all fields is passed as a prop', () => {
    beforeEach(() => {
      const plugins = [
        ({ store }) => {
          if (store.$id === 'root') {
            store.api.traction.pacbio.tag_sets.get = vi.fn(
              () => pacbioTagSetFactory.responses.fetch,
            )
          }
        },
      ]

      props = {
        disabled: true,
        isStatic: true,
        library: {
          tag_id: pacbioTagSetFactory.storeData.selected.tag.id,
          volume: 15,
          concentration: '1',
          template_prep_kit_box_barcode: 'barcode',
          insert_size: '1',
          used_volume: 10.4222,
        },
      }
      ;({ wrapper } = mountPacbioLibraryForm({
        props,
        plugins,
      }))
      modal = wrapper.vm
    })
    it('should display a form with the correct field values', async () => {
      await flushPromises()
      expect(wrapper.find('#library-volume').element.value).toBe('15')
      expect(wrapper.find('#library-concentration').element.value).toBe('1')
      expect(wrapper.find('#library-templatePrepKitBoxBarcode').element.value).toBe('barcode')
      expect(wrapper.find('#library-insertSize').element.value).toBe('1')
      expect(wrapper.find('#tag-set-input').element.value).toBe(
        pacbioTagSetFactory.storeData.selected.tagSet.id,
      )
      expect(wrapper.find('#library-used-volume').element).exist.toBeTruthy()
      expect(wrapper.find('#library-used-volume').text()).toContain('10.42')
      expect(wrapper.find('#tooltip-div').exists()).toBeTruthy()
      expect(modal.selectedTagSetId).toBe(pacbioTagSetFactory.storeData.selected.tagSet.id)
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
