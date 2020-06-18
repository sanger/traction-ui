import DragHelper from '@/mixins/DragHelper'
import { mount, localVue,  } from '../testHelper'

describe('DragHelper', () => {
  let dragHelper, wrapper

  beforeEach(() => {
    wrapper = mount(DragHelper, {
      localVue,
      template: '<div />',
      methods: {
      },
      render() {}
    })

    dragHelper = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('DragHelper')
  })

  describe('#handleDropUpdate', () => {
    it('emits an event for updateFlowcell and updateLibraryList', () => {
      let flowcellPosition = 1
      let libraryName = 'aLibraryName'
      let assignToFlowcell = true
      
      dragHelper.handleDropUpdate(flowcellPosition, libraryName, assignToFlowcell)
      
      expect(wrapper.emitted().updateFlowcell).toBeTruthy()
      expect(wrapper.emitted().updateFlowcell[0][0]).toEqual(flowcellPosition)
      expect(wrapper.emitted().updateFlowcell[0][1]).toEqual(libraryName)

      expect(wrapper.emitted().updateLibraryList).toBeTruthy()
      expect(wrapper.emitted().updateLibraryList[0][0]).toEqual(libraryName)
      expect(wrapper.emitted().updateLibraryList[0][1]).toEqual(assignToFlowcell)
    })
  })

  describe('#allowDrop', () => {
    it('sets hover to true', () => {
      let mockEvent = { preventDefault: jest.fn() }
      dragHelper.allowDrop(mockEvent)
      expect(dragHelper.hover).toEqual(true)
    })
  })

  describe('#endDrop', () => {
    it('sets hover to false', () => {
      let mockEvent = { preventDefault: jest.fn() }
      dragHelper.endDrop(mockEvent)
      expect(dragHelper.hover).toEqual(false)
    })
  })

})
