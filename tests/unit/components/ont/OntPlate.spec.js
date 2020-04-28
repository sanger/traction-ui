import Plate96SVG from '@/components/svg/Plate96SVG'
import OntPlate from '@/components/ont/OntPlate'
import OntWell from '@/components/ont/OntWell'
import PlateMap from '@/config/PlateMap'
import { localVue, mount } from '../../testHelper'

describe('OntPlate.vue', () => {
  let wrapper, plate, wellsData

  beforeEach(() => {
    wellsData = [
      {
        id: 1,
        position: 'A1',
        material: [
          { name: 'SampleName1' },
          { name: 'SampleName12' }
        ]
      },
      {
        id: 2,
        position: 'A7',
        material: [{
          name: 'SampleName2'
        }]
      }
    ]

    wrapper = mount(OntPlate, {
      localVue,
      propsData: { plate_id: 1 },
      stubs: {
        Plate96SVG: true,
        OntWell: true
      },
      data() {
        return {
          wells: wellsData
        }
      }
    })

    plate = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntPlate')
  })

  it('will be passed a plate id as a prop', () => {
    expect(plate.plate_id).toBeDefined()
  })

  describe('methods', () => {
    describe('#getWellAt', () => {
      it('gets the well at the given position', () => {
        let expected = wellsData.filter(w => w.position == 'A1')[0]
        expect(plate.getWellAt('A1')).toEqual(expected)
      })

      it('creates an empty well for the given position', () => {
        let expected = { position: 'A2', material: {} }
        expect(plate.getWellAt('A2')).toEqual(expected)
      })
    })
  })

  describe('components', () => {
    it('has a OntWell component', () => {
      expect(wrapper.contains(OntWell)).toBe(true)
    })

    it('has a Plate96SVG component', () => {
      expect(wrapper.contains(Plate96SVG)).toBe(true)
    })  
  })

  describe('SVG wells', () => {
    it('has the correct number of wells', () => {
      let ellipses = wrapper.findAll(OntWell)
      expect(ellipses.length).toEqual(Object.keys(PlateMap.wells).length)
    })
  })
})