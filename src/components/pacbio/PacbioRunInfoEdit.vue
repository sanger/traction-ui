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
            :value="runItem.id"
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
            v-model="runItem.sequencing_kit_box_barcode"
            placeholder="Sequencing Kit Box Barcode"
            type="text"
            classes="w-48"
            data-attribute="sequencing_kit_box_barcode"
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
            v-model="runItem.dna_control_complex_box_barcode"
            placeholder="DNA Control Complex Box Barcode"
            type="text"
            classes="w-48"
            data-attribute="dna_control_complex_box_barcode"
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
            :v-model="runItem.system_name"
            title="System Name"
            :options="systemNameOptions"
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
            :v-model="runItem.smrt_link_version_id"
            title="SMRT Link Version"
            :options="smrtLinkVersionSelectOptions"
            data-attribute="smrt_link_version"
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
            v-model="runItem.comments"
            placeholder="Comments"
            type="text"
            classes="w-48"
            data-attribute="comments"
          />
        </traction-col>
      </traction-row>
    </fieldset>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/runCreate')

export default {
  name: 'PacbioRunInfoEdit',
  data() {
    return {
      systemNameOptions: ['Sequel I', 'Sequel II', 'Sequel IIe'],
    }
  },
  // A lot of the below could be improved. Can we use the store?
  computed: {
    smrtLinkVersionSelectOptions() {
      // Returns an array of objects with value and text properties to make
      // the options of smrt-link-version select drop-down list.

      return Object.values(this.smrtLinkVersionList).map(({ id, name }) => ({
        value: id,
        text: name,
      }))
    },
    ...mapGetters(['runItem', 'smrtLinkVersionList']),
  },
  methods: {
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
