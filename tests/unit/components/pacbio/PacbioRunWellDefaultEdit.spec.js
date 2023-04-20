import PacbioRunWellDefaultEdit from '@/components/pacbio/PacbioRunWellDefaultEdit'
import { localVue, mount, store } from '@support/testHelper'
import { describe, expect, it } from 'vitest'
import { defaultWellAttributes } from '@/store/traction/pacbio/runCreate/run'

// required as suggestion to remove the deprecated function
// https://vue-test-utils.vuejs.org/api/options.html#attachtodocument
const elem = document.createElement('div')
if (document.body) {
  document.body.appendChild(elem)
}

const buildWrapper = () =>
  mount(PacbioRunWellDefaultEdit, {
    localVue,
    store,
    sync: false,
    attachTo: elem,
  })

const smrtLinkVersions = [
  {
    id: 1,
    name: 'v10',
    default: true,
  },
  {
    id: 2,
    name: 'v11',
    default: false,
  },
  {
    id: 3,
    name: 'v12_revio',
    default: false,
  },
]

const run = {
  id: 'new',
  system_name: 'Sequel IIe',
  sequencing_kit_box_barcode: null,
  dna_control_complex_box_barcode: null,
  comments: null,
}

describe('PacbioRunWellDefaultEdit', () => {
  let wrapper, runInfo

  beforeEach(() => {
    store.state.traction.pacbio.runCreate.run = run
    store.state.traction.pacbio.runCreate.defaultWellAttributes = defaultWellAttributes()
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
  })

  /*["ccs_analysis_output_include_kinetics_information",
    "ccs_analysis_output_include_low_quality_reads",
    "include_fivemc_calls_in_cpg_motifs",
    "demultiplex_barcodes",
    "binding_kit_box_barcode",
    "pre_extension_time",
    "loading_target_p1_plus_p2",
    "movie_time"]
  */
  describe('if the SMRT Link version is v11', () => {
    beforeEach(() => {
      store.state.traction.pacbio.runCreate.smrtLinkVersion = smrtLinkVersions[1]
      wrapper = buildWrapper()
      runInfo = wrapper.vm
    })

    it('will have a selected smrt link version of v11', () => {
      expect(runInfo.smrtLinkVersion.id).toEqual(smrtLinkVersions[1].id)
    })

    describe('input', () => {
      it('has a movie time input', async () => {
        const options = wrapper.find('[data-attribute=default-movie-time]').findAll('option')
        // select the first option
        await options.at(1).setSelected()
        expect(store.state.traction.pacbio.runCreate.defaultWellAttributes.movie_time).toEqual(
          '10.0',
        )
      })

      it('has a pre extension time input', async () => {
        const input = wrapper.find('[data-attribute=default-pre-extension-time]')
        await input.setValue('3')
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes.pre_extension_time,
        ).toEqual('3')
      })

      it('has a loading target p1 plus p2 input', async () => {
        const input = wrapper.find('[data-attribute=default-loading-target-p1-plus-p2]')
        await input.setValue('1')
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes.loading_target_p1_plus_p2,
        ).toEqual('1')
      })

      it('has a binding kit box barcode input', async () => {
        const input = wrapper.find('[data-attribute=default-binding-kit-box-barcode]')
        await input.setValue('ABC123')
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes.binding_kit_box_barcode,
        ).toEqual('ABC123')
      })

      it('has a CCS analysis output include kinetics information input', async () => {
        const options = wrapper
          .find('[data-attribute=default-ccs-analysis-output-include-kinetics-information]')
          .findAll('option')
        // select the first option
        await options.at(0).setSelected()
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes
            .ccs_analysis_output_include_kinetics_information,
        ).toEqual('Yes')
      })

      it('has a CCS analysis output include low quality reads input', async () => {
        const options = wrapper
          .find('[data-attribute=default-ccs-analysis-output-include-low-quality-reads]')
          .findAll('option')
        // select the first option
        await options.at(0).setSelected()
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes
            .ccs_analysis_output_include_low_quality_reads,
        ).toEqual('Yes')
      })

      it('has a demultiplex barcodes default input', async () => {
        const options = wrapper
          .find('[data-attribute=default-demultiplex-barcodes]')
          .findAll('option')
        // select the first option
        await options.at(1).setSelected()
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes.demultiplex_barcodes,
        ).toEqual('In SMRT Link')
      })

      it('has a fivemc calls in cpg motifs default input', async () => {
        const options = wrapper
          .find('[data-attribute=default-include-fivemc-calls-in-cpg-motifs]')
          .findAll('option')
        // select the first option
        await options.at(0).setSelected()
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes
            .include_fivemc_calls_in_cpg_motifs,
        ).toEqual('Yes')
      })

      // checks components only specific to v11 are being shown
      it('does not have a CCS analysis output default input', () => {
        expect(wrapper.find('[data-attribute=default-ccs-analysis-output]').exists()).toBeFalsy()
      })

      it('does not have a generate hifi default input', () => {
        expect(wrapper.find('[data-attribute=default-generate-hifi]').exists()).toBeFalsy()
      })
    })
  })

  /*["movie_acquisition_time",
     "include_base_kinetics",
     "library_concentration",
     "polymerase_kit"
    ]
  */
  describe('if the SMRT Link version is v12', () => {
    beforeEach(() => {
      store.state.traction.pacbio.runCreate.smrtLinkVersion = smrtLinkVersions[2]
      wrapper = buildWrapper()
      runInfo = wrapper.vm
    })

    it('will have a selected smrt link version of v12', () => {
      expect(runInfo.smrtLinkVersion.id).toEqual(smrtLinkVersions[2].id)
    })

    describe('input', () => {
      it('has a movie acquisition time input', async () => {
        const input = wrapper.find('[data-attribute=default-movie-acquisition-time]')
        await input.setValue('30')
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes.movie_acquisition_time,
        ).toEqual('30')
      })

      it('has a include base kinetics input', async () => {
        const options = wrapper
          .find('[data-attribute=default-include-base-kinetics]')
          .findAll('option')
        // select the first option
        await options.at(0).setSelected()
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes.include_base_kinetics,
        ).toEqual('True')
      })

      it('has a library concentration', async () => {
        const input = wrapper.find('[data-attribute=default-library-concentration]')
        await input.setValue('1')
        expect(
          store.state.traction.pacbio.runCreate.defaultWellAttributes.library_concentration,
        ).toEqual('1')
      })

      it('has a polymerase kit', async () => {
        const input = wrapper.find('[data-attribute=default-polymerase-kit]')
        await input.setValue('1')
        expect(store.state.traction.pacbio.runCreate.defaultWellAttributes.polymerase_kit).toEqual(
          '1',
        )
      })
    })
  })
})
