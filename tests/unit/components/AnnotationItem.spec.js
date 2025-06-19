import { mount } from '@support/testHelper.js'
import AnnotationItem from '@/components/AnnotationItem.vue'

const annotation = {
  id: '1',
  comment: 'annotation 1',
  created_at: '2023-10-01T12:00:00Z',
  user: 'lulu',
  annotation_type_id: '1',
  annotatable_type: 'Pacbio::Run',
}

describe('AnnotationItem.vue', () => {
  it('renders annotation item with correct data', () => {
    const wrapper = mount(AnnotationItem, {
      props: { annotation },
    })
    expect(wrapper.find('[data-attribute="comment"]').element.value).toEqual('annotation 1')
    expect(wrapper.find('[data-attribute="user"]').element.value).toEqual('lulu')
    expect(wrapper.find('[data-attribute="created-at"]').text()).toEqual('2023-10-01T12:00:00Z')
  })

  it('is a new record when annotation is empty', () => {
    const wrapper = mount(AnnotationItem)
    expect(wrapper.vm.isNewRecord).toBeTruthy()
  })

  it('disables input when the annotation is not new', () => {
    const wrapper = mount(AnnotationItem, {
      props: { ...annotation, id: 'new' },
    })
    expect(wrapper.vm.isNewRecord).toBeTruthy()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
