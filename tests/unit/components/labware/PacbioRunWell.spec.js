import PacbioRunWell from '@/components/labware/PacbioRunWell.vue'
import { mount, createTestingPinia } from '@support/testHelper'
import storePools from '@tests/data/StoreRunPools.json'
import { newPlate } from '@/stores/utilities/run.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { beforeEach } from 'vitest'

const storeWell = {
  position: 'A1',
  used_aliquots: ['1', '2', '3'],
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
const usedAliquots = {
  1: { id: '1', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '12' },
  2: { id: '2', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '14' },
  3: { id: '3', type: 'aliquots', source_type: 'Pacbio::Library', source_id: '30' },
}
const props = {
  position: 'A1',
  plateNumber: 1,
  interactive: true,
}
const smrtLinkVersions = {
  1: { id: 1, name: 'v11', default: true, active: true },
  2: { id: 2, name: 'v12_revio', default: false, active: true },
}

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given 'options'.
 * 'options' allows to define initial state of store while instantiating the component.
 *
 * @param {*} options - options to be passed to the createTestingPinia method for creating a mock instance of pinia
 * options type is
 * {state :{},stubActions: boolean, plugins:[]}
 *
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [] } = {}) {
  const defaultOptions = {
    run: {},
    plates: { 1: newPlate(1) },
    wells: { 1: { A1: storeWell } },
    ...storePools,
    aliquots: { ...usedAliquots, ...storePools.aliquots },
    smrtLinkVersion: smrtLinkVersions['1'],
    resources: { smrtLinkVersions },
  }
  const wrapperObj = mount(PacbioRunWell, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRunCreate: { ...defaultOptions, ...state },
          },
          stubActions,
          plugins,
        }),
      ],
      stubs: {
        WellModal: true,
      },
    },
    props,
  })
  usePacbioRunCreateStore()
  return { wrapperObj }
}

describe('PacbioRunWell.vue', () => {
  let well, wrapper

  beforeEach(() => {
    const { wrapperObj } = mountWithStore()
    wrapper = wrapperObj
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
        expect(well.attributes('class')).toContain('bg-success text-white')
      })

      it('will be invalid if there is any missing meta data', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: { 1: { A1: { ...storeWell, movie_time: '' } } },
          },
        })
        const well = wrapperObj.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-failure text-white')
      })

      it('will be invalid if there are no pools or libraries in the store', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: { 1: { A1: { ...storeWell, used_aliquots: null } } },
          },
        })

        const well = wrapperObj.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-failure text-white')
      })

      it('will be valid if all required metadata is present', () => {
        const { wrapperObj } = mountWithStore()
        const well = wrapperObj.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-success text-white')
      })

      it('will be empty if there are no pools or metadata', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: {
              1: {
                A1: {
                  ...storeWell,
                  used_aliquots: null,
                  movie_time: '',
                  generate_hifi: '',
                  ccs_analysis_output: '',
                  on_plate_loading_concentration: '',
                  pre_extension_time: '',
                  binding_kit_box_barcode: '',
                },
              },
            },
          },
        })

        const well = wrapperObj.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-gray-100 text-black')
      })
    })

    describe('for smrtlink v12_revio', () => {
      beforeEach(() => {
        const { wrapperObj } = mountWithStore({ smrtLinkVersion: smrtLinkVersions['2'] })
        wrapper = wrapperObj
      })
      it('will be valid if it is complete', () => {
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-success text-white')
      })

      it('will be invalid if there is any missing meta data', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            smrtLinkVersion: smrtLinkVersions['2'],
            wells: { 1: { A1: { ...storeWell, movie_acquisition_time: '' } } },
          },
        })
        const well = wrapperObj.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-failure text-white')
      })

      it('will be invalid if there are no pools or libraries in the store', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: { 1: { A1: { ...storeWell, used_aliquots: null } } },
            smrtLinkVersion: smrtLinkVersions['2'],
          },
        })
        const well = wrapperObj.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-failure text-white')
      })

      it('will be valid if all required metadata is present', () => {
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-success text-white')
      })

      it('will be empty if there are no pools, libraries or metadata', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: {
              1: {
                A1: {
                  ...storeWell,
                  used_aliquots: null,
                  movie_acquisition_time: '',
                  polymerase_kit: '',
                  pre_extension_time: '',
                  library_concentration: '',
                  include_base_kinetics: '',
                },
              },
            },
            smrtLinkVersion: smrtLinkVersions['2'],
          },
        })
        const well = wrapperObj.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-gray-100 text-black')
      })
    })
  })

  // TRAC-2-20 - libraries - 30
  // TRAC-2-22 - pools - 12
  // TRAC-2-24 - pools - 14

  describe('updatePoolLibraryBarcode', () => {
    let expectedWell

    it('adds the pool to the well', async () => {
      const newBarcode = 'TRAC-2-22'
      const updateWellMockFn = vi.fn()
      const { wrapperObj } = mountWithStore({
        state: {
          wells: {
            1: {
              A1: {
                ...storeWell,
                used_aliquots: null,
                pools: [],
                libraries: [],
              },
            },
          },
          ...storePools,
        },
        stubActions: false,
        plugins: [
          ({ store }) => {
            store.updateWell = updateWellMockFn
          },
        ],
      })
      expectedWell = { ...storeWell, used_aliquots: null, pools: [], libraries: [] }
      expectedWell.pools.push('12')
      await wrapperObj.vm.updatePoolLibraryBarcode(newBarcode)
      expect(updateWellMockFn).toBeCalledWith({
        well: expectedWell,
        plateNumber: props.plateNumber,
      })
    })

    it('adds the library to the well', async () => {
      const newBarcode = 'TRAC-2-20'
      const updateWellMockFn = vi.fn()
      const { wrapperObj } = mountWithStore({
        state: {
          wells: {
            1: {
              A1: {
                ...storeWell,
                used_aliquots: null,
                pools: [],
                libraries: [],
              },
            },
          },
          ...storePools,
        },
        stubActions: false,
        plugins: [
          ({ store }) => {
            store.updateWell = updateWellMockFn
          },
        ],
      })
      expectedWell = { ...storeWell, used_aliquots: null, pools: [], libraries: [] }
      expectedWell.libraries.push('30')
      await wrapperObj.vm.updatePoolLibraryBarcode(newBarcode)
      expect(updateWellMockFn).toBeCalledWith({
        well: expectedWell,
        plateNumber: props.plateNumber,
      })
    })
  })

  describe('tooltip', () => {
    it('will be visible if there are pools', async () => {
      const { wrapperObj } = mountWithStore({
        state: {
          wells: {
            1: {
              A1: {
                ...storeWell,
                used_aliquots: ['1', '2'],
              },
            },
          },
          ...storePools,
          aliquots: { ...usedAliquots, ...storePools.aliquots },
        },
      })

      await wrapperObj.setData({ hover: true })

      const tooltip = wrapperObj.find('[data-attribute=tooltip]')
      // Barcodes of the tubes the store pools relate to
      const expected = 'TRAC-2-22,TRAC-2-24'
      expect(tooltip.text()).toEqual(expected)
    })

    it('will be visible if there are libraries', async () => {
      const { wrapperObj } = mountWithStore({
        state: {
          wells: {
            1: {
              A1: {
                ...storeWell,
                used_aliquots: ['3'],
              },
            },
          },
          ...storePools,
          aliquots: { ...usedAliquots, ...storePools.aliquots },
        },
      })
      await wrapperObj.setData({ hover: true })

      const tooltip = wrapperObj.find('[data-attribute=tooltip]')
      // Barcodes of the tubes the store pools relate to
      const expected = 'TRAC-2-20'
      expect(tooltip.text()).toEqual(expected)
    })

    it('will be visible if there are pools and libraries', async () => {
      // storeWell.pools = ['12', '14']
      // storeWell.libraries = ['30']
      // const { wrapperObj } = mountWithStore()
      await wrapper.setData({ hover: true })

      const tooltip = wrapper.find('[data-attribute=tooltip]')
      // Barcodes of the tubes the store pools relate to
      const expected = 'TRAC-2-22,TRAC-2-24,TRAC-2-20'
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
      well.updatePoolLibraryBarcode = vi.fn()
    })

    it('will update the barcode', async () => {
      well.drop(mockEvent)
      expect(well.updatePoolLibraryBarcode).toBeCalledWith(newBarcode)
    })
  })
})
