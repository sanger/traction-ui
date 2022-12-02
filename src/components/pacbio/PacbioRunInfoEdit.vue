<template>
  <div class="pacbioRunInfoEdit">
    <fieldset>
      <traction-row>
        <traction-col>
          <label for="run-name">Run name:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="run-name"
            :value="runName"
            placeholder="Run name"
            type="text"
            classes="w-48"
            disabled
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="sequencing-kit-box-barcode">Sequencing Kit Box Barcode:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="sequencing-kit-box-barcode"
            :value="sequencingKitBoxBarcode"
            placeholder="Sequencing Kit Box Barcode"
            type="text"
            classes="w-48"
            @input="setSequencingKitBoxBarcode"
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="dna-control-complex-box-barcode">DNA Control Complex Box Barcode:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="dna-control-complex-box-barcode"
            :value="dnaControlComplexBoxBarcode"
            placeholder="DNA Control Complex Box Barcode"
            type="text"
            classes="w-48"
            @input="setDNAControlComplexBoxBarcode"
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="system-name">System Name:</label>
        </traction-col>
        <traction-col>
          <traction-select
            id="system-name"
            ref="systemName"
            :value="systemName"
            title="System Name"
            :options="systemNameOptions"
            @input="setSystemName"
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="smrt-link-version">SMRT Link Version:</label>
        </traction-col>
        <traction-col>
          <traction-select
            id="smrt-link-version"
            ref="smrtLinkVersion"
            :value="smrtLinkVersionId"
            data-attribute="smrt-link-version"
            title="SMRT Link Version"
            :options="smrtLinkVersionSelectOptions"
            @input="setSmrtLinkVersionId"
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="comments">Comments:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="comments"
            :value="comments"
            placeholder="Comments"
            type="text"
            classes="w-48"
            @input="setComments"
          />
        </traction-col>
      </traction-row>
    </fieldset>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'PacbioRunInfoEdit',
  data() {
    return {
      systemNameOptions: ['Sequel I', 'Sequel II', 'Sequel IIe'],
    }
  },
  // A lot of the below could be improved. Can we use the store?
  computed: {
    smrtLinkVersionList() {
      return Object.values(this.$store.getters['traction/pacbio/runCreate/smrtLinkVersionList'])
    },
    smrtLinkVersionSelectOptions() {
      // Returns an array of objects with value and text properties to make
      // the options of smrt-link-version select drop-down list.

      return Object.values(
        this.$store.getters['traction/pacbio/runCreate/smrtLinkVersionList'],
      ).map(({ id, name }) => ({ value: id, text: name }))
    },
    selectedSmrtLinkVersion() {
      return Object.values(
        this.$store.getters['traction/pacbio/runCreate/smrtLinkVersionList'],
      ).find((version) => version.id == this.currentRun.smrt_link_version_id)
    },
    ...mapGetters(['currentRun']),
    ...mapState({
      runName: (state) => state.currentRun.name,
      sequencingKitBoxBarcode: (state) => state.currentRun.sequencing_kit_box_barcode,
      dnaControlComplexBoxBarcode: (state) => state.currentRun.dna_control_complex_box_barcode,
      comments: (state) => state.currentRun.comments,
      uuid: (state) => state.currentRun.uuid,
      systemName: (state) => state.currentRun.system_name,
      smrtLinkVersionId: (state) => state.currentRun.smrt_link_version_id,
    }),
  },
  methods: {
    ...mapMutations([
      'setSequencingKitBoxBarcode',
      'setDNAControlComplexBoxBarcode',
      'setComments',
      'setUuid',
      'setSystemName',
      'setSmrtLinkVersionId',
    ]),
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },
  },
}
</script>

<style>
.pacbioRunInfoEdit {
  border: solid;
  border-width: 1px;
  padding: 10px;
}
label {
  font-size: 1em;
}
</style>
