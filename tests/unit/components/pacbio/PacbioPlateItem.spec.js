import PacbioPlateItem from '@/components/pacbio/PacbioPlateItem.vue'
import { mountWithStore } from '@support/testHelper.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import useRootStore from '@/stores'

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

describe('PacbioPlateItem.vue', () => {
  let wrapper, plate

  beforeEach(() => {
    const defaultState = {
      resources: {
        plates,
        wells,
      },
    }
    ;({ wrapper } = mountWithStore(PacbioPlateItem, {
      props: { ...plates['1'] },
      initialState: {
        pacbioPoolCreate: { ...defaultState },
      },
      createStore: () => usePacbioPoolCreateStore(),
    }))
    plate = wrapper.vm
  })

  it('will be passed a plate id as a prop', () => {
    expect(plate.id).toBeDefined()
  })
  it('will have some well data', () => {
    expect(plate.wellData).toEqual([wells[1], wells[2], wells[3]])
  })

  describe('computed', () => {
    describe('mappedWells', () => {
      it('merges mapWell and well at the given position ', () => {
        const mappedWell = plate.mappedWells
        const rootStore = useRootStore()
        expect(mappedWell[0]).toEqual({
          ...wells[1],
          ...rootStore.plateMap.wells['A1'],
          sourceId: '1',
        })
        expect(mappedWell[12]).toEqual({
          ...wells[2],
          ...rootStore.plateMap.wells['B1'],
          sourceId: '2',
        })
        expect(mappedWell[24]).toEqual({
          ...wells[3],
          ...rootStore.plateMap.wells['C1'],
          sourceId: '3',
        })
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
      const rootStore = useRootStore()
      const ellipses = wrapper.findAllComponents('[data-attribute="well"]')
      expect(ellipses.length).toEqual(Object.keys(rootStore.plateMap.wells).length)
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
