import { mount } from '../../testHelper'
import Plate384SVG from '@/components/svg/Plate384SVG'
import PlateMap from '@/config/PlateMap'

describe('Plate384SVG.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Plate384SVG, {
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