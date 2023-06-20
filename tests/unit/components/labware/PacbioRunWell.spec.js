import PacbioRunWell from '@/components/labware/PacbioRunWell'
import { localVue, mount, store } from '@support/testHelper'
import storePools from '@tests/data/StorePools'

describe('PacbioRunWell.vue', () => {
  let well, wrapper, props, storeWell, smrtLinkVersion

  const smrtLinkVersions = {
    1: { id: 1, name: 'v11', default: true },
    2: { id: 2, name: 'v12_revio', default: false },
  }

  const PLATE_INDEX = 0

  beforeEach(() => {
    props = {
      position: 'A1',
      interactive: true,
    }

    smrtLinkVersion = smrtLinkVersions['1']
    storeWell = {
      position: 'A1',
      pools: ['1', '2'],
      on_plate_loading_concentration: 234,
      movie_time: 15,
      generate_hifi: 'In SMRT Link',
      binding_kit_box_barcode: '12345',
      movie_acquisition_time: 123,
      include_base_kinetics: 'Yes',
      library_concentration: 123,
      polymerase_kit: '123',
      pre_extension_time: 1,
    }

    store.state.traction.pacbio.runCreate = {
      run: { plates: [{ wells: { A1: storeWell } }] },
      ...storePools,
      smrtLinkVersion,
      resources: { smrtLinkVersions },
    }

    wrapper = mount(PacbioRunWell, {
      localVue,
      store,
      propsData: props,
      stubs: {
        WellModal: true,
      },
    })

    well = wrapper.vm
  })

  it('must have a position', () => {
    expect(well.position).toEqual(props.position)
  })

  it('can have an interactive prop', () => {
    expect(well.interactive).toEqual(props.interactive)
  })

  describe('status', () => {
    describe('for smrtlink v11', () => {
      it('will be valid if it is complete', () => {
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-green-200 text-black')
      })

      it('will be invalid if there is any missing meta data', () => {
        storeWell.movie_time = ''
        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-red-200 text-black')
      })

      it('will be invalid if there are no pools in the store', () => {
        storeWell.pools = []
        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-red-200 text-black')
      })

      it('will be valid if all required metadata is present', () => {
        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-green-200 text-black')
      })

      it('will be empty if there are no pools or metadata', () => {
        storeWell.pools = []
        storeWell.movie_time = ''
        storeWell.generate_hifi = ''
        storeWell.ccs_analysis_output = ''
        storeWell.on_plate_loading_concentration = ''
        storeWell.pre_extension_time = ''
        storeWell.binding_kit_box_barcode = ''

        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })

        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-gray-100 text-black')
      })
    })

    describe('for smrtlink v12_revio', () => {
      beforeEach(() => {
        store.state.traction.pacbio.runCreate.smrtLinkVersion = smrtLinkVersions['2']
      })

      it('will be valid if it is complete', () => {
        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })

        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-green-200 text-black')
      })

      it('will be invalid if there is any missing meta data', () => {
        storeWell.movie_acquisition_time = ''
        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-red-200 text-black')
      })

      it('will be invalid if there are no pools in the store', () => {
        storeWell.pools = []
        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-red-200 text-black')
      })

      it('will be valid if all required metadata is present', () => {
        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-green-200 text-black')
      })

      it('will be empty if there are no pools or metadata', () => {
        storeWell.pools = []
        storeWell.movie_acquisition_time = ''
        storeWell.polymerase_kit = ''
        storeWell.pre_extension_time = ''
        storeWell.library_concentration = ''
        storeWell.include_base_kinetics = ''

        wrapper = mount(PacbioRunWell, {
          localVue,
          store,
          propsData: props,
          stubs: {
            WellModal: true,
          },
        })

        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-gray-100 text-black')
      })
    })
  })

  describe('updatePoolBarcode', () => {
    let expectedWell
    const newBarcode = 'TRAC-2-1'

    it('adds the pool to the well', async () => {
      wrapper.vm.updateWell = vi.fn()
      expectedWell = storeWell
      expectedWell.pools.push('1')

      await wrapper.vm.updatePoolBarcode(newBarcode)
      expect(wrapper.vm.updateWell).toBeCalledWith({ well: expectedWell, plateIndex: PLATE_INDEX })
    })
  })

  describe('tooltip', () => {
    it('will only be visible if there are some pools', async () => {
      await wrapper.setData({ hover: true })
      const tooltip = wrapper.find('[data-attribute=tooltip]')
      // Barcodes of the tubes the store pools relate to
      const expected = 'TRAC-2-1,TRAC-2-2'
      expect(tooltip.text()).toEqual(expected)
    })
  })

  describe('drag and drop', () => {
    let mockEvent, newBarcode

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      mockEvent = {
        dataTransfer: {
          getData() {
            return newBarcode
          },
        },
        preventDefault: vi.fn(),
      }
      well.updatePoolBarcode = vi.fn()
    })

    it('will update the barcode', async () => {
      well.drop(mockEvent)
      expect(well.updatePoolBarcode).toBeCalledWith(newBarcode)
    })
  })
})
