import OntWell from '@/components/ont/OntWell'
import { mount } from 'testHelper'

describe('OntWell.vue', () => {
  let well, wrapper, props

  beforeEach(() => {
    props = {
      row: 'A',
      column: '1',
      cx: '60.440327',
      cy: '75.818642',
      rx: '10.906492',
      ry: '11.032985',
      well_info: { position: 'A1', materials: [{ name: 'SampleName1' }, { name: 'SampleName2' }] },
    }

    wrapper = mount(OntWell, {
      propsData: props,
    })

    well = wrapper.vm
  })

  describe('props', () => {
    it('must have a row', () => {
      expect(well.row).toEqual(props.row)
    })

    it('must have a column', () => {
      expect(well.column).toEqual(props.column)
    })

    it('must have a cx', () => {
      expect(well.cx).toEqual(props.cx)
    })

    it('must have a cy', () => {
      expect(well.cy).toEqual(props.cy)
    })

    it('must have a rx', () => {
      expect(well.rx).toEqual(props.rx)
    })

    it('must have a ry', () => {
      expect(well.ry).toEqual(props.ry)
    })

    it('will have well info', () => {
      expect(well.well_info).toEqual(props.well_info)
    })
  })

  it('will have an ellipse with the correct attributes', () => {
    let ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })

  describe('#status', () => {
    it('will be filled if the well has materials', () => {
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('filled')
    })

    it('will be empty the well does not have material', () => {
      props['well_info'] = { position: 'A1', materials: [] }

      wrapper = mount(OntWell, {
        propsData: props,
      })

      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('empty')
    })
  })

  describe('#tooltip', () => {
    it('will display the materials requests name', () => {
      let title = wrapper.find('title')
      let expected = well.well_info.materials.map((m) => m.name).join(', ')
      expect(title.text()).toEqual(expected)
    })
  })

  describe('#hasMaterial', () => {
    it('will return true if the well has materials', () => {
      expect(well.hasMaterial).toEqual(true)
    })

    it('will return false if the well doesnt not have any materials', () => {
      props['well_info'] = { position: 'A1', materials: [] }

      wrapper = mount(OntWell, {
        propsData: props,
      })

      expect(wrapper.vm.hasMaterial).toEqual(false)
    })
  })
})
