import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@support/testHelper.js'
import AnnotationItem from '@/components/AnnotationItem.vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'
import { AnnotationItemType } from '@/stores/utilities/annotation.js'

const annotation = {
  id: '1',
  comment: 'annotation 1',
  created_at: '2023-10-01T12:00:00Z',
  user: 'lulu',
  annotation_type_id: '1',
  annotatable_type: 'Pacbio::Run',
}

const annotationTypeFactory = AnnotationTypeFactory()

describe('AnnotationItem.vue', () => {
  let store

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = usePacbioRunCreateStore()
    store.$state = {
      resources: {
        annotationTypes: annotationTypeFactory.storeData,
      },
      run: {
        id: '1',
        name: 'Test Run',
        annotations: [
          AnnotationItemType({ attributes: annotation, id: '1', newRecord: false }),
          AnnotationItemType({ id: '2', newRecord: true }),
        ],
      },
    }
  })

  describe('for a new annotation', () => {
    it('enables input when the annotation is new', () => {
      const wrapper = mount(AnnotationItem, {
        props: { id: '2', parent: store.run, annotationTypes: annotationTypeFactory.storeData },
      })
      console.log(wrapper.vm.annotationTypeSelectOptions())
      expect(wrapper.findAll('input:disabled').length).toEqual(0)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.disabled).toBeFalsy()
      expect(wrapper.find('[data-action="remove-annotation"]').element.disabled).toBeFalsy()
    })

    it('shows the list of annotation types', () => {
      const wrapper = mount(AnnotationItem, {
        props: { id: '2', parent: store.run, annotationTypes: annotationTypeFactory.storeData },
      })
      const annotationTypeSelect = wrapper.find('[data-attribute="annotation-type"]')
      expect(annotationTypeSelect.exists()).toBeTruthy()
      expect(annotationTypeSelect.findAll('option').length).toEqual(
        Object.values(annotationTypeFactory.storeData).length + 1,
      ) // +1 for the default "Select type" option
    })

    it('shows the correct data when the annotation is new', () => {
      const newAnnotation = AnnotationItemType({ id: '2', newRecord: true })
      const wrapper = mount(AnnotationItem, {
        props: { id: '2', parent: store.run, annotationTypes: annotationTypeFactory.storeData },
      })
      expect(wrapper.find('[data-attribute="comment"]').element.value).toEqual(
        newAnnotation.comment,
      )
      expect(wrapper.find('[data-attribute="annotation-type"]').element.value).toEqual('')
      expect(wrapper.find('[data-attribute="user"]').element.value).toEqual(newAnnotation.user)
    })
  })

  describe('for an existing annotation', () => {
    it('renders annotation item with correct data', () => {
      const wrapper = mount(AnnotationItem, {
        props: { id: '1', parent: store.run, annotationTypes: annotationTypeFactory.storeData },
      })
      expect(wrapper.find('[data-attribute="comment"]').element.value).toEqual(annotation.comment)
      expect(wrapper.find('[data-attribute="user"]').element.value).toEqual(annotation.user)
      expect(wrapper.find('[data-attribute="created-at"]').text()).toEqual(annotation.created_at)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.value).toEqual(
        annotation.annotation_type_id,
      )
    })

    it('disables input when the annotation is not new', () => {
      const wrapper = mount(AnnotationItem, {
        props: { id: '1', parent: store.run, annotationTypes: annotationTypeFactory.storeData },
      })
      expect(wrapper.findAll('input:disabled').length).toEqual(2)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.disabled).toBeTruthy()
      expect(wrapper.find('[data-action="remove-annotation"]').exists()).toBeFalsy()
    })
  })
})
