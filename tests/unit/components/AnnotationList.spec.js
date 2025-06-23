import { mountWithStore } from '@support/testHelper.js'
import AnnotationList from '@/components/AnnotationItem.vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'

const annotationTypeFactory = AnnotationTypeFactory()

const mountComponent = (props = {}) => {
  const { wrapper } = mountWithStore(AnnotationList, {
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

describe('AnnotationList.vue', () => {
  it('renders a component', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })
})
