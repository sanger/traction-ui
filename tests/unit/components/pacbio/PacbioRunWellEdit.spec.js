import { mount, nextTick, createTestingPinia } from '@support/testHelper.js'
import PacbioRunWellEdit from '@/components/pacbio/PacbioRunWellEdit.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { newWell } from '@/stores/utilities/run.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'

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

describe('PacbioWellEdit', () => {
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
        {
          id: 2,
          barcode: 'TRAC-2',
          source_id: 2,
          source_type: 'Pacbio::Pool',
          volume: 6,
          concentration: 11,
          template_prep_kit_box_barcode: 'tpkbb1',
        },
        {
          id: 3,
          barcode: 'TRAC-3',
          source_id: 1,
          source_type: 'Pacbio::Library',
          volume: 7,
          concentration: 12,
          template_prep_kit_box_barcode: 'tpkbb1',
        },
        // Incomplete aliquots should not be included in filteredAliquots
        {
          id: '',
          barcode: '',
        },
      )
      expect(wrapper.vm.filteredAliquots()).toEqual([
        {
          id: 1,
          barcode: 'TRAC-1',
          source_id: 1,
          source_type: 'Pacbio::Pool',
          volume: 5,
          concentration: 10,
          template_prep_kit_box_barcode: 'tpkbb1',
        },
        {
          id: 2,
          barcode: 'TRAC-2',
          source_id: 2,
          source_type: 'Pacbio::Pool',
          volume: 6,
          concentration: 11,
          template_prep_kit_box_barcode: 'tpkbb1',
        },
        {
          id: 3,
          barcode: 'TRAC-3',
          source_id: 1,
          source_type: 'Pacbio::Library',
          volume: 7,
          concentration: 12,
          template_prep_kit_box_barcode: 'tpkbb1',
        },
      ])
    })
  })

  describe('Aliquot rows', () => {
    let store

    beforeEach(async () => {
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

    describe('addRow', () => {
      it('addRow adds an empty used aliquot to the localUsedAliquots list', () => {
        wrapper.vm.addRow()
        expect(wrapper.vm.localUsedAliquots[0]).toEqual({
          id: '',
          barcode: '',
          source_id: '',
          source_type: '',
          volume: 0,
          concentration: 0,
          template_prep_kit_box_barcode: '',
        })
        expect(wrapper.vm.localUsedAliquots.length).toEqual(1)
      })
    })

    describe('removeRow', () => {
      it('removeRow removes the used aliquot at the given index from the localUsedAliquots list', () => {
        wrapper.vm.addRow()
        expect(wrapper.vm.localUsedAliquots.length).toEqual(1)
        wrapper.vm.removeRow(0)
        expect(wrapper.vm.localUsedAliquots.length).toEqual(0)
      })
    })

    describe('updateUsedAliquotVolume', () => {
      it('updates the volume of the used aliquot at the given index', () => {
        wrapper.vm.addRow()
        wrapper.vm.updateUsedAliquotVolume({ index: 0 }, 10)
        expect(wrapper.vm.localUsedAliquots[0].volume).toEqual(10)
      })
    })

    describe('updateUsedAliquotSource', () => {
      it('updates the source of the used aliquot at the given index', async () => {
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
        expect(wrapper.vm.localUsedAliquots[0]).toEqual({
          id: '',
          barcode: 'TRAC-2-1',
          source_id: 1,
          source_type: 'Pacbio::Pool',
          volume: 0,
          concentration: 0,
          template_prep_kit_box_barcode: 'tpkbb1',
        })
      })

      it('shows an alert if the source does not exist', async () => {
        store.findPoolsOrLibrariesByTube = vi.fn()
        store.tubeContentByBarcode = vi.fn().mockReturnValue(undefined)

        wrapper.vm.addRow()
        await wrapper.vm.updateUsedAliquotSource({ index: 0, item: { id: '' } }, 'TRAC-2-1')
        expect(wrapper.vm.localUsedAliquots[0]).toEqual({
          id: '',
          barcode: '',
          source_id: '',
          source_type: '',
          volume: 0,
          concentration: 0,
          template_prep_kit_box_barcode: '',
        })
        expect(mockShowAlert).toBeCalledWith('Pool is not valid', 'danger')
      })
    })
  })
})
