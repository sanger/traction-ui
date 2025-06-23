import { mountWithStore } from '@support/testHelper.js'
import AnnotationItem from '@/components/AnnotationItem.vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'

const annotation = {
  id: '1',
  comment: 'annotation 1',
  created_at: '2023-10-01T12:00:00Z',
  user: 'lulu',
  annotation_type_id: '1',
  annotatable_type: 'Pacbio::Run',
}

const annotationTypeFactory = AnnotationTypeFactory()

const mountComponent = (props = {}) => {
  const { wrapper } = mountWithStore(AnnotationItem, {
    initialState: {
      pacbioRunCreate: {
        resources: {
          annotationTypes: annotationTypeFactory.storeData,
        },
      },
    },
    props,
    createStore: () => usePacbioRunCreateStore(),
  })
  return wrapper
}

describe('AnnotationItem.vue', () => {
  describe('for a new annotation', () => {
    it('is a new record when annotation is empty', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isNewRecord).toBeTruthy()
    })

    it('enables input when the annotation is new', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isNewRecord).toBeTruthy()
      expect(wrapper.findAll('input:disabled').length).toEqual(0)
    })

    it('shows the list of annotation types', () => {
      const wrapper = mountComponent()
      const annotationTypeSelect = wrapper.find('[data-attribute="annotation-type"]')
      expect(annotationTypeSelect.exists()).toBeTruthy()
      expect(annotationTypeSelect.findAll('option').length).toEqual(
        Object.values(annotationTypeFactory.storeData).length + 1,
      ) // +1 for the default "Select type" option
    })
  })

  describe('for an existing annotation', () => {
    it('renders annotation item with correct data', () => {
      const wrapper = mountComponent({ annotation })
      expect(wrapper.find('[data-attribute="comment"]').element.value).toEqual('annotation 1')
      expect(wrapper.find('[data-attribute="user"]').element.value).toEqual('lulu')
      expect(wrapper.find('[data-attribute="created-at"]').text()).toEqual('2023-10-01T12:00:00Z')
      expect(wrapper.find('[data-attribute="annotation-type"]').element.value).toEqual('1')
    })

    it('disables input when the annotation is not new', () => {
      const wrapper = mountComponent({ annotation })
      expect(wrapper.vm.isNewRecord).toBeFalsy()
      expect(wrapper.findAll('input:disabled').length).toEqual(2)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.disabled).toBeTruthy()
    })
  })
})
