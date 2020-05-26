import OntFlowcell from '@/components/ont/OntFlowcell'
import { mount } from '../../testHelper'

describe('OntFlowcell.vue', () => {

  let flowcell, wrapper, props, mutate

  beforeEach(() => {
    props = {
      xPos: 100,
      position: 1,
    }

    mutate = jest.fn()

    wrapper = mount(OntFlowcell, {
      propsData: props,
      stubs: {
        'b-form-input': true
      },
      mocks: {
        $apollo: {
          mutate: mutate
        }
      },
      
    })

    flowcell = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntFlowcell')
  })

  describe('props', () => {
    it('must have a xPos', () => {
      expect(flowcell.xPos).toEqual(props.xPos)
    })

    it('must have a position', () => {
      expect(flowcell.position).toEqual(props.position)
    })
  })

  describe('flowcell', () => {
    it('will have text with the correct position', () => {
      let positionText = wrapper.find('text')
      expect(positionText.exists()).toBeTruthy()
      expect(positionText.text()).toEqual(flowcell.position.toString())
    })

    describe('with libraryName', () => {
      beforeEach(() => { 
        flowcell.libraryName = 'aLibraryName' 
      })

      it('will will have an filled status', () => {
        let flowcellRect = wrapper.find('rect')
        expect(flowcellRect.exists()).toBeTruthy()
        expect(flowcellRect.attributes('class')).toEqual('filled')
      })

      it('will have a title with the libraryName', () => {
        let libraryText = wrapper.find('title')
        expect(libraryText.exists()).toBeTruthy()
        expect(libraryText.text()).toEqual(flowcell.libraryName)
      })
    })

    describe('without libraryName', () => {
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

  describe('#updateFlowcell', () => {
    it('calls the mutation', () => {
      flowcell.updateFlowcell()
      expect(mutate).toBeCalled() 
    })
  })

  describe('#drop', () => {
    let mockEvent, libraryName

    beforeEach(() => {
      libraryName = 'TRAC-1'
      mockEvent = { dataTransfer: { getData() { return libraryName } }, preventDefault: jest.fn() }
      flowcell.updateFlowcell = jest.fn()
    })

    it('will update the barcode', async () => {
      flowcell.drop(mockEvent)
      expect(flowcell.libraryName).toEqual(libraryName)
      expect(flowcell.updateFlowcell).toBeCalled()
    })
  })

  describe('#getMatrix', () => {
    it('will return the flowcells position matrix', () => {
      let expected = 'matrix(1,0,0,1,100,135)'
      expect(flowcell.getMatrix).toEqual(expected)
    })
  })

  describe('#status', () => {
    it('will return filled when flowcell has a libraryName', () => {
      wrapper.setData({ libraryName: 'aLibraryName'})
      expect(flowcell.status).toEqual('filled')
    })

    it('will return filled when flowcell has a libraryName', () => {
      expect(flowcell.status).toEqual('empty')
    })
  })
})