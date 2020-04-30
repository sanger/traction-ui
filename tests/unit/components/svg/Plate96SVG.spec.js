import { mount } from '../../testHelper'
import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'

describe('Plate96SVG.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Plate96SVG, {
      propsData: {
        height: "100%",
        width: "100%"
      },
    })
  })

  describe('props', () => {
    it('has a height property', () => {
      expect(wrapper.props().height).toBeDefined()
    })
    it('has a height property', () => {
      expect(wrapper.props().width).toBeDefined()
    })
  })

  describe('SVG wells', () => {
    it('has the correct number of columns', () => {
      for (const column in PlateMap.columns) {
        expect(wrapper.find(`#column${column}`).exists()).toBeTruthy()
      }
    })

    it('has the correct number of rows', () => {
      for (const row in PlateMap.rows) {
        expect(wrapper.find(`#row${row}`).exists()).toBeTruthy()
      }
    })
  })
})