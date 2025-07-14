import { mount, createPinia, setActivePinia } from '@support/testHelper.js'
import AnnotationList from '@/components/AnnotationList.vue'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'
import { annotationsByAnnotatable } from '@/stores/utilities/annotation.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'

const annotationTypeFactory = AnnotationTypeFactory()
const pacbioRunFactory = PacbioRunFactory({ count: 1 })

// Create a list of annotations for a PacBio run and a Well
const annotations = Object.values(pacbioRunFactory.storeData.annotations)

const annotationsByRun = annotationsByAnnotatable({
  annotations,
  annotatableType: 'Pacbio::Run',
  annotatableId: pacbioRunFactory.storeData.run.id,
})

const well = Object.values(pacbioRunFactory.storeData.wells)[0]

const annotationsByWell = annotationsByAnnotatable({
  annotations,
  annotatableType: 'Pacbio::Well',
  annotatableId: well.id,
})

describe('AnnotationList.vue', () => {
  let store

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = usePacbioRunCreateStore()
    store.$state = {
      run: { ...pacbioRunFactory.storeData.run, annotations: [...annotationsByRun] },
      wells: { [well.id]: { ...well, annotations: annotationsByWell } },
    }
  })

  it('renders a list of annotations for a PacBio run', () => {
    const wrapper = mount(AnnotationList, {
      props: { parent: store.run, annotationTypes: Object.values(annotationTypeFactory.storeData) },
    })
    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(annotationsByRun.length)
  })

  it('renders a list of annotations for a Pacbio Well', () => {
    const wrapper = mount(AnnotationList, {
      props: {
        parent: store.wells[well.id],
        annotationTypes: Object.values(annotationTypeFactory.storeData),
      },
    })
    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(annotationsByWell.length)
  })

  it('renders no annotations for a new record', () => {
    const wrapper = mount(AnnotationList, {
      props: { parent: {}, annotationTypes: Object.values(annotationTypeFactory.storeData) },
    })
    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(0)
  })

  it('adds a new annotations when the add button is clicked', async () => {
    const wrapper = mount(AnnotationList, {
      props: { parent: store.run, annotationTypes: Object.values(annotationTypeFactory.storeData) },
    })

    const addButton = wrapper.find('[data-action="add-annotation"]')
    expect(addButton.exists()).toBeTruthy()
    await addButton.trigger('click')

    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(3) // 2 existing + 1 new
  })

  // we also need to change the adding of annotations as there is 1 extra
  it.skip('removes an annotation when the remove button is clicked', async () => {
    let annotations
    const wrapper = mount(AnnotationList, {
      props: { parent: store.run, annotationTypes: Object.values(annotationTypeFactory.storeData) },
    })

    const addButton = wrapper.find('[data-action="add-annotation"]')
    await addButton.trigger('click')

    annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(3)

    const removeButton = annotations[2].find('[data-action="remove-annotation"]')
    expect(removeButton.exists()).toBeTruthy()
    await removeButton.trigger('click')

    annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(2)
  })
})
