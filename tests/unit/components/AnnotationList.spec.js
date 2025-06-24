import { mountWithStore } from '@support/testHelper.js'
import AnnotationList from '@/components/AnnotationList.vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'

const annotationTypeFactory = AnnotationTypeFactory()
const pacbioRunFactory = PacbioRunFactory({ count: 1 })
const { resources, ...storeData } = pacbioRunFactory.storeData

const mountComponent = (props = {}) => {
  const { wrapper, store } = mountWithStore(AnnotationList, {
    initialState: {
      pacbioRunCreate: {
        ...storeData,
        resources: {
          ...resources,
          annotationTypes: annotationTypeFactory.storeData,
        },
      },
    },
    props,
    createStore: () => usePacbioRunCreateStore(),
  })
  return { wrapper, store }
}

describe('AnnotationList.vue', () => {
  it('renders a list of annotations for a PacBio run', () => {
    const { wrapper } = mountComponent({
      annotatableType: 'Pacbio::Run',
      annotatableId: storeData.run.id,
    })
    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(2)
  })

  it('renders a list of annotations for a Pacbio Well', () => {
    const { wrapper } = mountComponent({
      annotatableType: 'Pacbio::Well',
      annotatableId: Object.keys(storeData.wells)[0],
    })
    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(2)
  })

  it('renders no annotations for a new record', () => {
    const { wrapper } = mountComponent()
    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(0)
  })

  it('adds a new annotations when the add button is clicked', async () => {
    const { wrapper } = mountComponent({
      annotatableType: 'Pacbio::Run',
      annotatableId: storeData.run.id,
    })
    const addButton = wrapper.find('[data-action="add-annotation"]')
    expect(addButton.exists()).toBeTruthy()
    await addButton.trigger('click')

    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(3) // 2 existing + 1 new
  })
})
