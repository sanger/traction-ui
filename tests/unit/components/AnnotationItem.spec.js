import { mount } from '@support/testHelper.js'
import AnnotationItem from '@/components/AnnotationItem.vue'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'
import { AnnotationListType } from '@/stores/utilities/annotation.js'

const pacbioRunFactory = PacbioRunFactory({ count: 1 })
const run = pacbioRunFactory.storeData.run
const annotationTypeFactory = AnnotationTypeFactory()

const annotationList = AnnotationListType({
  parent: run,
  annotatableType: 'Pacbio::Run',
  annotatableId: run.id,
  annotations: Object.values(pacbioRunFactory.storeData.annotations),
  annotationTypes: Object.values(annotationTypeFactory.storeData),
})

describe('AnnotationItem.vue', () => {
  describe('for a new annotation', () => {
    it('enables input when the annotation is new', () => {
      annotationList.add('999')
      const wrapper = mount(AnnotationItem, {
        props: {
          id: '999',
          parent: annotationList.parent,
          annotationTypeSelectOptions: annotationList.annotationTypeSelectOptions,
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
          parent: annotationList.parent,
          annotationTypeSelectOptions: annotationList.annotationTypeSelectOptions,
        },
      })
      const annotationTypeSelect = wrapper.find('[data-attribute="annotation-type"]')
      expect(annotationTypeSelect.exists()).toBeTruthy()
      expect(annotationTypeSelect.findAll('option').length).toEqual(
        annotationList.annotationTypeSelectOptions.length,
      )
    })

    it('shows the correct data when the annotation is new', () => {
      annotationList.add('999')
      const annotation = annotationList.parent.annotations.find((a) => a.id === '999')
      const wrapper = mount(AnnotationItem, {
        props: {
          id: '999',
          parent: annotationList.parent,
          annotationTypeSelectOptions: annotationList.annotationTypeSelectOptions,
        },
      })
      expect(wrapper.find('[data-attribute="comment"]').element.value).toEqual(annotation.comment)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.value).toEqual('')
      expect(wrapper.find('[data-attribute="user"]').element.value).toEqual(annotation.user)
    })
  })

  describe('for an existing annotation', () => {
    it('renders annotation item with correct data', () => {
      const annotation = annotationList.parent.annotations[0]
      const wrapper = mount(AnnotationItem, {
        props: {
          id: annotation.id,
          parent: annotationList.parent,
          annotationTypeSelectOptions: annotationList.annotationTypeSelectOptions,
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
      const annotation = annotationList.parent.annotations[0]
      const wrapper = mount(AnnotationItem, {
        props: {
          id: annotation.id,
          parent: annotationList.parent,
          annotationTypeSelectOptions: annotationList.annotationTypeSelectOptions,
        },
      })
      expect(wrapper.findAll('input:disabled').length).toEqual(2)
      expect(wrapper.find('[data-attribute="annotation-type"]').element.disabled).toBeTruthy()
      expect(wrapper.find('[data-action="remove-annotation"]').exists()).toBeFalsy()
    })
  })
})
