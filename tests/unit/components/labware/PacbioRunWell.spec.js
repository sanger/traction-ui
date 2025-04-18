import PacbioRunWell from '@/components/labware/PacbioRunWell.vue'
import { mountWithStore, nextTick } from '@support/testHelper.js'
import { newPlate } from '@/stores/utilities/run.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { beforeEach } from 'vitest'
import { PacbioRunWellSmrtLinkOptions } from '@/config/PacbioRunWellSmrtLinkOptions.js'
import { createUsedAliquot } from '@/stores/utilities/usedAliquot.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'

// TODO: There is still a lot in here which is hardcoded but it would require more work to move it to the factory.

// has got pools.
const pacbioRunFactory = PacbioRunFactory({ findBy: 'Sequel IIe' })

// best to move to factory.
const usedAliquots = {
  1: {
    id: '1',
    type: 'aliquots',
    source_type: 'Pacbio::Pool',
    source_id: '5817',
    used_by_type: 'Pacbio::Well',
    volume: 0,
  },
  2: {
    id: '2',
    type: 'aliquots',
    source_type: 'Pacbio::Library',
    source_id: '12739',
    used_by_type: 'Pacbio::Well',
    volume: 0,
  },
  3: {
    id: '3',
    type: 'aliquots',
    source_type: 'Pacbio::Library',
    source_id: '13357',
    used_by_type: 'Pacbio::Well',
    volume: 0,
  },
}
const storeWell = {
  position: 'A1',
  used_aliquots: [
    createUsedAliquot({ ...usedAliquots['1'] }),
    createUsedAliquot({ ...usedAliquots['2'] }),
    createUsedAliquot({ ...usedAliquots['3'] }),
  ],
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
  v11: { id: 1, name: 'v11', default: true, active: true },
  v12_revio: { id: 2, name: 'v12_revio', default: false, active: true },
  v12_sequel_iie: { id: 3, name: 'v12_sequel_iie', default: false, active: true },
  v13_revio: { id: 4, name: 'v13_revio', default: false, active: true },
  v13_sequel_iie: { id: 5, name: 'v13_sequel_iie', default: false, active: true },
  v25_1_revio: { id: 4, name: 'v25_1_revio', default: false, active: true },
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
function mountPacbioRunWell({ state = {}, plugins = [] } = {}) {
  const { pools, libraries, aliquots, requests, tags, scannedBarcodes } = pacbioRunFactory.storeData

  const defaultOptions = {
    run: {},
    plates: { 1: newPlate(1) },
    wells: { 1: { A1: storeWell } },
    pools,
    libraries,
    requests,
    tags,
    scannedBarcodes,
    aliquots: { ...usedAliquots, ...aliquots },
    smrtLinkVersion: smrtLinkVersions['v11'],
    resources: { smrtLinkVersions },
  }
  return mountWithStore(PacbioRunWell, {
    initialState: {
      pacbioRunCreate: { ...defaultOptions, ...state },
    },
    plugins,
    stubs: {
      WellModal: true,
    },
    props,
  })
}

describe('PacbioRunWell.vue', () => {
  let well, wrapper

  beforeEach(() => {
    ;({ wrapper } = mountPacbioRunWell())
    well = wrapper.vm
  })

  it('must have a position', () => {
    expect(well.position).toEqual(props.position)
  })

  it('can have an interactive prop', () => {
    expect(well.interactive).toEqual(props.interactive)
  })

  describe('status', () => {
    describe.each([
      { smrt_link_version: 'v11' },
      { smrt_link_version: 'v12_revio' },
      { smrt_link_version: 'v12_sequel_iie' },
      { smrt_link_version: 'v13_revio' },
      { smrt_link_version: 'v13_sequel_iie' },
      { smrt_link_version: 'v25_1_revio' },
    ])('for SMRTLink version $smrt_link_version status is correct', ({ smrt_link_version }) => {
      let valid_required_fields

      beforeEach(() => {
        valid_required_fields = PacbioRunWellSmrtLinkOptions[smrt_link_version].reduce(
          (result, field) => {
            if (field.required) {
              // If its a required field give it a value
              result[field.value] = 'has_value'
            }
            return result
          },
          {},
        )
        ;({ wrapper } = mountPacbioRunWell({
          state: {
            wells: { 1: { A1: { ...valid_required_fields, used_aliquots: [usedAliquots['1']] } } },
            smrtLinkVersion: smrtLinkVersions[smrt_link_version],
          },
        }))

        well = wrapper.vm
      })

      it('will be valid if it is complete', async () => {
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-success text-white')
      })

      it('will be invalid if there are aliquots but no metadata', () => {
        ;({ wrapper } = mountPacbioRunWell({
          state: {
            wells: { 1: { A1: { used_aliquots: [usedAliquots['1']] } } },
            smrtLinkVersion: smrtLinkVersions[smrt_link_version],
          },
        }))
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-failure text-white')
      })

      it('will be invalid if there is metadata but no aliquots', () => {
        ;({ wrapper } = mountPacbioRunWell({
          state: {
            wells: { 1: { A1: { ...valid_required_fields, used_aliquots: [] } } },
            smrtLinkVersion: smrtLinkVersions[smrt_link_version],
          },
        }))
        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-failure text-white')
      })

      it('will be empty if there is no aliquots or metadata', () => {
        const empty_required_fields = PacbioRunWellSmrtLinkOptions[smrt_link_version].reduce(
          (result, field) => {
            if (field.required) {
              // If its a required field give it a value
              result[field.value] = ''
            }
            return result
          },
          {},
        )

        ;({ wrapper } = mountPacbioRunWell({
          state: {
            wells: {
              1: {
                A1: {
                  used_aliquots: [],
                  ...empty_required_fields,
                },
              },
            },
            smrtLinkVersion: smrtLinkVersions[smrt_link_version],
          },
        }))

        const well = wrapper.find('[data-attribute=pacbio-run-well]')
        expect(well.attributes('class')).toContain('bg-gray-100 text-black')
      })
    })
  })

  describe('updateUsedAliquotSource', () => {
    it('adds the pool to the well', async () => {
      const { pools, libraries, tubes, requests, tags } = pacbioRunFactory.storeData
      const newBarcode = 'TRAC-2-9452'
      const updateWellMockFn = vi.fn()
      ;({ wrapper } = mountPacbioRunWell({
        state: {
          wells: {
            1: {
              A1: {
                ...storeWell,
                used_aliquots: [],
              },
            },
          },
          pools,
          libraries,
          tubes,
          requests,
          tags,
        },
        plugins: [
          ({ store }) => {
            store.updateWell = updateWellMockFn
          },
        ],
      }))
      await wrapper.vm.updateUsedAliquotSource(newBarcode)
      expect(updateWellMockFn).toBeCalled()
      // Check the aliquot exists and contains the correct data
      expect(wrapper.vm.storeWell.used_aliquots[0]).toEqual(
        expect.objectContaining({
          source_id: '12739',
          source_type: 'Pacbio::Library',
          volume: 11,
          concentration: 10.5,
          insert_size: 8788,
          template_prep_kit_box_barcode: '035092100938900103124',
          barcode: newBarcode,
        }),
      )
    })

    it('adds the library to the well', async () => {
      const { pools, libraries, tubes, requests, tags } = pacbioRunFactory.storeData
      const newBarcode = 'TRAC-2-9452'
      const updateWellMockFn = vi.fn()
      ;({ wrapper } = mountPacbioRunWell({
        state: {
          wells: {
            1: {
              A1: {
                ...storeWell,
                used_aliquots: [],
              },
            },
          },
          pools,
          libraries,
          tubes,
          requests,
          tags,
        },
        plugins: [
          ({ store }) => {
            store.updateWell = updateWellMockFn
          },
        ],
      }))
      await wrapper.vm.updateUsedAliquotSource(newBarcode)
      expect(updateWellMockFn).toBeCalled()
      // Check the aliquot exists and contains the correct data
      expect(wrapper.vm.storeWell.used_aliquots[0]).toEqual(
        expect.objectContaining({
          source_id: '12739',
          source_type: 'Pacbio::Library',
          volume: 11,
          concentration: 10.5,
          template_prep_kit_box_barcode: '035092100938900103124',
          barcode: newBarcode,
        }),
      )
    })
  })

  describe('tooltip', () => {
    it('will not be empty if used_aliquots are empty', () => {
      ;({ wrapper } = mountPacbioRunWell({
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
      }))
      const tooltip = wrapper.find('[data-attribute=tooltip]')
      expect(tooltip.text()).toEqual('')
    })

    it('will be visible if there are used_aliquots sourced from pools or libraries', async () => {
      wrapper.vm.hover = true
      await nextTick()

      const tooltip = wrapper.find('[data-attribute=tooltip]')
      // Barcodes of the tubes the store pools relate to
      const expected = 'TRAC-2-10797,TRAC-2-9452,TRAC-2-10483'
      expect(tooltip.text()).toEqual(expected)
    })

    it('will only display aliquot source barcodes if the aliquot is not marked for destruction', async () => {
      const { pools, libraries, tubes, requests, tags } = pacbioRunFactory.storeData
      ;({ wrapper } = mountPacbioRunWell({
        state: {
          wells: {
            1: {
              A1: {
                ...storeWell,
                used_aliquots: [
                  createUsedAliquot({ ...usedAliquots['1'], _destroy: true }),
                  createUsedAliquot({ ...usedAliquots['2'] }),
                ],
              },
            },
          },
          pools,
          libraries,
          tubes,
          requests,
          tags,
        },
        stubActions: false,
      }))

      wrapper.vm.hover = true
      await nextTick()

      const tooltip = wrapper.find('[data-attribute=tooltip]')
      // Only shows barcode of the non-destroyed aliquot
      const expected = 'TRAC-2-9452'
      expect(tooltip.text()).toEqual(expected)
    })
  })

  describe('drag and drop', () => {
    let mockEvent, newBarcode, store

    beforeEach(() => {
      newBarcode = 'TRAC-2-9452'
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
      expect(store.updateWell).toBeCalled()
      // Check the aliquot exists and contains the correct data
      // we could probably use the tube contents?
      expect(wrapper.vm.storeWell.used_aliquots[3]).toEqual(
        expect.objectContaining({
          source_id: '12739',
          source_type: 'Pacbio::Library',
          volume: 11,
          concentration: 10.5,
          template_prep_kit_box_barcode: '035092100938900103124',
          barcode: newBarcode,
        }),
      )
    })
  })
})
