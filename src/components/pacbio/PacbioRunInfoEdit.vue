<template>
  <div class="pacbioRunInfoEdit">
    <traction-section title="Run Details">
      <traction-field-group
        label="Run Name"
        for="run-name"
        description="Auto-generated traction name"
      >
        <traction-input
          id="run-name"
          v-model="runItem.name"
          :value="runItem.name"
          placeholder="Run name"
          type="text"
          disabled
        />
      </traction-field-group>

      <traction-field-group
        label="DNA Control Complex Box Barcode"
        for="dna-control-complex-box-barcode"
      >
        <traction-input
          id="dna-control-complex-box-barcode"
          v-model="runItem.dna_control_complex_box_barcode"
          :value="runItem.dna_control_complex_box_barcode"
          placeholder="DNA Control Complex Box Barcode"
          type="text"
          data-attribute="dna_control_complex_box_barcode"
        />
      </traction-field-group>

      <traction-field-group label="System Name" for="system-name">
        <traction-select
          id="system-name"
          ref="systemName"
          v-model="runItem.system_name"
          :value="runItem.system_name"
          title="System Name"
          :options="instrumentNameList"
          data-attribute="system_name"
          :disabled="!newRecord"
          @input="setInstrumentType($event)"
        />
      </traction-field-group>

      <traction-field-group label="SMRT Link Version" for="smrt-link-version">
        <traction-select
          id="smrt-link-version"
          ref="smrtLinkVersion"
          :value="smrtLinkVersion.id"
          title="SMRT Link Version"
          :options="smrtLinkVersionSelectOptions"
          data-attribute="smrt_link_version"
          @input="setSmrtLinkVersion"
        />
      </traction-field-group>

      <traction-field-group label="Comments" for="comments">
        <traction-input
          id="comments"
          v-model="runItem.comments"
          placeholder="Comments"
          type="text"
          data-attribute="comments"
          :value="runItem.comments"
        />
      </traction-field-group>
    </traction-section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/runCreate')

export default {
  name: 'PacbioRunInfoEdit',
  props: {
    newRecord: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(['runItem', 'smrtLinkVersionList', 'smrtLinkVersion', 'instrumentNameList']),
    smrtLinkVersionSelectOptions() {
      // Returns an array of objects with value and text properties to make
      // the options of smrt-link-version select drop-down list.
      return Object.values(this.smrtLinkVersionList).map(({ id, name }) => ({
        value: id,
        text: name,
      }))
    },
  },
  methods: {
    ...mapActions(['updateSmrtLinkVersion', 'setInstrumentType']),
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },

    // Sets the runCreate/smrtLinkVersion store with the version selected in the component
    setSmrtLinkVersion(id) {
      const option = this.smrtLinkVersionList[id]
      this.updateSmrtLinkVersion(option)
    },
  },
}
</script>
