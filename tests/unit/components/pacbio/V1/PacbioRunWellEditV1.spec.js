import { mount, nextTick, createTestingPinia } from '@support/testHelper.js'
import PacbioRunWellEdit from '@/components/pacbio/V1/PacbioRunWellEditV1.vue'
import { beforeEach, describe, expect } from 'vitest'
import { newWell } from '@/stores/utilities/run.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

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

    describe('pools and libraries', () => {
      it('well should have correct pools when updated', async () => {
        const well = newWell({ position: position, ...{ id: 1, pools: [1] } })

        const { wrapperObj } = mountWithStore({
          state: {
            pools: { 1: { id: 1, tube: 1 }, 2: { id: 2, tube: 2 } },
            tubes: { 1: { barcode: 'TRAC-1', pools: [1] }, 2: { barcode: 'TRAC-2', pools: [2] } },
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

        expect(wrapper.vm.idsByType('pools')).toEqual([1])

        wrapper.vm.localPoolsAndLibraries.push({ id: 2, barcode: 'TRAC-2', type: 'pools' })
        expect(wrapper.vm.idsByType('pools')).toEqual([1, 2])
        expect(wrapper.vm.wellPayload).toEqual({ ...well, pools: [1, 2] })
      })

      it('well should have correct libraries when updated', async () => {
        const well = newWell({ position: position, ...{ id: 1, libraries: [1] } })

        const { wrapperObj } = mountWithStore({
          state: {
            libraries: { 1: { id: 1, tube: 1, request: 1 }, 2: { id: 2, tube: 2, request: 2 } },
            tubes: {
              1: { barcode: 'TRAC-1', libraries: 1 },
              2: { barcode: 'TRAC-2', libraries: 2 },
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

        expect(wrapper.vm.idsByType('libraries')).toEqual([1])

        wrapper.vm.localPoolsAndLibraries.push({ id: 2, barcode: 'TRAC-2', type: 'libraries' })
        expect(wrapper.vm.idsByType('libraries')).toEqual([1, 2])
        expect(wrapper.vm.wellPayload).toEqual({ ...well, libraries: [1, 2] })
      })
    })
  })
})
