import PacbioRunWell from '@/components/labware/PacbioRunWell.vue'
import { mount, createTestingPinia, nextTick } from '@support/testHelper.js'
import storePools from '@tests/data/StoreRunPools.json'
import { newPlate } from '@/stores/utilities/run.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { beforeEach } from 'vitest'

const usedAliquots = {
  1: { id: '1', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '12' },
  2: { id: '2', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '14' },
  3: { id: '3', type: 'aliquots', source_type: 'Pacbio::Library', source_id: '30' },
}
const storeWell = {
  position: 'A1',
  used_aliquots: [usedAliquots['1'], usedAliquots['2'], usedAliquots['3']],
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

      it('will be invalid if there are no used_aliquots in the store', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: { 1: { A1: { ...storeWell, used_aliquots: [] } } },
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

      it('will be empty if there are no used_aliquots or metadata', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: {
              1: {
                A1: {
                  ...storeWell,
                  used_aliquots: [],
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

      it('will be invalid if there are no used_aliquots in the store', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: { 1: { A1: { ...storeWell, used_aliquots: [] } } },
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

      it('will be empty if there are no used_aliquots or metadata', () => {
        const { wrapperObj } = mountWithStore({
          state: {
            wells: {
              1: {
                A1: {
                  ...storeWell,
                  used_aliquots: [],
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

  describe('updateUsedAliquotSource', () => {
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
                used_aliquots: [],
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
      expectedWell = {
        ...storeWell,
        used_aliquots: [
          { barcode: 'TRAC-2-22', id: '', source_id: '12', source_type: 'Pacbio::Pool' },
        ],
      }
      await wrapperObj.vm.updateUsedAliquotSource(newBarcode)
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
                used_aliquots: [],
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
      expectedWell = {
        ...storeWell,
        used_aliquots: [
          { barcode: 'TRAC-2-20', id: '', source_id: '30', source_type: 'Pacbio::Library' },
        ],
      }
      await wrapperObj.vm.updateUsedAliquotSource(newBarcode)
      expect(updateWellMockFn).toBeCalledWith({
        well: expectedWell,
        plateNumber: props.plateNumber,
      })
    })
  })

  describe('tooltip', () => {
    it('will not be empty if used_aliquots are empty', () => {
      const { wrapperObj } = mountWithStore({
        state: {
          wells: {
            1: {
              A1: {
                ...storeWell,
                used_aliquots: [],
              },
            },
          },
        },
      })
      const tooltip = wrapperObj.find('[data-attribute=tooltip]')
      expect(tooltip.text()).toEqual('')
    })

    it('will be visible if there are used_aliquots sourced from pools or libraries', async () => {
      wrapper.vm.hover = true
      await nextTick()

      const tooltip = wrapper.find('[data-attribute=tooltip]')
      // Barcodes of the tubes the store pools relate to
      const expected = 'TRAC-2-22,TRAC-2-24,TRAC-2-20'
      expect(tooltip.text()).toEqual(expected)
    })
  })

  describe('drag and drop', () => {
    let mockEvent, newBarcode, store

    beforeEach(() => {
      newBarcode = 'TRAC-2-20'
      mockEvent = {
        dataTransfer: {
          getData() {
            return newBarcode
          },
        },
        preventDefault: vi.fn(),
      }

      store = usePacbioRunCreateStore()
      store.updateWell = vi.fn()
    })

    it('will update the barcode', async () => {
      wrapper.vm.drop(mockEvent)
      await nextTick()
      expect(store.updateWell).toBeCalledWith({
        // 30 is the id of the library with the barcode being used
        well: {
          ...storeWell,
          used_aliquots: [
            ...Object.values(usedAliquots),
            {
              id: '',
              source_id: '30',
              source_type: 'Pacbio::Library',
              barcode: 'TRAC-2-20',
            },
          ],
        },
        plateNumber: 1,
      })
    })
  })
})
