<template>
  <div class="pacbioRunWellDefaultEdit">
    <fieldset>
      <div v-if="['v10', 'v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-movie-time">Movie Time:</label>
          </traction-col>
          <traction-col>
            <traction-select
              id="default-movie-time"
              data-attribute="default-movie-time"
              :options="movieTimeOptions"
              :value="currentRun.wellDefaults.movie_time"
              title="Movie Time"
              @input="setDefaultMovieTime"
            >
            </traction-select>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v10'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-generate-hifi">Generate HiFi:</label>
          </traction-col>
          <traction-col>
            <traction-select
              id="default-generate-hifi"
              data-attribute="default-generate-hifi"
              title="Generate HiFi"
              :options="generateHifiOptions[currentRun.system_name]"
              :value="currentRun.wellDefaults.generate_hifi"
              @input="setDefaultGenerateHifi"
            >
            </traction-select>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v10'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-ccs-analysis-output">Ccs Analysis Output:</label>
          </traction-col>
          <traction-col>
            <traction-select
              id="default-ccs-analysis-output"
              data-attribute="default-ccs-analysis-output"
              title="Ccs Analysis Output"
              :options="ccsAnalysisOutputOptions"
              :value="currentRun.wellDefaults.ccs_analysis_output"
              @change="setDefaultCcsAnalysisOutput"
            >
            </traction-select>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v10', 'v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-pre-extension-time">Pre-extension time:</label>
          </traction-col>
          <traction-col>
            <traction-input
              id="default-pre-extension-time"
              data-attribute="default-pre-extension-time"
              title="Pre-extension Time"
              :value="currentRun.wellDefaults.pre_extension_time"
              placeholder="Pre-extension time"
              @input="setDefaultPreExtensionTime"
            >
            </traction-input>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v10', 'v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-loading-target-p1-plus-p2">Loading Target (P1 + P2):</label>
          </traction-col>
          <traction-col>
            <traction-input
              id="default-loading-target-p1-plus-p2"
              data-attribute="default-loading-target-p1-plus-p2"
              title="Loading Target (P1 + P2)"
              :value="currentRun.wellDefaults.loading_target_p1_plus_p2"
              placeholder="Loading Target (P1 + P2)"
              type="number"
              step="0.05"
              @input="setDefaultLoadingTargetP1PlusP2"
            >
            </traction-input>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v10', 'v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-binding-kit-box-barcode">Binding Kit Box Barcode:</label>
          </traction-col>
          <traction-col>
            <traction-input
              id="default-binding-kit-box-barcode"
              data-attribute="default-binding-kit-box-barcode"
              :value="currentRun.wellDefaults.binding_kit_box_barcode"
              placeholder="Default Binding Kit Box Barcode for new wells"
              type="text"
              @input="setDefaultBindingKitBoxBarcode"
            >
            </traction-input>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v10', 'v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-on-plate-loading-concentration"
              >Default Binding Kit Box Barcode:</label
            >
          </traction-col>
          <traction-col>
            <traction-input
              id="default-on-plate-loading-concentration"
              data-attribute="default-on-plate-loading-concentration"
              :value="currentRun.wellDefaults.on_plate_loading_concentration"
              placeholder="Default On Plate Loading Concentration for new wells"
              type="text"
              @input="setDefaultOnPlateLoadingConcentration"
            >
            </traction-input>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-ccs-analysis-output-include-kinetics-information"
              >CCS Output Include Kinetics Information`</label
            >
          </traction-col>
          <traction-col>
            <traction-select
              id="default-ccs-analysis-output-include-kinetics-information"
              data-attribute="default-ccs-analysis-output-include-kinetics-information"
              title="CCS Analysis Output Include Kinetics Information"
              :options="ccsAnalysisOutputOptions"
              :value="currentRun.wellDefaults.ccs_analysis_output_include_kinetics_information"
              placeholder="Default CCS Analysis Output Include Kinetics Information for new wells"
              @change="setDefaultCcsAnalysisOutputIncludeKineticsInformation"
            >
            </traction-select>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-ccs-analysis-output-include-low-quality-reads"
              >CCS Output Include Kinetics Information`</label
            >
          </traction-col>
          <traction-col>
            <traction-select
              id="default-ccs-analysis-output-include-low-quality-reads"
              data-attribute="default-ccs-analysis-output-include-low-quality-reads"
              title="CCS Analysis Output Include Low Quality Reads"
              :options="ccsAnalysisOutputOptions"
              :value="currentRun.wellDefaults.ccs_analysis_output_include_low_quality_reads"
              placeholder="Default CCS Analysis Output Include Low Quality Reads for new wells"
              @input="setDefaultCcsAnalysisOutputIncludeLowQualityReads"
            >
            </traction-select>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-demultiplex-barcodes">Binding Kit Box Barcode:</label>
          </traction-col>
          <traction-col>
            <traction-select
              id="default-demultiplex-barcodes"
              data-attribute="default-demultiplex-barcodes"
              title="Demultiplex Barcodes"
              :options="generateHifiOptions"
              :value="currentRun.wellDefaults.demultiplex_barcodes"
              placeholder="Default Demultiplex Barcodes for new wells"
              @change="setDefaultDemultiplexBarcodes"
            >
            </traction-select>
          </traction-col>
        </traction-row>
      </div>
      <div v-if="['v11'].includes(selectedSmrtLinkVersion.name)">
        <traction-row>
          <traction-col>
            <label for="default-fivemc-calls-in-cpg-motifs">5mc Calls In CpG Motifs</label>
          </traction-col>
          <traction-col>
            <traction-select
              id="default-fivemc-calls-in-cpg-motifs"
              data-attribute="default-fivemc-calls-in-cpg-motifs"
              title="5mc Calls In CpG Motifs"
              :options="ccsAnalysisOutputOptions"
              :value="currentRun.wellDefaults.fivemc_calls_in_cpg_motifs"
              placeholder="Default 5mc Calls in CpG Motifs for new wells"
              @input="setDefaultFivemcCallsInCpgMotifs"
            >
            </traction-select>
          </traction-col>
        </traction-row>
      </div>
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
const { mapGetters, mapMutations } = createNamespacedHelpers('traction/pacbio/runs')

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
      generateHifiOptions: {
        '': [{ text: 'Please select a System Name', value: '', disabled: true }],
        'Sequel I': [
          { text: 'Please select a value', value: '', disabled: true },
          'In SMRT Link',
          'Do Not Generate',
        ],
        'Sequel II': [
          { text: 'Please select a value', value: '', disabled: true },
          'In SMRT Link',
          'Do Not Generate',
        ],
        'Sequel IIe': [
          { text: 'Please select a value', value: '', disabled: true },
          'In SMRT Link',
          'Do Not Generate',
          'On Instrument',
        ],
      },
      ccsAnalysisOutputOptions: ['Yes', 'No'],
    }
  },
  computed: {
    ...mapGetters(['currentRun']),
    selectedSmrtLinkVersion() {
      return Object.values(this.$store.getters['traction/pacbio/runCreate/smrtLinkVersionList']).find(
        (version) => version.id === this.currentRun.smrt_link_version_id,
      )
    },
  },
  methods: {
    ...mapMutations([
      'setDefaultMovieTime',
      'setDefaultGenerateHifi',
      'setDefaultCcsAnalysisOutput',
      'setDefaultPreExtensionTime',
      'setDefaultLoadingTargetP1PlusP2',
      'setDefaultBindingKitBoxBarcode',
      'setDefaultOnPlateLoadingConcentration',
      'setDefaultCcsAnalysisOutputIncludeKineticsInformation',
      'setDefaultCcsAnalysisOutputIncludeLowQualityReads',
      'setDefaultDemultiplexBarcodes',
      'setDefaultFivemcCallsInCpgMotifs',
    ]),
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
