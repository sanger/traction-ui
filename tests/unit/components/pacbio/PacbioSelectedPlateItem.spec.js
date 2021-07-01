import Plate from '@/components/pacbio/PacbioSelectedPlateItem'
import PlateMap from '@/config/PlateMap'
import Response from '@/api/Response'
import { localVue, mount, Data, store } from '../../testHelper'

describe('Plate.vue', () => {
  let wrapper, plate, mockPlates, mockWells

  beforeEach(() => {
    mockPlates = new Response(Data.PacbioPlates)._body.data
    mockWells = [
        {
            attributes: {
                position: "A1",
            },
            id: "1",
            relationships: {
                requests: {
                    data: [
                        {
                            type: "requests",
                            id: "1"
                        }
                    ]
                }
            },
            type: "wells"
        },
        {
            attributes: {
                position: "A2",
            },
            id: "2",
            type: "wells"
        }
    ]

    store.commit('traction/pacbio/poolCreate/populatePlates', mockPlates)
    store.commit('traction/pacbio/poolCreate/populateWells', mockWells)

    wrapper = mount(Plate, {
      localVue,
      propsData: { plateId: mockPlates[0].id },
      store,
      stubs: {
        Plate96SVG: true,
        Well: true,
      },
    })

    plate = wrapper.vm
  })

  it('will be passed a plate id as a prop', () => {
    expect(plate.plateId).toBeDefined()
  })

  describe('methods', () => {
    describe('#getWellAt', () => {
      it('gets the well id at the given position ', () => {
        let expected = mockWells.find((w) => w.attributes.position == 'A1').id
        expect(plate.getWellAt('A1')).toEqual(expected)
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
