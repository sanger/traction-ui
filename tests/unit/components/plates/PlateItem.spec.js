import Plate from '@/components/plates/PlateItem'
import PlateMap from '@/config/PlateMap'
import Response from '@/api/Response'
import { localVue, mount, Data } from '../../testHelper'

describe('Plate.vue', () => {
  let wrapper, plate, mockPlate

  beforeEach(() => {
    mockPlate = new Response(Data.PacbioPlates).deserialize.plates[0]

    wrapper = mount(Plate, {
      localVue,
      propsData: { plate: mockPlate },
      stubs: {
        Plate96SVG: true,
        Well: true,
      },
    })

    plate = wrapper.vm
  })

  it('will be passed a plate as a prop', () => {
    expect(plate.plate.id).toBeDefined()
    expect(plate.plate.barcode).toBeDefined()
  })

  describe('methods', () => {
    describe('#getWellAt', () => {
      it('gets the well at the given position', () => {
        let expected = plate.wells.filter((w) => w.position == 'A1')[0]
        expect(plate.getWellAt('A1')).toEqual(expected)
      })

      it('creates an empty well for the given position', () => {
        let expected = { position: 'A3', materials: [] }
        expect(plate.getWellAt('A3')).toEqual(expected)
      })
    })
  })

  describe('components', () => {
    it('has a Well component', () => {
      expect(wrapper.findComponent({ ref: 'well' })).toBeTruthy()
    })

    it('has a Plate96SVG component', () => {
      expect(wrapper.findComponent({ ref: 'plate96Svg' })).toBeTruthy()
    })
  })

  describe('SVG wells', () => {
    it('has the correct number of wells', () => {
      let ellipses = wrapper.findAllComponents({ ref: 'well' })
      expect(ellipses.length).toEqual(Object.keys(PlateMap.wells).length)
    })
  })
})
