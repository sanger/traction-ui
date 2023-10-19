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
          placeholder="Run name"
          type="text"
          disabled
        />
      </traction-field-group>

      <traction-field-group
        v-if="!smrtLinkVersionv12"
        label="DNA Control Complex Box Barcode"
        for="dna-control-complex-box-barcode"
      >
        <traction-input
          id="dna-control-complex-box-barcode"
          v-model="runItem.dna_control_complex_box_barcode"
          placeholder="DNA Control Complex Box Barcode"
          type="text"
          data-attribute="dna_control_complex_box_barcode"
        />
      </traction-field-group>

      <traction-field-group label="System Name" for="system-name">
        <!-- TODO: Not sure what this should be not v-model as the whole object needs to be updated -->
        <traction-select
          id="system-name"
          ref="systemName"
          :model-value="instrumentType.key"
          title="System Name"
          :options="instrumentTypeSelectOptions"
          data-attribute="system_name"
          :disabled="!newRecord"
          @update:modelValue="setInstrumentData($event)"
        />
      </traction-field-group>

      <traction-field-group label="SMRT Link Version" for="smrt-link-version">
        <traction-select
          id="smrt-link-version"
          ref="smrtLinkVersion"
          :model-value="smrtLinkVersion.id"
          title="SMRT Link Version"
          :options="smrtLinkVersionSelectOptions"
          data-attribute="smrt_link_version"
          @update:modelValue="setSmrtLinkVersion($event)"
        />
      </traction-field-group>

      <traction-field-group label="Comments" for="comments">
        <traction-input
          id="comments"
          v-model="runItem.comments"
          placeholder="Comments"
          type="text"
          data-attribute="comments"
        />
      </traction-field-group>
    </traction-section>
  </div>
</template>

<script>
/*
 @param {Array} list - An array of objects
  @param {String} key - The key of the object to use as the value of the select option
  @returns {Array} - An array of objects with value and text properties
*/
const createSelectOptions = (list, key) => {
  return list.map((item) => ({
    value: item[key],
    text: item.name,
  }))
}

import { mapActions, mapState } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

export default {
  name: 'PacbioRunInfoEdit',
  props: {
    newRecord: {
      type: Boolean,
    },
  },
  computed: {
    ...mapState(usePacbioRunCreateStore,['runItem', 'smrtLinkVersionList', 'smrtLinkVersion', 'instrumentType']),
    // Makes an array of objects with value and text properties to make
    // the options of smrt-link-version select drop-down list.
    // Only includes 'active' versions in the list, unless this record already has an inactive version as its value.
    smrtLinkVersionSelectOptions() {
      const list = Object.values(this.smrtLinkVersionList).filter(
        (version) => version.active || version.id === this.smrtLinkVersion.id,
      )
      return createSelectOptions(list, 'id')
    },
    instrumentTypeSelectOptions() {
      // Returns an array of objects with value and text properties to make
      // the options of instrument-type select drop-down list.
      const list = Object.values(PacbioInstrumentTypes).filter(
        (instrumentType) => instrumentType.active || instrumentType.key === this.instrumentType.key,
      )
      return createSelectOptions(list, 'key')
    },
    smrtLinkVersionv12() {
      return /^v12/.test(this.smrtLinkVersion.name)
    },
  },
  methods: {
    ...mapActions(usePacbioRunCreateStore,['setSmrtLinkVersion', 'setInstrumentData']),
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },
  },
}
</script>
