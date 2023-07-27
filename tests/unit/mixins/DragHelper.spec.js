import DragHelper from '@/mixins/DragHelper'
import { mount } from '@support/testHelper'

describe('DragHelper', () => {
  let dragHelper, wrapper

  beforeEach(() => {
    wrapper = mount(DragHelper, {
      template: '<div />',
      render() {},
    })

    dragHelper = wrapper.vm
  })

  describe('#updateFlowcell', () => {
    it('emits an event for updateFlowcell', () => {
      const flowcellPosition = 1
      const libraryName = 'aLibraryName'

      dragHelper.updateFlowcell(flowcellPosition, libraryName)

      expect(wrapper.emitted().updateFlowcell).toBeTruthy()
      expect(wrapper.emitted().updateFlowcell[0][0]).toEqual(flowcellPosition)
      expect(wrapper.emitted().updateFlowcell[0][1]).toEqual(libraryName)
    })
  })

  describe('#updateLibraryList', () => {
    it('emits an event for updateLibraryList', () => {
      const libraryName = 'aLibraryName'
      const assignToFlowcell = true

      dragHelper.updateLibraryList(libraryName, assignToFlowcell)

      expect(wrapper.emitted().updateLibraryList).toBeTruthy()
      expect(wrapper.emitted().updateLibraryList[0][0]).toEqual(libraryName)
      expect(wrapper.emitted().updateLibraryList[0][1]).toEqual(assignToFlowcell)
    })
  })

  describe('#allowDrop', () => {
    it('sets hover to true', () => {
      const mockEvent = { preventDefault: vi.fn() }
      dragHelper.allowDrop(mockEvent)
      expect(dragHelper.hover).toEqual(true)
    })
  })

  describe('#endDrop', () => {
    it('sets hover to false', () => {
      const mockEvent = { preventDefault: vi.fn() }
      dragHelper.endDrop(mockEvent)
      expect(dragHelper.hover).toEqual(false)
    })
  })
})
