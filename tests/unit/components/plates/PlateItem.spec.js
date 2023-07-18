import Plate from '@/components/plates/PlateItem'
import PlateMap from '@/config/PlateMap'
import { localVue, mount } from '@support/testHelper'

describe('Plate.vue', () => {
  let wrapper, plate, mockPlate

  beforeEach(() => {
    mockPlate = {
      id: '3',
      barcode: 'DN1',
      created_at: '2023/01/20 11:48',
      wells: [
        {
          position: 'A1',
          requests: [
            {
              id: '1',
              library_type: 'library_type_1',
              estimate_of_gb_required: 100,
              number_of_smrt_cells: 3,
              cost_code: 'PSD1234',
              external_study_id: '58807c5e-c0af-4690-bec3-03a4ad93c888',
              sample_name: 'Sample48',
              barcode: null,
              sample_species: 'human',
              created_at: '2023/01/20 11:48',
              source_identifier: 'DN1:A1',
            },
          ],
        },
        {
          position: 'A2',
          requests: [],
        },
      ],
    }

    wrapper = mount(Plate, {
      localVue,
      props: { plate: mockPlate },
    })

    plate = wrapper.vm
  })

  it('will be passed a plate as a prop', () => {
    expect(plate.plate.id).toBeDefined()
    expect(plate.plate.barcode).toBeDefined()
  })

  describe('methods', () => {
    describe('#getWellAt', () => {
      it('gets the well at the given position when it exists and has a request', () => {
        const expected = plate.wells.find((w) => w.position == 'A1')
        expect(plate.getWellAt('A1')).toEqual(expected)
      })

      it('creates an empty well for the given position when a well exists but has no requests', () => {
        const expected = { position: 'A2', requests: [] }
        expect(plate.getWellAt('A2')).toEqual(expected)
      })

      it('creates an empty well for the given position when a well does not exist', () => {
        const expected = { position: 'A3', requests: [] }
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
      const ellipses = wrapper.findAllComponents({ ref: 'well' })
      expect(ellipses.length).toEqual(Object.keys(PlateMap.wells).length)
    })
  })
})
