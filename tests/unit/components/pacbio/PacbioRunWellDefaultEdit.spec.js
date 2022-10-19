import * as Run from '@/api/PacbioRun'
import PacbioRunWellDefaultEdit from '@/components/pacbio/PacbioRunWellDefaultEdit'
import { localVue, mount, store } from '@support/testHelper'
import { describe, expect, it } from 'vitest'

const smrtLinkVersions = [
  {
    id: '1',
    name: 'v1',
    default: true,
  },
  {
    id: '2',
    name: 'v2',
    default: false,
  },
]

describe('PacbioRunWellDefaultEdit', () => {
  let wrapper, runInfo, run

  beforeEach(() => {
    run = Run.build()
    run.smrt_link_version_id = '1'

    store.commit('traction/pacbio/runs/setCurrentRun', run)
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions

    // required as suggestion to remove the deprecated function
    // https://vue-test-utils.vuejs.org/api/options.html#attachtodocument
    const elem = document.createElement('div')
    if (document.body) {
      document.body.appendChild(elem)
    }
    wrapper = mount(PacbioRunWellDefaultEdit, { localVue, store, sync: false, attachTo: elem })
    runInfo = wrapper.vm
  })

  it('can have getters', () => {
    expect(runInfo.currentRun).toBeDefined()
  })

  it('will have a selected smrt link version', () => {
    expect(runInfo.selectedSmrtLinkVersion).toEqual(smrtLinkVersions[0])
  })

  describe('form inputs', () => {
    it('has a Default Movie time input', () => {
      expect(wrapper.find('#default-movie-time')).toBeDefined()
    })
    it('has a Default Generate Hifi input', () => {
      expect(wrapper.find('#default-generate-hifi')).toBeDefined()
    })
    it('has a Default Ccs Analysis Output', () => {
      expect(wrapper.find('#default-ccs-analysis-output')).toBeDefined()
    })
    it('has a Default Pre extension time input', () => {
      expect(wrapper.find('#default-pre-extension-time')).toBeDefined()
    })
    it('has a Default Loading Target input', () => {
      expect(wrapper.find('#default-loading-target')).toBeDefined()
    })
    it('has a Default Binding Kit Box Barcode input', () => {
      expect(wrapper.find('#default-binding-kit-box-barcode')).toBeDefined()
    })
  })

  //["ccs_analysis_output", "generate_hifi", "on_plate_loading_concentration", "binding_kit_box_barcode", "pre_extension_time", "loading_target_p1_plus_p2", "movie_time"]
  describe('if the SMRT Link version is v10', () => {
    it('has a movie time default input', () => {
      expect(wrapper.find('[data-attribute=default-movie-time]').exists()).toBeTruthy()
    })

    it('has a generate hifi default input', () => {
      console.log(wrapper.find('[data-attribute=default-generate-hifi]'))
      expect(wrapper.find('[data-attribute=default-generate-hifi]').exists()).toBeTruthy()
    })

    it('has a binding kit box barcode default input', () => {
      expect(wrapper.find('[data-attribute=default-binding-kit-box-barcode]').exists()).toBeTruthy()
    })

    it('has a pre extension time default input', () => {
      expect(wrapper.find('[data-attribute=default-pre-extension-time]').exists()).toBeTruthy()
    })

    it('has a loading target p1 plus p2 default input', () => {
      expect(
        wrapper.find('[data-attribute=default-loading-target-p1-plus-p2]').exists(),
      ).toBeTruthy()
    })

    it('has a CCS analysis output default input', () => {
      expect(wrapper.find('[data-attribute=default-ccs-analysis-output]').exists()).toBeTruthy()
    })

    it('does not have a CCS analysis output include kinetics information default input', () => {
      expect(
        wrapper
          .find('[data-attribute=default-ccs-analysis-output-include-kinetics-information]')
          .exists(),
      ).toBeFalsy()
    })

    it('does not have a CCS analysis output include low quality reads default input', () => {
      expect(
        wrapper
          .find('[data-attribute=default-ccs-analysis-output-include-low-quality-reads]')
          .exists(),
      ).toBeFalsy()
    })

    it('does not have a fivemc calls in cpg motifs default input', () => {
      expect(
        wrapper.find('[data-attribute=default-fivemc-calls-in-cpg-motifs]').exists(),
      ).toBeFalsy()
    })

    it('does not have a demultiplex barcodes default input', () => {
      expect(wrapper.find('[data-attribute=default-demultiplex-barcodes]').exists()).toBeFalsy()
    })
  })

  /*["ccs_analysis_output_include_kinetics_information",
    "ccs_analysis_output_include_low_quality_reads",
    "fivemc_calls_in_cpg_motifs",
    "demultiplex_barcodes",
    "on_plate_loading_concentration",
    "binding_kit_box_barcode",
    "pre_extension_time",
    "loading_target_p1_plus_p2",
    "movie_time"]
  */
  describe('if the SMRT Link version is v11', () => {
    it('has a movie time default input', () => {
      expect(wrapper.find('[data-attribute=default-movie-time]').exists()).toBeTruthy()
    })

    it('has a binding kit box barcode default input', () => {
      expect(wrapper.find('[data-attribute=default-binding-kit-box-barcode]').exists()).toBeTruthy()
    })

    it('has a pre extension time default input', () => {
      expect(wrapper.find('[data-attribute=default-pre-extension-time]').exists()).toBeTruthy()
    })

    it('has a loading target p1 plus p2 default input', () => {
      expect(
        wrapper.find('[data-attribute=default-loading-target-p1-plus-p2]').exists(),
      ).toBeTruthy()
    })

    it('has a CCS analysis output include kinetics information default input', () => {
      expect(
        wrapper
          .find('[data-attribute=default-ccs-analysis-output-include-kinetics-information]')
          .exists(),
      ).toBeTruthy()
    })

    it('has a CCS analysis output include low quality reads default input', () => {
      expect(
        wrapper
          .find('[data-attribute=default-ccs-analysis-output-include-low-quality-reads]')
          .exists(),
      ).toBeTruthy()
    })

    it('has a fivemc calls in cpg motifs default input', () => {
      expect(
        wrapper.find('[data-attribute=default-fivemc-calls-in-cpg-motifs]').exists(),
      ).toBeTruthy()
    })

    it('has a demultiplex barcodes default input', () => {
      expect(wrapper.find('[data-attribute=default-demultiplex-barcodes]').exists()).toBeTruthy()
    })

    it('does not have a CCS analysis output default input', () => {
      expect(wrapper.find('[data-attribute=default-ccs-analysis-output]').exists()).toBeFalsy()
    })

    it('does not have a generate hifi default input', () => {
      expect(wrapper.find('[data-attribute=default-generate-hifi]').exists()).toBeFalsy()
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
