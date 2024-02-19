import Well from '@/components/plates/WellItem'
import { mount } from '@support/testHelper'

describe('Well.vue', () => {
  let well, wrapper, props

  beforeEach(() => {
    props = {
      row: 'A',
      column: '1',
      cx: '60.440327',
      cy: '75.818642',
      rx: '10.906492',
      ry: '11.032985',
      well_info: {
        position: 'A1',
        requests: [{ sample_name: 'SampleName1' }, { sample_name: 'SampleName2' }],
      },
    }

    wrapper = mount(Well, {
      props,
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
    const ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })

  describe('#tooltip', () => {
    it('will display the requests name', () => {
      const title = wrapper.find('title')
      const expected = wrapper.vm.tooltip
      expect(title.text()).toEqual(expected)
    })
  })

  describe('#getRequest', () => {
    it('will return true if the well has requests', () => {
      expect(well.getRequest).toEqual(true)
    })

    it('will return false if the well doesnt not have any requests', () => {
      props['well_info'] = { position: 'A1', requests: [] }

      wrapper = mount(Well, {
        props,
      })

      expect(wrapper.vm.getRequest).toEqual(false)
    })
  })
})
