import Plate from '@/components/pacbio/V1/PacbioPlateItemV1.vue'
import { mount, store } from '@support/testHelper.js'

const plates = {
  1: {
    barcode: 'DN1',
    id: '1',
    type: 'plates',
    wells: ['1', '2', '3'],
  },
}

const wells = {
  1: { id: '1', position: 'A1' },
  2: { id: '2', position: 'B1' },
  3: { id: '3', position: 'C1' },
  4: { id: '4', position: 'D1' },
  5: { id: '5', position: 'E1' },
}

describe('Plate.vue', () => {
  let wrapper, plate

  beforeEach(() => {
    store.state.traction.pacbio.poolCreate.resources.plates = plates
    store.state.traction.pacbio.poolCreate.resources.wells = wells

    wrapper = mount(Plate, {
      props: { ...plates['1'] },
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
        const mapWell = plate.plateMap.wells['A1']
        expect(plate.getWellAt(mapWell, 'A1').id).toEqual('1')
      })

      it('returns just the mapWell if no well has the positiion', () => {
        const mapWell = plate.plateMap.wells['A10']
        expect(plate.getWellAt(mapWell, 'A10')).toEqual(mapWell)
      })
    })
  })

  describe('components', () => {
    it('has a Well component', () => {
      expect(wrapper.findComponent('[data-attribute="well"]')).toBeTruthy()
    })

    it('has a Plate96SVG component', () => {
      expect(wrapper.findComponent('[data-attribute="plate96svg"]')).toBeTruthy()
    })
  })

  describe('SVG wells', () => {
    it('has the correct number of wells', () => {
      const ellipses = wrapper.findAllComponents('[data-attribute="well"]')
      expect(ellipses.length).toEqual(Object.keys(store.state.plateMap.wells).length)
    })
  })

  describe('well@click', () => {
    it('emits a clickWell event with the well id', async () => {
      const well = wrapper.findComponent('[data-attribute="well"]')
      await well.vm.$emit('click')
      expect(wrapper.emitted().clickWell.length).toBe(1)
      expect(wrapper.emitted().clickWell[0]).toEqual(['1'])
    })
  })
})
