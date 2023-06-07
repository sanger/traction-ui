<template>
  <div class="pacbioRunInfoEdit">
    <traction-section title="Run Details">
      <div class="flex flex-col text-left my-auto">
        <label class="text-md m-0" for="run-name">Run name:</label>
        <traction-muted-text classes="text-gray-700 text-xs italic font-light"
          >Auto-generated traction name</traction-muted-text
        >
        <traction-input
          id="run-name"
          v-model="runItem.name"
          :value="runItem.name"
          placeholder="Run name"
          type="text"
          disabled
        />
      </div>
      <div class="flex flex-col text-left my-auto">
        <label class="text-md m-0" for="run-name">Sequencing Kit Box Barcode:</label>
        <traction-input
          id="sequencing-kit-box-barcode"
          v-model="runItem.sequencing_kit_box_barcode"
          :value="runItem.sequencing_kit_box_barcode"
          placeholder="Sequencing Kit Box Barcode"
          type="text"
          classes="w-48"
          data-attribute="sequencing_kit_box_barcode"
        />
      </div>
      <div class="flex flex-col text-left my-auto">
        <label class="text-md m-0" for="run-name">DNA Control Complex Box Barcode:</label>
        <traction-input
          id="dna-control-complex-box-barcode"
          v-model="runItem.dna_control_complex_box_barcode"
          :value="runItem.dna_control_complex_box_barcode"
          placeholder="DNA Control Complex Box Barcode"
          type="text"
          classes="w-48"
          data-attribute="dna_control_complex_box_barcode"
        />
      </div>
      <div class="grid grid-cols-2 px-2 pb-2 my-auto">
        <label class="text-left" for="system-name">System Name:</label>
        <traction-select
          id="system-name"
          ref="systemName"
          v-model="runItem.system_name"
          :value="runItem.system_name"
          title="System Name"
          :options="systemNameOptions"
          data-attribute="system_name"
        />
      </div>
      <div class="grid grid-cols-2 px-2 pb-1 my-auto">
        <label class="text-left" for="smrt-link-version">SMRT Link Version:</label>
        <traction-select
          id="smrt-link-version"
          ref="smrtLinkVersion"
          :value="smrtLinkVersion.id"
          title="SMRT Link Version"
          :options="smrtLinkVersionSelectOptions"
          data-attribute="smrt_link_version"
          @input="setSmrtLinkVersion"
        />
      </div>
      <div class="grid grid-cols-2 px-2 pb-1 my-auto">
        <label class="text-left" for="comments">Comments:</label>
        <traction-input
          id="comments"
          v-model="runItem.comments"
          placeholder="Comments"
          type="text"
          classes="w-48"
          data-attribute="comments"
          :value="runItem.comments"
        />
      </div>
    </traction-section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/runCreate')

export default {
  name: 'PacbioRunInfoEdit',
  data() {
    return {
      systemNameOptions: ['Sequel IIe', 'Revio'],
    }
  },
  computed: {
    ...mapGetters(['runItem', 'smrtLinkVersionList', 'smrtLinkVersion']),
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
    ...mapActions(['updateSmrtLinkVersion']),
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
