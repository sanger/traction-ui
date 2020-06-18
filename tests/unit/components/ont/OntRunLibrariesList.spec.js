import OntRunLibrariesList from '@/components/ont/OntRunLibrariesList'
import { mount, localVue } from '../../testHelper'

describe('OntLibraries.vue', () => {
  let wrapper, librariesData, props, librariesList

  beforeEach(() => {
    props = {
      selectedLibraryNames: []
    }
    librariesData = [
      { id: 1, name: 'TRAC-2-1', plate_barcode: 'TRAC-1-1', poolSize: 1, wellRange: 'A1-H3', tag_set: 24 },
      { id: 2, name: 'TRAC-2-2', plate_barcode: 'TRAC-1-1', poolSize: 2, wellRange: 'A4-H6', tag_set: 24 },
      { id: 3, name: 'TRAC-2-3', plate_barcode: 'TRAC-1-1', poolSize: 3, wellRange: 'A7-H9', tag_set: 24 },
      { id: 4, name: 'TRAC-2-4', plate_barcode: 'TRAC-1-1', poolSize: 4, wellRange: 'A10-H12', tag_set: 24 },
      { id: 5, name: 'TRAC-2-5', plate_barcode: 'TRAC-1-2', poolSize: 1, wellRange: 'A1-H12', tag_set: 96 },
    ]

    wrapper = mount(OntRunLibrariesList, {
      localVue,
      propsData: props,
      data() {
        return {
          libraries: librariesData
        }
      },
    })

    librariesList = wrapper.vm
  })

  it('will have a table', () => {
    expect(wrapper.find('.ont-run-libraries')).toBeDefined()
  })

  it('contains the correct data', () => {
    expect(wrapper.find('.ont-run-libraries-list-group').findAll('.list-group-item').length).toEqual(5)
  })

  describe('components', () => {
    it('has a OntTube component', () => {
      expect(wrapper.findComponent({ref: 'ontTube'})).toBeTruthy()
    })
  })

  describe('#drop', () => {
    let mockEvent, flowcellPosition

    beforeEach(() => {
      librariesList.updateFlowcell = jest.fn()
      flowcellPosition = 1
      mockEvent = { dataTransfer: { getData() { return flowcellPosition } }, preventDefault: jest.fn() }
    })

    it('will update the flowcell', async () => {
      librariesList.drop(mockEvent)
      expect(librariesList.updateFlowcell).toBeCalledWith(flowcellPosition, '')
    })

  })
})