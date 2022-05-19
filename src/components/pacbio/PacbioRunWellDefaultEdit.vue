<template>
  <div class="pacbioRunWellDefaultEdit">
    <b-row>
      <b-col>
        <b-form-input
          id="run-name"
          v-b-tooltip.hover
          placeholder="Well metrics - to provide default values for new well"
          type="text"
          width="48"
          title="Well metrics"
          readonly
        >
        </b-form-input>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-select
          id="default-movie-time"
          v-b-tooltip.hover
          :value="defaultMovieTime"
          :options="movieTimeOptions"
          placeholder="Movie Time"
          title="Movie Time"
          @change="setDefaultMovieTime"
        >
        </b-form-select>
      </b-col>
      <b-col>
        <b-form-select
          id="default-generate-hiFi"
          v-b-tooltip.hover
          :value="defaultGenerateHifi"
          placeholder="Generate HiFi"
          title="Generate HiFi"
          :options="generateHifiOptions[currentRun.system_name]"
          @change="setDefaultGenerateHifi"
        >
        </b-form-select>
      </b-col>
      <b-col>
        <b-form-select
          id="default-ccs-analysis-output"
          v-b-tooltip.hover
          :value="defaultCcsAnalysisOutput"
          placeholder="Ccs Analysis Output"
          title="Ccs Analysis Output"
          :options="ccsAnalysisOutputOptions"
          @change="setDefaultCcsAnalysisOutput"
        >
        </b-form-select>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-input
          id="default-pre-extension-time"
          v-b-tooltip.hover
          :value="defaultPreExtensionTime"
          title="Pre-extension Time"
          placeholder="Pre-extension time"
          @change="setDefaultPreExtensionTime"
        >
        </b-form-input>
      </b-col>
      <b-col>
        <b-form-input
          id="default-loading-target"
          v-b-tooltip.hover
          :value="defaultLoadingTarget"
          title="Loading Target (P1 + P2)"
          placeholder="Loading Target (P1 + P2)"
          type="number"
          :step="0.05"
          @change="setDefaultLoadingTarget"
        >
        </b-form-input>
      </b-col>
      <b-col>
        <b-form-input
          id="default-binding-kit-box-barcode"
          v-b-tooltip.hover
          :value="defaultBindingKitBoxBarcode"
          placeholder="Default Binding Kit Box Barcode for new wells"
          type="text"
          title="Default Binding Kit Box Barcode for new wells"
          @change="setDefaultBindingKitBoxBarcode"
        >
        </b-form-input>
      </b-col>
    </b-row>
    <p style="float: left; font-size: 12px">
      * Non-submitted fields, used for providing new wells with a default values
    </p>
    <br />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('traction/pacbio/runs')
const pre_extension_time = 2
const ccs_analysis_output = 'Yes'
const loading_target = 0.85
const generateHiFiDefault = (systemName) => {
  switch (systemName) {
    case 'Sequel I':
    case 'Sequel II':
      return 'In SMRT Link'
    case 'Sequel IIe':
      return 'On Instrument'
    default:
      return ''
  }
}

export default {
  name: 'PacbioRunWellDefaultEdit',
  data() {
    return {
      movieTimeOptions: [
        { text: 'Movie Time', value: '', disabled: true },
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
    ...mapState({
      defaultMovieTime: (state) => state.currentRun.default_movie_time,
      defaultGenerateHifi: (state) =>
        state.currentRun.default_generate_hifi || generateHiFiDefault(state.currentRun.system_name),
      defaultCcsAnalysisOutput: (state) =>
        state.currentRun.default_ccs_analysis_output || ccs_analysis_output,
      defaultPreExtensionTime: (state) =>
        state.currentRun.default_pre_extension_time || pre_extension_time,
      defaultLoadingTarget: (state) => state.currentRun.default_loading_target || loading_target,
      defaultBindingKitBoxBarcode: (state) => state.currentRun.default_binding_kit_box_barcode,
      /*
          It provides default values when creating wells to autofill the well attributes
          and it is not sent on update/create.
        */
    }),
  },
  updated() {
    this.$store.commit(
      'traction/pacbio/runs/setDefaultCcsAnalysisOutput',
      this.defaultCcsAnalysisOutput,
    )
    this.$store.commit(
      'traction/pacbio/runs/setDefaultPreExtensionTime',
      this.defaultPreExtensionTime,
    )
    this.$store.commit('traction/pacbio/runs/setDefaultLoadingTarget', this.defaultLoadingTarget)
  },
  methods: {
    ...mapMutations([
      'setDefaultMovieTime',
      'setDefaultGenerateHifi',
      'setDefaultCcsAnalysisOutput',
      'setDefaultPreExtensionTime',
      'setDefaultLoadingTarget',
      'setDefaultBindingKitBoxBarcode',
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
</style>
