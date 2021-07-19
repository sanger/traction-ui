import OntFlowcell from '@/components/ont/OntFlowcell'
import { localVue, mount } from 'testHelper'

describe('OntFlowcell.vue', () => {
  let flowcell, wrapper, props, mutate

  beforeEach(() => {
    props = {
      position: 1,
      library: { name: 'aLibraryName' },
    }

    mutate = jest.fn()

    wrapper = mount(OntFlowcell, {
      localVue,
      propsData: props,
      stubs: {
        'b-form-input': true,
      },
      mocks: {
        $apollo: {
          mutate: mutate,
        },
      },
    })

    flowcell = wrapper.vm
  })

  it('will have an element id', () => {
    expect(flowcell.elementId).toEqual('libraryNameInput-1')
  })

  describe('props', () => {
    it('must have a position', () => {
      expect(flowcell.position).toBeDefined()
      expect(flowcell.position).toEqual(props.position)
    })
    it('must have a library', () => {
      expect(flowcell.library).toBeDefined()
      expect(flowcell.library).toEqual(props.library)
    })
  })

  describe('flowcell', () => {
    it('will have text with the correct position', () => {
      let positionText = wrapper.find('text')
      expect(positionText.exists()).toBeTruthy()
      expect(positionText.text()).toEqual(flowcell.position.toString())
    })

    describe('with libraryName', () => {
      it('will will have an filled status', () => {
        let flowcellRect = wrapper.find('rect')
        expect(flowcellRect.exists()).toBeTruthy()
        expect(flowcellRect.attributes('class')).toEqual('filled')
      })

      it('will have a title with the libraryName', () => {
        let libraryText = wrapper.find('title')
        expect(libraryText.exists()).toBeTruthy()
        expect(libraryText.text()).toEqual(props.library.name)
      })
    })

    describe('without libraryName', () => {
      beforeEach(() => {
        wrapper.setProps({ library: {} })
      })

      it('will will have an empty status', () => {
        let flowcellRect = wrapper.find('rect')
        expect(flowcellRect.exists()).toBeTruthy()
        expect(flowcellRect.attributes('class')).toEqual('empty')
      })

      it('will have a title with an empty string', () => {
        let libraryText = wrapper.find('title')
        expect(libraryText.exists()).toBeTruthy()
        expect(libraryText.text()).toEqual('')
      })
    })
  })

  describe('#drop', () => {
    let mockEvent, libraryName

    beforeEach(() => {
      libraryName = 'TRAC-1'

      flowcell.updateFlowcell = jest.fn()
      flowcell.updateLibraryList = jest.fn()
    })

    describe('when the sourceType is LIBRARY_LIST', () => {
      beforeEach(() => {
        let getData = jest
          .fn()
          .mockImplementationOnce(() => libraryName)
          .mockImplementation(() => 'LIBRARY_LIST')

        mockEvent = {
          dataTransfer: {
            getData() {
              return getData()
            },
          },
          preventDefault: jest.fn(),
        }
      })

      it('will call updateFlowcell', () => {
        flowcell.drop(mockEvent)
        expect(flowcell.updateFlowcell).toBeCalledWith(flowcell.position, libraryName)
      })

      it('will call updateLibraryList', () => {
        flowcell.drop(mockEvent)
        expect(flowcell.updateLibraryList).toBeCalledWith(libraryName, true)
      })
    })

    describe('when the sourceType is FLOWCELL', () => {
      let flowcellPosition

      beforeEach(() => {
        flowcellPosition = 1

        let getData = jest
          .fn()
          .mockImplementationOnce(() => 'TRAC-1')
          .mockImplementationOnce(() => 'FLOWCELL')
          .mockImplementation(() => flowcellPosition)

        mockEvent = {
          dataTransfer: {
            getData() {
              return getData()
            },
          },
          preventDefault: jest.fn(),
        }
      })

      it('will call updateFlowcell', () => {
        flowcell.drop(mockEvent)
        expect(flowcell.updateFlowcell).toBeCalledWith(flowcell.position, libraryName)
      })

      it('will call updateFlowcell again', () => {
        flowcell.drop(mockEvent)
        expect(flowcell.updateFlowcell).toBeCalledWith(flowcellPosition, '')
      })
    })

    it('will change the status and show the image', () => {
      flowcell.drop(mockEvent)
      expect(flowcell.status).toEqual('filled')
      expect(flowcell.hover).toBeFalsy()
    })
  })

  describe('#drag', () => {
    let mockEvent

    beforeEach(() => {
      mockEvent = {
        dataTransfer: { setData: jest.fn(), setDragImage: jest.fn() },
        preventDefault: jest.fn(),
      }
    })

    it('will set the drag image and set the data', () => {
      flowcell.drag(mockEvent)
      expect(mockEvent.dataTransfer.setDragImage).toBeCalled()
      expect(mockEvent.dataTransfer.setData).toBeCalledWith('flowcellPosition', flowcell.position)
      expect(mockEvent.dataTransfer.setData).toBeCalledWith('libraryName', flowcell.library.name)
    })

    it('will set the sourceType of the drag', () => {
      flowcell.drag(mockEvent)
      expect(mockEvent.dataTransfer.setData).toBeCalledWith('sourceType', 'FLOWCELL')
    })
  })

  describe('#getMatrix', () => {
    it('will return the flowcells position matrix', () => {
      let xPos = (props.position - 1) * 80 + 240
      let expected = `matrix(1,0,0,1,${xPos},135)`
      expect(flowcell.getMatrix).toEqual(expected)
    })
  })

  describe('#status', () => {
    it('will return "filled" when flowcell has a libraryName', () => {
      expect(flowcell.status).toEqual('filled')
    })

    it('will return "empty" when flowcell has no library', async () => {
      await wrapper.setProps({ library: {} })
      expect(flowcell.status).toEqual('empty')
    })
  })
})
