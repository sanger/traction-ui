import OntPlate from '@/components/ont/OntPlate'
import PlateMap from '@/config/PlateMap'
import { localVue, mount } from 'testHelper'

describe('OntPlate.vue', () => {
  let wrapper, plate, wellsData, mutate

  beforeEach(() => {
    wellsData = [
      {
        id: 1,
        position: 'A1',
        materials: [{ sample: { name: 'SampleName1' } }, { sample: { name: 'SampleName2' } }],
      },
      {
        id: 2,
        position: 'A7',
        materials: [
          {
            sample: {
              name: 'SampleName2',
            },
          },
        ],
      },
    ]

    mutate = jest.fn()

    wrapper = mount(OntPlate, {
      localVue,
      propsData: { plate: { id: 1, barcode: 'TRAC-1-1' } },
      stubs: {
        Plate96SVG: true,
        OntWell: true,
      },
      data() {
        return {
          wells: wellsData,
        }
      },
      mocks: {
        $apollo: {
          mutate: mutate,
        },
      },
    })

    plate = wrapper.vm
  })

  it('will be passed a plate as a prop, with an id and barcode', () => {
    expect(plate.plate.id).toBeDefined()
    expect(plate.plate.barcode).toBeDefined()
  })

  describe('methods', () => {
    describe('#getWellAt', () => {
      it('gets the well at the given position', () => {
        let expected = wellsData.find((w) => w.position == 'A1')
        expect(plate.getWellAt('A1')).toEqual(expected)
      })

      it('creates an empty well for the given position', () => {
        let expected = { position: 'A2', materials: [] }
        expect(plate.getWellAt('A2')).toEqual(expected)
      })
    })
  })

  describe('components', () => {
    it('has a OntWell component', () => {
      expect(wrapper.findComponent({ ref: 'ontWell' })).toBeTruthy()
    })

    it('has a Plate96SVG component', () => {
      expect(wrapper.findComponent({ ref: 'plate96Svg' })).toBeTruthy()
    })
  })

  describe('SVG wells', () => {
    it('has the correct number of wells', () => {
      let ellipses = wrapper.findAllComponents({ ref: 'ontWell' })
      expect(ellipses.length).toEqual(Object.keys(PlateMap.wells).length)
    })
  })

  describe('Pool Samples button', () => {
    it('is shows button', () => {
      let button = wrapper.find('#pool-btn-TRAC-1-1')
      expect(button.text()).toEqual('Pool Samples')
    })

    it('shows an alert on success', async () => {
      let mockResponse = {
        data: {
          createOntLibraries: {
            tubes: [
              {
                barcode: 'TRAC-1-1',
                materials: [{ name: 'DEMO-PLATE-1-1' }, { name: 'DEMO-PLATE-3-1' }],
              },
              { barcode: 'TRAC-1-2', materials: [{ name: 'DEMO-PLATE-2-1' }] },
            ],
            errors: [],
          },
        },
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      let button = wrapper.find('#pool-btn-TRAC-1-1')
      await button.trigger('click')

      expect(mutate).toBeCalled()
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual(
        'Library(s) were created with names: DEMO-PLATE-1-1, DEMO-PLATE-3-1, DEMO-PLATE-2-1',
      )
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })

    it('shows an alert on failure', async () => {
      let mockResponse = {
        data: { createOntLibraries: { tubes: [], errors: ['this is an error'] } },
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      let button = wrapper.find('#pool-btn-TRAC-1-1')
      await button.trigger('click')

      expect(mutate).toBeCalled()
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('Failure: this is an error')
      expect(wrapper.emitted().alert[0][1]).toEqual('danger')
    })
  })
})
