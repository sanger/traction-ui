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
            :options="movieTimeOptions"
            :value="currentRun.wellDefaults.movie_time"
            title="Movie Time"
            @input="setDefaultMovieTime"
          >
          </traction-select>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-generate-hifi">Generate HiFi:</label>
        </traction-col>
        <traction-col>
          <traction-select
            id="default-generate-hifi"
            title="Generate HiFi"
            :options="generateHifiOptions[currentRun.system_name]"
            :value="currentRun.wellDefaults.generate_hifi"
            @input="setDefaultGenerateHifi"
          >
          </traction-select>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-ccs-analysis-output">Ccs Analysis Output:</label>
        </traction-col>
        <traction-col>
          <traction-select
            id="default-ccs-analysis-output"
            title="Ccs Analysis Output"
            :options="ccsAnalysisOutputOptions"
            :value="currentRun.wellDefaults.ccs_analysis_output"
            @change="setDefaultCcsAnalysisOutput"
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
            :value="currentRun.wellDefaults.pre_extension_time"
            placeholder="Pre-extension time"
            @input="setDefaultPreExtensionTime"
          >
          </traction-input>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-loading-target">Loading Target (P1 + P2):</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="default-loading-target"
            :value="currentRun.wellDefaults.loading_target_p1_plus_p2"
            placeholder="Loading Target (P1 + P2)"
            type="number"
            step="0.05"
            @input="setDefaultLoadingTarget"
          >
          </traction-input>
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-binding-kit-box-barcode">Default Binding Kit Box Barcode:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="default-binding-kit-box-barcode"
            :value="currentRun.wellDefaults.binding_kit_box_barcode"
            placeholder="Default Binding Kit Box Barcode for new wells"
            type="text"
            @input="setDefaultBindingKitBoxBarcode"
          >
          </traction-input>
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
