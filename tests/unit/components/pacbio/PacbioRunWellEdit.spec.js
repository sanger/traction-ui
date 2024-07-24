import { mount, nextTick, createTestingPinia } from '@support/testHelper.js'
import PacbioRunWellEdit from '@/components/pacbio/PacbioRunWellEdit.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { newWell } from '@/stores/utilities/run.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { createUsedAliquot } from '@/stores/utilities/usedAliquot'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

// They are like the following in the store; not an array.
const smrtLinkVersions = {
  1: {
    id: 1,
    name: 'v11',
    default: false,
    active: true,
  },
  2: {
    id: 2,
    name: 'v12_revio',
    default: 'false',
    active: true,
  },
}

const props = {
  isStatic: true,
}
const position = 'A1'
const plateNumber = 1

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
  const wrapperObj = mount(PacbioRunWellEdit, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRunCreate: { ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  const storeObj = usePacbioRunCreateStore()
  return { wrapperObj, storeObj }
}

describe('PacbioRunWellEdit', () => {
  let wrapper

  describe('SMRT Link Versions', () => {
    /*["ccs_analysis_output_include_kinetics_information",
      "ccs_analysis_output_include_low_quality_reads",
      "include_fivemc_calls_in_cpg_motifs",
      "demultiplex_barcodes",
      "on_plate_loading_concentration",
      "binding_kit_box_barcode",
      "pre_extension_time",
      "loading_target_p1_plus_p2",
      "movie_time"]
    */
    describe('if the SMRT Link version is v11', () => {
      beforeEach(async () => {
        const { wrapperObj } = mountWithStore({
          state: {
            smrtLinkVersion: smrtLinkVersions['1'],
            wells: {
              1: {
                A1: newWell({ position }),
              },
            },
          },
        })
        wrapper = wrapperObj
        wrapper.vm.isShow = true
        wrapper.vm.position = position
        wrapper.vm.plateNumber = plateNumber
      })

      describe('has the correct options', () => {
        it('has a movie time input', () => {
          expect(wrapper.find('[data-attribute="movie-time"]').exists()).toBeTruthy()
        })

        it('has a binding kit box barcode input', () => {
          expect(wrapper.find('[data-attribute="binding-kit-box-barcode"]').exists()).toBeTruthy()
        })

        it('has a pre extension time input', () => {
          expect(wrapper.find('[data-attribute="pre-extension-time"]').exists()).toBeTruthy()
        })

        it('has a loading target p1 plus p2 input', () => {
          expect(wrapper.find('[data-attribute="loading-target-p1-plus-p2"]').exists()).toBeTruthy()
        })

        it('has a CCS analysis output include kinetics information input', () => {
          expect(
            wrapper
              .find('[data-attribute="ccs-analysis-output-include-kinetics-information"]')
              .exists(),
          ).toBeTruthy()
        })

        it('has a CCS analysis output include low quality reads input', () => {
          expect(
            wrapper
              .find('[data-attribute="ccs-analysis-output-include-low-quality-reads"]')
              .exists(),
          ).toBeTruthy()
        })

        it('has a fivemc calls in cpg motifs input', () => {
          expect(
            wrapper.find('[data-attribute="include-fivemc-calls-in-cpg-motifs"]').exists(),
          ).toBeTruthy()
        })

        it('has a demultiplex barcodes input', () => {
          expect(wrapper.find('[data-attribute="demultiplex-barcodes"]').exists()).toBeTruthy()
        })
      })

      describe('does not have options belonging to other versions', () => {
        //v12_revio options
        it('has a movie acquisition time input', () => {
          expect(wrapper.find('[data-attribute="movie-acquisition-time"]').exists()).toBeFalsy()
        })

        it('has include base kinetics input', () => {
          expect(wrapper.find('[data-attribute="include-base-kinetics"]').exists()).toBeFalsy()
        })

        it('has a library concentration input', () => {
          expect(wrapper.find('[data-attribute="library-concentration"]').exists()).toBeFalsy()
        })
      })
    })

    // ["movie_acquisition_time", "include_base_kinetics", "library_concentration", "polymerase_kit", "pre_extension_time"]
    describe('if the SMRT Link version is v12_revio', () => {
      beforeEach(() => {
        const { wrapperObj } = mountWithStore({
          state: {
            smrtLinkVersion: smrtLinkVersions['2'],
            wells: {
              1: {
                A1: newWell({ position }),
              },
            },
          },
        })
        wrapper = wrapperObj
        wrapper.vm.isShow = true
        wrapper.vm.position = position
        wrapper.vm.plateNumber = plateNumber
      })

      describe('has the correct options', () => {
        it('has a movie acquisition time input', () => {
          expect(wrapper.find('[data-attribute="movie-acquisition-time"]').exists()).toBeTruthy()
        })

        it('has include base kinetics input', () => {
          expect(wrapper.find('[data-attribute="include-base-kinetics"]').exists()).toBeTruthy()
        })

        it('has a library concentration input', () => {
          expect(wrapper.find('[data-attribute="library-concentration"]').exists()).toBeTruthy()
        })

        it('has a polymerase kit input', () => {
          expect(wrapper.find('[data-attribute="polymerase-kit"]').exists()).toBeTruthy()
        })

        it('has a pre extension time input', () => {
          expect(wrapper.find('[data-attribute="pre-extension-time"]').exists()).toBeTruthy()
        })
      })

      describe('does not have options belonging to other versions', () => {
        // v11 options
        it('has a movie time input', () => {
          expect(wrapper.find('[data-attribute="movie-time"]').exists()).toBeFalsy()
        })

        it('has a binding kit box barcode input', () => {
          expect(wrapper.find('[data-attribute="binding-kit-box-barcode"]').exists()).toBeFalsy()
        })

        it('has a loading target p1 plus p2 input', () => {
          expect(wrapper.find('[data-attribute="loading-target-p1-plus-p2"]').exists()).toBeFalsy()
        })

        it('has a CCS analysis output include kinetics information input', () => {
          expect(
            wrapper
              .find('[data-attribute="ccs-analysis-output-include-kinetics-information"]')
              .exists(),
          ).toBeFalsy()
        })

        it('has a CCS analysis output include low quality reads input', () => {
          expect(
            wrapper
              .find('[data-attribute="ccs-analysis-output-include-low-quality-reads"]')
              .exists(),
          ).toBeFalsy()
        })

        it('has a fivemc calls in cpg motifs input', () => {
          expect(
            wrapper.find('[data-attribute="include-fivemc-calls-in-cpg-motifs"]').exists(),
          ).toBeFalsy()
        })

        it('has a demultiplex barcodes input', () => {
          expect(wrapper.find('[data-attribute="demultiplex-barcodes"]').exists()).toBeFalsy()
        })
      })
    })
  })

  describe('well type', () => {
    it('if it doesnt exist in state (new)', async () => {
      const { wrapperObj } = mountWithStore({
        state: {
          smrtLinkVersion: smrtLinkVersions['1'],
          wells: {
            1: {},
          },
        },
      })
      wrapper = wrapperObj
      wrapper.vm.isShow = true
      wrapper.vm.position = position
      wrapper.vm.plateNumber = plateNumber
      await nextTick()
      const button = wrapper.find('[data-action=create-well]')
      expect(button.text()).toEqual('Create')
    })

    it('if it is an existing well', async () => {
      const { wrapperObj } = mountWithStore({
        state: {
          smrtLinkVersion: smrtLinkVersions['1'],
          wells: {
            1: {
              A1: newWell({ attributes: { id: 1 }, position: position }),
            },
          },
        },
      })
      wrapper = wrapperObj
      wrapper.vm.isShow = true
      wrapper.vm.position = position
      wrapper.vm.plateNumber = plateNumber
      await nextTick()
      const button = wrapper.find('[data-action=update-well]')
      expect(button.text()).toEqual('Update')
    })
  })

  describe('filteredAliquots', () => {
    it('well should have correct used_aliquots when updated', async () => {
      const well = newWell({
        position: position,
        ...{
          id: 1,
          used_aliquots: [
            {
              id: 1,
              source_id: 1,
              source_type: 'Pacbio::Pool',
              barcode: 'TRAC-1',
              volume: 5,
              concentration: 10,
              template_prep_kit_box_barcode: 'tpkbb1',
            },
          ],
        },
      })

      const { wrapperObj } = mountWithStore({
        state: {
          pools: {
            1: {
              id: 1,
              tube: 1,
              used_aliquots: [],
              type: 'pools',
              volume: 5,
              concentration: 10,
              template_prep_kit_box_barcode: 'tpkbb1',
            },
            2: {
              id: 2,
              tube: 2,
              used_aliquots: [],
              type: 'pools',
              volume: 6,
              concentration: 11,
              template_prep_kit_box_barcode: 'tpkbb1',
            },
          },
          libraries: {
            1: {
              id: 1,
              tube: 1,
              request: 1,
              type: 'libraries',
              volume: 7,
              concentration: 12,
              available_volume: 10,
              template_prep_kit_box_barcode: 'tpkbb1',
            },
            2: { id: 2, tube: 2, request: 2, type: 'libraries' },
          },
          aliquots: {
            1: {
              id: 1,
              source_id: 1,
              source_type: 'Pacbio::Pool',
            },
            2: {
              id: 2,
              source_id: 1,
              source_type: 'Pacbio::Library',
            },
          },
          tubes: {
            1: { barcode: 'TRAC-1', pools: [1] },
            2: { barcode: 'TRAC-2', pools: [2] },
            3: { barcode: 'TRAC-3', libraries: [1] },
          },
          requests: {
            1: { id: 1, sample_name: 'sample1' },
            2: { id: 2, sample_name: 'sample2' },
          },
          smrtLinkVersion: smrtLinkVersions['1'],
          run: {},
          plates: { 1: { plate_number: 1 } },
          wells: {
            1: {
              A1: well,
            },
          },
        },
      })
      wrapper = wrapperObj
      // This method sets the well data for the modal on show
      await wrapper.vm.showModalForPositionAndPlate('A1', 1)
      wrapper.vm.localUsedAliquots.push(
        createUsedAliquot({
          id: 2,
          barcode: 'TRAC-2',
          source_id: 2,
          source_type: 'Pacbio::Pool',
          volume: 6,
          concentration: 11,
          template_prep_kit_box_barcode: 'tpkbb1',
        }),
        createUsedAliquot({
          id: 3,
          barcode: 'TRAC-3',
          source_id: 1,
          source_type: 'Pacbio::Library',
          volume: 7,
          concentration: 12,
          template_prep_kit_box_barcode: 'tpkbb1',
        }),
        // Incomplete aliquots should not be included in filteredAliquots
        createUsedAliquot({
          id: '',
          barcode: '',
        }),
      )
      expect(wrapper.vm.filteredAliquots()).toEqual([
        expect.objectContaining({
          id: 1,
          barcode: 'TRAC-1',
          source_id: 1,
          source_type: 'Pacbio::Pool',
          volume: 5,
          concentration: 10,
          template_prep_kit_box_barcode: 'tpkbb1',
        }),
        expect.objectContaining({
          id: 2,
          barcode: 'TRAC-2',
          source_id: 2,
          source_type: 'Pacbio::Pool',
          volume: 6,
          concentration: 11,
          template_prep_kit_box_barcode: 'tpkbb1',
        }),
        expect.objectContaining({
          id: 3,
          barcode: 'TRAC-3',
          source_id: 1,
          source_type: 'Pacbio::Library',
          volume: 7,
          concentration: 12,
          template_prep_kit_box_barcode: 'tpkbb1',
        }),
      ])
    })
  })

  describe('validLocalUsedAliquots', () => {
    it('returns the localUsedAliquots that are not marked for destruction', () => {
      const { wrapperObj } = mountWithStore({
        state: {
          smrtLinkVersion: smrtLinkVersions['1'],
          wells: {
            1: {
              A1: newWell({ attributes: { id: 1 }, position: position }),
            },
          },
        },
      })
      wrapper = wrapperObj
      const aliquots = [
        createUsedAliquot({ id: 1, _destroy: true }),
        createUsedAliquot({ id: 2 }),
        createUsedAliquot({ id: 3, _destroy: true }),
      ]
      aliquots.forEach((aliquot) => wrapper.vm.localUsedAliquots.push(aliquot))
      expect(wrapper.vm.validLocalUsedAliquots).toEqual([aliquots[1]])
    })
  })

  describe('Aliquot rows', () => {
    let store

    beforeEach(async () => {
      const well = newWell({
        position: position,
        ...{
          id: 1,
          used_aliquots: [
            {
              id: 1,
              source_id: 1,
              source_type: 'Pacbio::Pool',
              barcode: 'TRAC-1',
              volume: 5,
              concentration: 10,
              template_prep_kit_box_barcode: 'tpkbb1',
            },
          ],
        },
      })

      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          pools: {
            1: {
              id: 1,
              tube: 1,
              used_aliquots: [],
              type: 'pools',
              volume: 10,
              concentration: 10,
              template_prep_kit_box_barcode: 'tpkbb1',
              available_volume: 10,
            },
            2: {
              id: 2,
              tube: 2,
              used_aliquots: [],
              type: 'pools',
              volume: 10,
              concentration: 11,
              template_prep_kit_box_barcode: 'tpkbb1',
              available_volume: 10,
            },
          },
          libraries: {
            1: {
              id: 1,
              tube: 1,
              request: 1,
              type: 'libraries',
              volume: 10,
              concentration: 12,
              template_prep_kit_box_barcode: 'tpkbb1',
              available_volume: 10,
            },
            2: { id: 2, tube: 2, request: 2, type: 'libraries' },
          },
          aliquots: {
            1: {
              id: 1,
              source_id: 1,
              source_type: 'Pacbio::Pool',
              volume: 5,
            },
            2: {
              id: 2,
              source_id: 1,
              source_type: 'Pacbio::Library',
              volume: 5,
            },
          },
          tubes: {
            1: { barcode: 'TRAC-1', pools: [1] },
            2: { barcode: 'TRAC-2', pools: [2] },
            3: { barcode: 'TRAC-3', libraries: [1] },
          },
          requests: {
            1: { id: 1, sample_name: 'sample1' },
            2: { id: 2, sample_name: 'sample2' },
          },
          smrtLinkVersion: smrtLinkVersions['1'],
          run: {},
          plates: { 1: { plate_number: 1 } },
          wells: {
            1: {
              A1: well,
            },
          },
        },
      })

      store = storeObj
      wrapper = wrapperObj
      wrapper.vm.isShow = true
      wrapper.vm.position = position
      wrapper.vm.plateNumber = plateNumber
      // This method sets the well data for the modal on show
      await wrapper.vm.showModalForPositionAndPlate('A1', 1)
    })

    describe('Correct elements are shown', () => {
      it('has a button to add a new aliquot', () => {
        expect(wrapper.find('[data-action=add-row]').exists()).toBeTruthy()
      })

      it('has a table to show the used aliquots', () => {
        expect(wrapper.find('#wellUsedAliquots').exists()).toBeTruthy()
        expect(wrapper.findAll('tbody tr').length).toEqual(1)
      })

      it('has a button to remove a used aliquot', () => {
        expect(wrapper.find('[data-action=remove-row]').exists()).toBeTruthy()
      })

      it('does not have an available volume badge if it does not have an available_volume attribute', () => {
        expect(wrapper.find('[data-attribute=available-volume-div]').exists()).toBeFalsy()
      })

      it('has an available volume badge if it has an available_volume attribute', async () => {
        wrapper.vm.localUsedAliquots[0].available_volume = 5
        await nextTick()
        expect(wrapper.find('[data-attribute=available-volume-div]').exists()).toBeTruthy()
        expect(wrapper.find('[data-attribute=available-volume-div]').text()).toContain(
          'Available volume is 5',
        )
      })
    })

    describe('addRow', () => {
      it('addRow adds an empty used aliquot to the localUsedAliquots list', () => {
        wrapper.vm.addRow()
        expect(wrapper.vm.localUsedAliquots[1]).toEqual(
          expect.objectContaining({
            id: '',
            barcode: '',
            source_id: null,
            source_type: null,
            volume: 0,
            concentration: null,
            template_prep_kit_box_barcode: null,
          }),
        )
        expect(wrapper.vm.localUsedAliquots.length).toEqual(2)
      })
    })

    describe('removeRow', () => {
      it('adds a _destroy key to the correct aliquot at the given index from the localUsedAliquots list if the aliquot has an id', () => {
        wrapper.vm.addRow()
        expect(wrapper.vm.localUsedAliquots.length).toEqual(2)
        wrapper.vm.removeRow({ index: 0, item: { id: '1' } })
        expect(wrapper.vm.localUsedAliquots[0]).toEqual(expect.objectContaining({ _destroy: true }))
      })

      it('removes the aliquot at the given index from the localUsedAliquots list if the aliquot does not have an id', () => {
        wrapper.vm.addRow()
        expect(wrapper.vm.localUsedAliquots.length).toEqual(2)
        wrapper.vm.removeRow({ index: 1, item: { id: '' } })
        expect(wrapper.vm.localUsedAliquots.length).toEqual(1)
      })
    })

    describe('updateUsedAliquotVolume', () => {
      it('updates the volume of the used aliquot at the given index', () => {
        wrapper.vm.updateUsedAliquotVolume({ index: 0 }, 10)
        expect(wrapper.vm.localUsedAliquots[0].volume).toEqual(10)
      })
    })

    describe('updateUsedAliquotSource', () => {
      it('updates the source, available_volume and volume of the used aliquot at the given index when the source is a pool', async () => {
        store.findPoolsOrLibrariesByTube = vi.fn()
        store.tubeContentByBarcode = vi.fn().mockReturnValue({
          id: 1,
          type: 'pools',
          barcode: 'TRAC-2-1',
          volume: 5,
          concentration: 10,
          template_prep_kit_box_barcode: 'tpkbb1',
        })
        wrapper.vm.addRow()
        await wrapper.vm.updateUsedAliquotSource({ index: 0, item: { id: '' } }, 'TRAC-2-1')
        expect(wrapper.vm.localUsedAliquots[0]).toEqual(
          expect.objectContaining({
            id: '',
            barcode: 'TRAC-2-1',
            source_id: 1,
            source_type: 'Pacbio::Pool',
            volume: 10,
            concentration: 10,
            template_prep_kit_box_barcode: 'tpkbb1',
            available_volume: 10,
          }),
        )
      })

      it('updates the source, available_volume and volume of the used aliquot at the given index when the source is a library', async () => {
        store.findPoolsOrLibrariesByTube = vi.fn()
        store.tubeContentByBarcode = vi.fn().mockReturnValue({
          id: 1,
          type: 'libraries',
          barcode: 'TRAC-2-1',
          volume: 5,
          concentration: 10,
          template_prep_kit_box_barcode: 'tpkbb1',
        })
        wrapper.vm.addRow()
        await wrapper.vm.updateUsedAliquotSource({ index: 1, item: { id: '' } }, 'TRAC-2-1')
        expect(wrapper.vm.localUsedAliquots[1]).toEqual(
          expect.objectContaining({
            id: '',
            barcode: 'TRAC-2-1',
            source_id: 1,
            source_type: 'Pacbio::Library',
            volume: 10,
            concentration: 10,
            template_prep_kit_box_barcode: 'tpkbb1',
            available_volume: 10,
            errors: {},
          }),
        )
      })

      it('adds an error if the volume changed to a value less than available volume of the aliquot', async () => {
        store.findPoolsOrLibrariesByTube = vi.fn()
        store.tubeContentByBarcode = vi.fn().mockReturnValue({
          id: 1,
          type: 'libraries',
          barcode: 'TRAC-2-1',
          volume: 15,
          concentration: 10,
          template_prep_kit_box_barcode: 'tpkbb1',
        })
        wrapper.vm.addRow()
        await wrapper.vm.updateUsedAliquotSource({ index: 1, item: { id: '' } }, 'TRAC-2-1')
        expect(wrapper.vm.localUsedAliquots[1]).toEqual(
          expect.objectContaining({
            id: '',
            barcode: 'TRAC-2-1',
            source_id: 1,
            source_type: 'Pacbio::Library',
            volume: 10,
            concentration: 10,
            template_prep_kit_box_barcode: 'tpkbb1',
            available_volume: 10,
          }),
        )
        await wrapper.vm.updateUsedAliquotVolume({ index: 1 }, 11)
        // Check the error is added to the aliquot
        expect(wrapper.vm.localUsedAliquots[1].errors.volume).toEqual(
          'must be less or equal to available volume',
        )
        // Check the error is shown in the UI
        expect(wrapper.find('[data-attribute="volume-error"]').text()).toContain(
          'must be less or equal to available volume',
        )
      })

      it('shows an alert if the source does not exist', async () => {
        store.findPoolsOrLibrariesByTube = vi.fn()
        store.tubeContentByBarcode = vi.fn().mockReturnValue(undefined)

        wrapper.vm.addRow()
        await wrapper.vm.updateUsedAliquotSource({ index: 1, item: { id: '' } }, 'TRAC-2-1')
        expect(wrapper.vm.localUsedAliquots[1]).toEqual(
          expect.objectContaining({
            id: '',
            barcode: '',
            source_id: null,
            source_type: null,
            volume: 0,
            concentration: null,
            template_prep_kit_box_barcode: null,
          }),
        )
        expect(mockShowAlert).toBeCalledWith('Pool is not valid', 'danger')
      })
    })
  })

  describe('update', () => {
    let store

    beforeEach(() => {
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          smrtLinkVersion: smrtLinkVersions['1'],
          wells: {
            1: {
              A1: newWell({ position }),
            },
          },
        },
      })
      store = storeObj
      wrapper = wrapperObj
      wrapper.vm.isShow = true
      wrapper.vm.position = position
      wrapper.vm.plateNumber = plateNumber
    })

    it('updates the well if it is valid', async () => {
      const aliquots = [
        createUsedAliquot({
          id: 2,
          barcode: 'TRAC-2',
          source_id: 2,
          source_type: 'Pacbio::Pool',
          volume: 6,
          concentration: 11,
          template_prep_kit_box_barcode: 'tpkbb1',
        }),
        createUsedAliquot({
          id: 3,
          barcode: 'TRAC-3',
          source_id: 1,
          source_type: 'Pacbio::Library',
          volume: 100,
          concentration: 12,
          template_prep_kit_box_barcode: 'tpkbb1',
        }),
      ]
      aliquots.forEach((aliquot) => wrapper.vm.localUsedAliquots.push(aliquot))
      await wrapper.vm.update()
      expect(store.updateWell).toBeCalledWith({
        plateNumber: 1,
        well: {
          used_aliquots: aliquots,
        },
      })
      expect(wrapper.vm.isShow).toBeFalsy()
    })

    it('does not update the well and shows an error if the aliquots have errors', async () => {
      const aliquots = [
        createUsedAliquot({
          id: 2,
          barcode: 'TRAC-2',
          source_id: 2,
          source_type: 'Pacbio::Pool',
          volume: 6,
          concentration: 11,
          template_prep_kit_box_barcode: 'tpkbb1',
          available_volume: 6,
        }),
        createUsedAliquot({
          id: 3,
          barcode: 'TRAC-3',
          source_id: 1,
          source_type: 'Pacbio::Library',
          volume: 7,
          available_volume: 6,
          concentration: 12,
          template_prep_kit_box_barcode: 'tpkbb1',
          errors: {
            volume: 'must be less or equal to available volume',
          },
        }),
      ]
      aliquots.forEach((aliquot) => wrapper.vm.localUsedAliquots.push(aliquot))
      await wrapper.vm.update()
      expect(mockShowAlert).toBeCalledWith('Insufficient volume available', 'danger')
      expect(store.updateWell).not.toBeCalled()
      expect(wrapper.vm.isShow).toBeTruthy()
    })
  })
})
