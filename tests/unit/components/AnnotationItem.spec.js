import { mount, createPinia, setActivePinia } from '@support/testHelper.js'
import AnnotationItem from '@/components/AnnotationItem.vue'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'
import { AnnotationItemType, annotationTypeSelectOptions } from '@/stores/utilities/annotation.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'

const annotationTypeFactory = AnnotationTypeFactory()

const selectOptions = annotationTypeSelectOptions(Object.values(annotationTypeFactory.storeData))

const annotation = {
  comment: 'comment1',
  annotation_type_id: 1,
  created_at: '2025-10-25',
  user: 'si5',
  id: '1',
}

const run = {
  id: '1',
  name: 'Test Run',
  annotations: [
    AnnotationItemType({ attributes: annotation, id: '1', newRecord: false }),
    AnnotationItemType({ id: '2', newRecord: true }),
  ],
}

describe('AnnotationItem.vue', () => {
  let store

  beforeEach(() => {
    // Creates a fresh pinia instance and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`
    const pinia = createPinia()
    setActivePinia(pinia)
    store = usePacbioRunCreateStore()
    store.$state = { run }
  })

  describe('for a new annotation', () => {
    it('enables input when the annotation is new', () => {
      const wrapper = mount(AnnotationItem, {
        props: {
          id: '2',
          parent: store.run,
          annotationTypeSelectOptions: selectOptions,
        },
      })
      expect(wrapper.findAll('input:disabled').length).toEqual(0)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.disabled).toBeFalsy()
      expect(wrapper.find('[data-action="remove-annotation"]').element.disabled).toBeFalsy()
    })

    it('shows the list of annotation types', () => {
      const wrapper = mount(AnnotationItem, {
        props: {
          id: '2',
          parent: store.run,
          annotationTypeSelectOptions: selectOptions,
        },
      })
      const annotationTypeSelect = wrapper.find('[data-attribute="annotation-type"]')
      expect(annotationTypeSelect.exists()).toBeTruthy()
      expect(annotationTypeSelect.findAll('option').length).toEqual(selectOptions.length)
    })

    it('shows the correct data for a new annotation', () => {
      const newAnnotation = run.annotations[1]
      const wrapper = mount(AnnotationItem, {
        props: {
          id: '2',
          parent: store.run,
          annotationTypeSelectOptions: selectOptions,
        },
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
        props: {
          id: '1',
          parent: store.run,
          annotationTypeSelectOptions: selectOptions,
        },
      })
      expect(wrapper.find('[data-attribute="comment"]').element.value).toEqual(annotation.comment)
      expect(wrapper.find('[data-attribute="user"]').element.value).toEqual(annotation.user)
      expect(wrapper.find('[data-attribute="created-at"]').text()).toEqual(annotation.created_at)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.value).toEqual(
        annotation.annotation_type_id.toString(),
      )
    })

    it('disables input when the annotation is not new', () => {
      const wrapper = mount(AnnotationItem, {
        props: {
          id: '1',
          parent: store.run,
          annotationTypeSelectOptions: selectOptions,
        },
      })
      expect(wrapper.findAll('input:disabled').length).toEqual(2)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.disabled).toBeTruthy()
      expect(wrapper.find('[data-action="remove-annotation"]').exists()).toBeFalsy()
    })
  })
})
