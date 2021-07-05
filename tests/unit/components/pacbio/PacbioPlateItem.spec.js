import Plate from '@/components/pacbio/PacbioPlateItem'
import { localVue, mount, store } from 'testHelper'

const plates = {
  '1': {
    barcode: 'DN1',
    id: '1',
    type: 'plates',
    wells: ['1', '2', '3'],
  },
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

  it('will have a plate map', () => {
    expect(plate.plateMap).toBeDefined()
  })

  it('will have some well data', () => {
    expect(plate.wellData).toEqual([wells[1], wells[2], wells[3]])
  })

  describe('methods', () => {
    describe('#getWellAt', () => {
      it('merges mapWell and well at the given position ', () => {
        let mapWell = plate.plateMap.wells['A1']
        let well = plate.wellData.find((w) => w.position == 'A1')
        let expected = { ...mapWell, ...well }
        expect(plate.getWellAt(mapWell, 'A1')).toEqual(expected)
      })

      it('returns just the mapWell if no well has the positiion', () => {
        let mapWell = plate.plateMap.wells['A10']
        expect(plate.getWellAt(mapWell, 'A10')).toEqual(mapWell)
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
