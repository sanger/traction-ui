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
            width="48"
            title="Run Name"
            readonly
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-sequencing-kit-box-barcode">Sequencing Kit Box Barcode:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="sequencing-kit-box-barcode"
            :value="sequencingKitBoxBarcode"
            placeholder="Sequencing Kit Box Barcode"
            type="text"
            width="48"
            title="Sequencing Kit Box Barcode"
            @change="setSequencingKitBoxBarcode"
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-dna-control-complex-box-barcode"
            >DNA Control Complex Box Barcode:</label
          >
        </traction-col>
        <traction-col>
          <traction-input
            id="dna-control-complex-box-barcode"
            :value="dnaControlComplexBoxBarcode"
            placeholder="DNA Control Complex Box Barcode"
            type="text"
            width="48"
            title="DNA Control Complex Box Barcode"
            @change="setDNAControlComplexBoxBarcode"
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-system-name">System Name:</label>
        </traction-col>
        <traction-col>
          <traction-select
            id="system-name"
            ref="systemName"
            :value="systemName"
            :options="systemNameOptions"
            title="System Name"
            @change="setSystemName"
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
            v-model="selectedSmrtLinkVersionId"
            data-attribute="smrt-link-version"
            :options="smrtLinkVersionSelectOptions"
            title="SMRT Link Version"
          />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col>
          <label for="default-comments">Comments:</label>
        </traction-col>
        <traction-col>
          <traction-input
            id="comments"
            :value="comments"
            placeholder="Comments"
            type="text"
            width="48"
            title="Comments"
            @change="setComments"
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
    defaultSmrtLinkVersion() {
      // Returns the default smrt link version object
      return this.smrtLinkVersionList.find((version) => version.default)
    },
    runSmrtLinkVersion() {
      // Returns the smrt link version object of the run if the current run has
      // a valid smrt_link_version_id; null otherwise.
      const id = this.smrtLinkVersionId
      return this.smrtLinkVersionList.find((version) => version.id == id)
    },
    selectedSmrtLinkVersion() {
      // Returns the smrt link version object of the run or the default smrt
      // link version object, in that order.
      return this.runSmrtLinkVersion || this.defaultSmrtLinkVersion
    },
    selectedSmrtLinkVersionId: {
      get() {
        // Returns the id of the smrt link version of the run or the default.
        return this.selectedSmrtLinkVersion?.id
      },
      set(value) {
        // Sets the id of the smrt link version of the run after user selection.
        this.setSmrtLinkVersionId(value)
      },
    },
    ...mapGetters(['currentRun']),
    ...mapState({
      runName: (state) => state.currentRun.name,
      sequencingKitBoxBarcode: (state) => state.currentRun.sequencing_kit_box_barcode,
      dnaControlComplexBoxBarcode: (state) => state.currentRun.dna_control_complex_box_barcode,
      comments: (state) => state.currentRun.comments,
      uuid: (state) => state.currentRun.uuid,
      systemName: (state) => state.currentRun.system_name,
      // smrtLinkVersion: (state) => state.currentRun.smrt_link_version,
      smrtLinkVersionId: (state) => state.currentRun.smrt_link_version_id,
    }),
  },
  created() {
    this.provider()
  },
  methods: {
    ...mapMutations([
      'setSequencingKitBoxBarcode',
      'setDNAControlComplexBoxBarcode',
      'setComments',
      'setUuid',
      'setSystemName',
      // 'setSmrtLinkVersion',
      'setSmrtLinkVersionId',
    ]),
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },
    async provider() {
      await this.$store.dispatch('traction/pacbio/runCreate/fetchSmrtLinkVersions')
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
