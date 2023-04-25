<template>
  <div class="pacbioRunWellDefaultEdit">
    <fieldset>
      <traction-row>
        <traction-col>
          <label for="default-movie-time">Movie Time:</label>
        </traction-col>
        <traction-col>
          <traction-select
            id="default-movie-time"
            v-model="runDefaultWellAttributes.movie_time"
            :options="movieTimeOptions"
            :value="runDefaultWellAttributes.movie_time"
            data-attribute="default-movie-time"
          >
          </traction-select>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-pre-extension-time">Pre-extension time:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="default-pre-extension-time"
            v-model="runDefaultWellAttributes.pre_extension_time"
            :value="runDefaultWellAttributes.pre_extension_time"
            data-attribute="default-pre-extension-time"
            placeholder="Pre-extension time"
          >
          </traction-input>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-loading-target-p1-plus-p2">Loading Target (P1 + P2):</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="default-loading-target-p1-plus-p2"
            v-model="runDefaultWellAttributes.loading_target_p1_plus_p2"
            :value="runDefaultWellAttributes.loading_target_p1_plus_p2"
            data-attribute="default-loading-target-p1-plus-p2"
            placeholder="Loading Target (P1 + P2)"
            type="number"
            step="0.05"
          >
          </traction-input>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-binding-kit-box-barcode">Binding Kit Box Barcode:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="default-binding-kit-box-barcode"
            v-model="runDefaultWellAttributes.binding_kit_box_barcode"
            :value="runDefaultWellAttributes.binding_kit_box_barcode"
            data-attribute="default-binding-kit-box-barcode"
            placeholder="Default Binding Kit Box Barcode for new wells"
            type="text"
          >
          </traction-input>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-ccs-analysis-output-include-kinetics-information"
            >CCS Output Include Kinetics Information:</label
          >
        </traction-col>
        <traction-col>
          <traction-select
            id="default-ccs-analysis-output-include-kinetics-information"
            v-model="runDefaultWellAttributes.ccs_analysis_output_include_kinetics_information"
            :options="ccsAnalysisOutputOptions"
            :value="runDefaultWellAttributes.ccs_analysis_output_include_kinetics_information"
            data-attribute="default-ccs-analysis-output-include-kinetics-information"
            title="CCS Analysis Output Include Kinetics Information"
            placeholder="Default CCS Analysis Output Include Kinetics Information for new wells"
          >
          </traction-select>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-ccs-analysis-output-include-low-quality-reads"
            >CCS Output Include Low Quality Reads:</label
          >
        </traction-col>
        <traction-col>
          <traction-select
            id="default-ccs-analysis-output-include-low-quality-reads"
            v-model="runDefaultWellAttributes.ccs_analysis_output_include_low_quality_reads"
            :options="ccsAnalysisOutputOptions"
            :value="runDefaultWellAttributes.ccs_analysis_output_include_low_quality_reads"
            data-attribute="default-ccs-analysis-output-include-low-quality-reads"
            title="CCS Analysis Output Include Low Quality Reads"
            placeholder="Default CCS Analysis Output Include Low Quality Reads for new wells"
          >
          </traction-select>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-demultiplex-barcodes">Demultiplex barcodes:</label>
        </traction-col>
        <traction-col>
          <traction-select
            id="default-demultiplex-barcodes"
            v-model="runDefaultWellAttributes.demultiplex_barcodes"
            :options="generateHifiOptions"
            :value="runDefaultWellAttributes.demultiplex_barcodes"
            data-attribute="default-demultiplex-barcodes"
            title="Demultiplex Barcodes"
            placeholder="Default Demultiplex Barcodes for new wells"
          >
          </traction-select>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-include-fivemc-calls-in-cpg-motifs"
            >Include 5mc Calls In CpG Motifs:</label
          >
        </traction-col>
        <traction-col>
          <traction-select
            id="default-include-fivemc-calls-in-cpg-motifs"
            v-model="runDefaultWellAttributes.include_fivemc_calls_in_cpg_motifs"
            :options="ccsAnalysisOutputOptions"
            :value="runDefaultWellAttributes.include_fivemc_calls_in_cpg_motifs"
            data-attribute="default-include-fivemc-calls-in-cpg-motifs"
            title="Include 5mc Calls In CpG Motifs"
            placeholder="Default Include 5mc Calls in CpG Motifs for new wells"
          >
          </traction-select>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <p style="float: left; font-size: 12px">
            * Non-submitted fields, used for providing new wells with default values
          </p>
          <br />
        </traction-col>
      </traction-row>
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
      movieTimeOptions: [
        { text: 'Movie Time', value: '', disabled: true },
        '10.0',
        '15.0',
        '20.0',
        '24.0',
        '30.0',
      ],
      generateHifiOptions: [
        { text: 'Please select a value', value: '', disabled: true },
        'In SMRT Link',
        'Do Not Generate',
        'On Instrument',
      ],
      ccsAnalysisOutputOptions: ['Yes', 'No'],
    }
  },
  computed: {
    ...mapGetters(['runDefaultWellAttributes', 'runItem', 'smrtLinkVersion']),
  },
}
</script>

<style>
.pacbioRunWellDefaultEdit {
  border: solid;
  border-width: 1px;
  padding: 10px;
}
label {
  font-size: 1em;
}
</style>
