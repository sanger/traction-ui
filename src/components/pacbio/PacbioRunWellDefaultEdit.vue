<template>
  <div class="pacbioRunWellDefaultEdit">
    <fieldset>
      <b-row>
        <b-col>
          <label for="default-movie-time">Movie Time:</label>
        </b-col>
        <b-col>
          <traction-select
            id="default-movie-time"
            :options="movieTimeOptions"
            :value="currentRun.wellDefaults.movie_time"
            title="Movie Time"
            @change="setDefaultMovieTime"
          >
          </traction-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label for="default-generate-hifi">Generate HiFi:</label>
        </b-col>
        <b-col>
          <traction-select
            id="default-generate-hifi"
            title="Generate HiFi"
            :options="generateHifiOptions[currentRun.system_name]"
            :value="currentRun.wellDefaults.generate_hifi"
            @change="setDefaultGenerateHifi"
          >
          </traction-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label for="default-ccs-analysis-output">Ccs Analysis Output:</label>
        </b-col>
        <b-col>
          <traction-select
            id="default-ccs-analysis-output"
            title="Ccs Analysis Output"
            :options="ccsAnalysisOutputOptions"
            :value="currentRun.wellDefaults.ccs_analysis_output"
            @change="setDefaultCcsAnalysisOutput"
          >
          </traction-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label for="default-pre-extension-time">Pre-extension time:</label>
        </b-col>
        <b-col>
          <b-form-input
            id="default-pre-extension-time"
            title="Pre-extension Time"
            :value="currentRun.wellDefaults.pre_extension_time"
            placeholder="Pre-extension time"
            @change="setDefaultPreExtensionTime"
          >
          </b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label for="default-loading-target">Loading Target (P1 + P2):</label>
        </b-col>
        <b-col>
          <b-form-input
            id="default-loading-target"
            title="Loading Target (P1 + P2)"
            :value="currentRun.wellDefaults.loading_target_p1_plus_p2"
            placeholder="Loading Target (P1 + P2)"
            type="number"
            :step="0.05"
            @change="setDefaultLoadingTarget"
          >
          </b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label for="default-binding-kit-box-barcode">Default Binding Kit Box Barcode:</label>
        </b-col>
        <b-col>
          <b-form-input
            id="default-binding-kit-box-barcode"
            :value="currentRun.wellDefaults.binding_kit_box_barcode"
            placeholder="Default Binding Kit Box Barcode for new wells"
            type="text"
            title="Default Binding Kit Box Barcode for new wells"
            @change="setDefaultBindingKitBoxBarcode"
          >
          </b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <p style="float: left; font-size: 12px">
            * Non-submitted fields, used for providing new wells with default values
          </p>
          <br />
        </b-col>
      </b-row>
    </fieldset>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('traction/pacbio/runs')

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
label {
  font-size: 1em;
}
</style>
