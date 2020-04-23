import OntPlate from '@/components/ont/OntPlate'
import Plate384SVG from '@/components/svg/Plate384SVG'
import OntWell from '@/components/ont/OntWell'
import PlateMap from '@/config/PlateMap'
import { localVue, mount } from '../../testHelper'

describe('OntPlate.vue', () => {
  let wrapper, plate, wells

  beforeEach(() => {
    wrapper = mount(OntPlate, { 
      localVue,
      propsData: { plate_id: 1 },
      stubs: {
        Plate384SVG: true,
        OntWell: true
      }
    })

    wells = [
      {
        position: 'A1',
        material: [
          { name: 'SampleName1' },
          { name: 'SampleName12' }
        ]
      },
      {
        position: 'A7',
        material: [{
          name: 'SampleName2'
        }]
      }
    ]

    plate = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntPlate')
  })

  it('will be passed a plate id as a prop', () => {
    expect(plate.plate_id).toBeDefined()
  })

  describe('methods', () => {
    // Need to mock apollo wells
    describe.skip('#getWellAt', () => {
      it('gets the well at the given position', () => {
        expect(plate.getWellAt('A1')).toEqual(wells[0])
      })
    })

    describe('#createEmptyWell', () => {
      it('creates an empty well for the given position', () => {
        let expected = { position: 'A1', material: {} }
        expect(plate.createEmptyWell('A1')).toEqual(expected)
      })
    })
  })

  // Need to mock apollo wells
  describe.skip('components', () => {
    it('has a OntWell component', () => {
      expect(wrapper.contains(OntWell)).toBe(true)
    })

    it('has a Plate384SVG component', () => {
      expect(wrapper.contains(Plate384SVG)).toBe(true)
    })
  })

  // Need to mock apollo wells
  describe.skip('apollo', () => {
    it('gets the wells for a given plate id', () => {
      const query = jest.fn()
      query.mockResolvedValue([{id: 1, position: ''}])

      wrapper = mount(OntPlate, {
        localVue,
        stubs: {
          OntPlate: true
        },
        mocks: {
          $apollo: {
            queries: {
              wells: {
                query
              }
            }
          }
        },
      })
      plate = wrapper.vm
      expect(plate.$apollo.queries.wells.query).toBeCalled()
    })
  })

  // Need to mock apollo wells
  describe.skip('SVG wells', () => {
    it('has the correct number of wells', () => {
      let ellipses = wrapper.findAll('ellipse')
      expect(ellipses.length).toEqual(Object.keys(PlateMap.wells).length)
    })
  })
})