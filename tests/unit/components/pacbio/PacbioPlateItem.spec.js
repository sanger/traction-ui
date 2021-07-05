import Plate from '@/components/pacbio/PacbioPlateItem'
import { localVue, mount, Data, store } from 'testHelper'

const plates = {
  '1': {
    barcode: 'DN1',
    id: '1',
    type: 'plates',
    wells: ["1", "2", "3"],
  }
}

const wells = {
  '1': { id: '1', position: 'A1' },
  '2': { id: '2', position: 'B1' },
  '3': { id: '3', position: 'C1' },
  '4': { id: '4', position: 'D1' },
  '5': { id: '5', position: 'E1' },
}

describe('Plate.vue', () => {
  let wrapper, plate

  beforeEach(() => {
    store.state.traction.pacbio.poolCreate.resources.plates = plates
    store.state.traction.pacbio.poolCreate.resources.wells = wells
   
    wrapper = mount(Plate, {
      localVue,
      propsData: { ...plates['1'] },
      store,
      stubs: {
        Plate96SVG: true,
        Well: true,
      },
    })

    plate = wrapper.vm
  })

  it('will be passed a plate id as a prop', () => {
    expect(plate.id).toBeDefined()
  })

  describe.skip('methods', () => {
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
      expect(ellipses.length).toEqual(Object.keys(store.state.plateMap.wells).length)
    })
  })
})
