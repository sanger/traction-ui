import { mount, localVue } from '../../testHelper'
import OntTube from '@/components/ont/OntTube'

describe('OntTube.vue', () => {

  let tube, wrapper, props

  beforeEach(() => {
    props = { name: 'TRAC-1-1' }

    wrapper = mount(OntTube, {
      localVue,
      propsData: props
    })

    tube = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntTube')
  })

  describe('props', () => {
    it('must have a name', () => {
      expect(tube.name).toEqual(props.name)
      expect(wrapper.find('.name').text()).toEqual(props.name)
    })
  })

  describe('data', () => {
    it('has isActive', () => {
      wrapper.setData({ isActive: true })
      expect(tube.isActive).toBe(true)
    })
  })

  describe('#drag', () => {
    let mockEvent, libraryName, setData

    beforeEach(() => {
      libraryName = 'TRAC-1'
      setData = jest.fn()
      mockEvent = { dataTransfer: { setDragImage: jest.fn(), setData: setData } } 
    })

    it('will update the barcode', async () => {
      tube.drag(libraryName, mockEvent)
      expect(setData).toBeCalledWith('name', libraryName)
    })
  })

})
