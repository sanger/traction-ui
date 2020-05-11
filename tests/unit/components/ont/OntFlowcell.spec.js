import OntFlowcell from '@/components/ont/OntFlowcell'
import { mount } from '../../testHelper'

describe('OntFlowcell.vue', () => {

  let flowcell, wrapper, props

  beforeEach(() => {
    props = {
      xPos: 100,
      position: 1,
    }

    wrapper = mount(OntFlowcell, {
      propsData: props
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

  it('will have text with the correct position', () => {
    let ellipse = wrapper.find('text')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.text()).toEqual(flowcell.position.toString())
  })

  describe('#getMatrix', () => {
    it('will return the flowcells position matrix', () => {
      let expected = 'matrix(1,0,0,1,100,135)'
      expect(flowcell.getMatrix).toEqual(expected)
    })
  })

  it('has a Library Barcode input', () => {
    expect(wrapper.find('#library_barcode')).toBeDefined()
  })
})