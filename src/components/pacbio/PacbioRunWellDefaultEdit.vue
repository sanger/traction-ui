<template>
  <div class="border border-black p-[10px]">
    <fieldset>
      <div
        class="grid grid-cols-2 px-2 pb-1 my-auto"
        v-for="field in smrtLinkWellDefaults"
        :key="field.name"
      >
        <label class="text-left">{{ field.label }}</label>
        <component
          :is="field.component"
          v-bind="field.props"
          v-model="runDefaultWellAttributes[field.value]"
        />
      </div>
      <traction-muted-text>
        * Non-submitted fields, used for providing new wells with default values
      </traction-muted-text>
    </fieldset>
  </div>
</template>

<script>
// There is a lot of duplication between this component and PacbioRunWellEdit.
// A lot of it could be moved to the store
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/runCreate')
export default {
  name: 'PacbioRunWellDefaultEdit',
  data() {
    return {
      smrtLinkVersionDefaultComponents: {
        v11: [
          {
            name: 'movie_time',
            component: 'traction-select',
            value: 'movie_time',
            label: 'Movie Time: ',
            props: {
              options: [
                { text: 'Movie Time', value: '', disabled: true },
                '10.0',
                '15.0',
                '20.0',
                '24.0',
                '30.0',
              ],
              dataAttribute: 'default-movie-time',
            },
          },
          {
            name: 'pre-extension-time',
            component: 'traction-input',
            value: 'pre_extension_time',
            label: 'Pre-extension time:',
            props: {
              placeholder: 'Default Pre-extension time',
              dataAttribute: 'default-pre-extension-time',
            },
          },
          {
            name: 'loading_target_p1_plus_p2',
            component: 'traction-input',
            value: 'loading_target_p1_plus_p2',
            label: 'Loading Target (P1 + P2):',
            props: {
              type: 'number',
              step: 0.05,
              dataAttribute: 'default-loading-target-p1-plus-p2',
              placeholder: 'Loading Target (P1 + P2)',
            },
          },
          {
            name: 'binding_kit_box_barcode',
            component: 'traction-input',
            value: 'binding_kit_box_barcode',
            label: 'Binding Kit Box Barcode:',
            props: {
              dataAttribute: 'default-binding-kit-box-barcode',
              placeholder: 'Default Binding Kit Box Barcode for new wells',
              type: 'text',
            },
          },
          {
            name: 'ccs_analysis_output_include_kinetics_information',
            component: 'traction-select',
            value: 'ccs_analysis_output_include_kinetics_information',
            label: 'CCS Analysis Output Include Kinetics Information:',
            props: {
              options: ['Yes', 'No'],
              dataAttribute: 'default-ccs-analysis-output-include-kinetics-information',
              placeholder: 'Default CCS Analysis Output Include Kinetics Information for new wells',
            },
          },
          {
            name: 'ccs_analysis_output_include_low_quality_reads',
            component: 'traction-select',
            value: 'ccs_analysis_output_include_low_quality_reads',
            label: 'CCS Analysis Output Include Low Quality Reads:',
            props: {
              options: ['Yes', 'No'],
              dataAttribute: 'default-ccs-analysis-output-include-low-quality-reads',
              placeholder: 'Default CCS Analysis Output Include Low Quality Reads for new wells',
            },
          },
          {
            name: 'demultiplex_barcodes',
            component: 'traction-select',
            value: 'demultiplex_barcodes',
            label: 'Demultiplex barcodes:',
            props: {
              options: [
                { text: 'Please select a value', value: '', disabled: true },
                'In SMRT Link',
                'Do Not Generate',
                'On Instrument',
              ],
              dataAttribute: 'default-demultiplex-barcodes',
              placeholder: 'Default Demultiplex Barcodes for new wells',
            },
          },
          {
            name: 'include_fivemc_calls_in_cpg_motifs',
            component: 'traction-select',
            value: 'include_fivemc_calls_in_cpg_motifs',
            label: 'Include 5mc Calls In CpG Motifs:',
            props: {
              options: ['Yes', 'No'],
              dataAttribute: 'default-include-fivemc-calls-in-cpg-motifs',
              placeholder: 'Default Include 5mc Calls in CpG Motifs for new wells',
            },
          },
        ],
        v12_revio: [
          {
            name: 'movie_acquisition_time',
            component: 'traction-select',
            value: 'movie_acquisition_time',
            label: 'Movie Acquisition Time (hrs):',
            props: {
              options: [
                { text: 'Movie Acquisition Time', value: '', disabled: true },
                '10.0',
                '15.0',
                '20.0',
                '24.0',
                '30.0',
              ],
              dataAttribute: 'default-movie-acquisition-time',
            },
          },
          {
            name: 'pre-extension-time',
            component: 'traction-input',
            value: 'pre_extension_time',
            label: 'Pre-extension time:',
            props: {
              placeholder: 'Default Pre-extension time',
              dataAttribute: 'default-pre-extension-time',
            },
          },
          {
            name: 'include_base_kinetics',
            component: 'traction-select',
            value: 'include_base_kinetics',
            label: 'Include Base Kinetics: ',
            props: {
              options: ['True', 'False'],
              dataAttribute: 'default-include-base-kinetics',
              placeholder: 'Include Base Kinetics',
            },
          },
          {
            name: 'library_concentration',
            component: 'traction-input',
            value: 'library_concentration',
            label: 'Library Concentration: ',
            props: {
              type: 'number',
              dataAttribute: 'default-library-concentration',
              placeholder: 'Library Concentration',
            },
          },
          {
            name: 'polymerase_kit',
            component: 'traction-input',
            value: 'polymerase_kit',
            label: 'Polymerase Kit ',
            props: {
              type: 'number',
              dataAttribute: 'default-polymerase-kit',
              placeholder: 'Polymerase Kit',
            },
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['runDefaultWellAttributes', 'runItem', 'smrtLinkVersion']),
    smrtLinkWellDefaults() {
      return this.smrtLinkVersionDefaultComponents[this.smrtLinkVersion.name]
    },
  },
}
</script>
