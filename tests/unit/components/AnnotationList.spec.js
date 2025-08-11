import { mount } from '@support/testHelper.js'
import AnnotationList from '@/components/AnnotationList.vue'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'
import { annotationsByAnnotatable } from '@/stores/utilities/annotation.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { expect } from 'vitest'

const annotationTypeFactory = AnnotationTypeFactory()
const pacbioRunFactory = PacbioRunFactory({ count: 1 })

// Create a list of annotations for a PacBio run and a Well
const annotations = Object.values(pacbioRunFactory.storeData.annotations)

const annotationsByRun = annotationsByAnnotatable({
  annotations,
  annotatableType: 'Pacbio::Run',
  annotatableId: pacbioRunFactory.storeData.run.id,
})

const well = Object.values(Object.values(pacbioRunFactory.storeData.wells)[0])[0]

const annotationsByWell = annotationsByAnnotatable({
  annotations,
  annotatableType: 'Pacbio::Well',
  annotatableId: well.id,
})

describe('AnnotationList.vue', () => {
  let store

  beforeEach(() => {
    store = usePacbioRunCreateStore()
    store.$state = {
      run: { ...pacbioRunFactory.storeData.run, annotationList: [...annotationsByRun] },
      wells: { [well.id]: { ...well, annotationList: annotationsByWell } },
    }
  })

  it('renders a list of annotations for a PacBio run', () => {
    const wrapper = mount(AnnotationList, {
      props: { parent: store.run, annotationTypes: Object.values(annotationTypeFactory.storeData) },
    })
    expect(wrapper.find('[data-list="run-annotations"]').exists()).toBeTruthy()
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
    expect(wrapper.find('[data-list="well-annotations"]').exists()).toBeTruthy()
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
    const annotationsLength = wrapper.findAll('[data-type="annotation"]').length
    const annotationId = wrapper.vm.parent.annotationList[annotationsLength - 1].id
    const addButton = wrapper.find(`[data-action="add-annotation-${annotationId}"]`)
    await addButton.trigger('click')

    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(3) // 2 existing + 1 new
  })

  it('displays the add button only for the last annotation', () => {
    const wrapper = mount(AnnotationList, {
      props: { parent: store.run, annotationTypes: Object.values(annotationTypeFactory.storeData) },
    })
    const annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(2) // 2 existing annotations
    const addButtons = wrapper.findAll('[data-action^="add-annotation"]')
    expect(addButtons.length).toEqual(1)

    let addButton = wrapper.find(`[data-action="add-annotation-2"]`)
    expect(addButton.exists()).toBeTruthy()
  })

  it('removes an annotation when the remove button is clicked', async () => {
    let annotations
    const wrapper = mount(AnnotationList, {
      props: { parent: store.run, annotationTypes: Object.values(annotationTypeFactory.storeData) },
    })

    // Get the annotation id for the newly added annotation
    const annotationId = wrapper.vm.parent.annotationList[1].id
    const addButton = wrapper.find(`[data-action="add-annotation-${annotationId}"]`)
    await addButton.trigger('click')

    annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(3)

    const removeButton = wrapper.find(`[data-action="remove-annotation-${annotationId}"]`)
    expect(removeButton.exists()).toBeTruthy()
    await removeButton.trigger('click')

    annotations = wrapper.findAll('[data-type="annotation"]')
    expect(annotations.length).toEqual(2)
  })

  it('shows the type of the annotations', () => {
    const wrapper = mount(AnnotationList, {
      props: { parent: store.run, annotationTypes: Object.values(annotationTypeFactory.storeData) },
    })

    const title = wrapper.find('header')
    expect(title.text()).toContain('Run Annotations')
  })
})
