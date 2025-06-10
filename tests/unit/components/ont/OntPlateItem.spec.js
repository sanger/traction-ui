import OntPlateItem from '@/components/ont/OntPlateItem.vue'
import { mountWithStore } from '@support/testHelper.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
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

describe('OntPlateItem.vue', () => {
  let wrapper, plate

  beforeEach(() => {
    const defaultState = {
      resources: {
        plates,
        wells,
      },
    }

    // wrapper = mountWithStore(OntPlateItem, {
    //   props: { ...plates['1'] },
    //   store,
    //   stubs: {
    //     Plate96SVG: true,
    //     Well: true,
    //   },
    // })
    ;({ wrapper } = mountWithStore(OntPlateItem, {
      props: { ...plates['1'] },
      initialState: {
        ontPoolCreate: { ...defaultState },
      },
      createStore: () => useOntPoolCreateStore(),
    }))

    plate = wrapper.vm
  })

  it('will have some well data', () => {
    expect(plate.wellData).toEqual([wells[1], wells[2], wells[3]])
  })

  describe('methods', () => {
    describe('#getWellAt', () => {
      it('merges mapWell and well at the given position ', () => {
        const rootStore = useRootStore()
        const mapWell = rootStore.plateMap.wells['A1']
        expect(plate.getWellAt(mapWell, 'A1').id).toEqual('1')
      })

      it('returns just the mapWell if no well has the positiion', () => {
        const rootStore = useRootStore()
        const mapWell = rootStore.plateMap.wells['A10']
        expect(plate.getWellAt(mapWell, 'A10')).toEqual(mapWell)
      })
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
