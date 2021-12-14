<template>
  <div class="pacbioRunInfoEdit">
    <b-row>
      <b-col>
        <b-form-input
          id="run-name"
          v-b-tooltip.hover
          :value="runName"
          placeholder="Run name"
          type="text"
          width="48"
          title="Run Name"
          readonly
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-input
          id="sequencing-kit-box-barcode"
          v-b-tooltip.hover
          :value="sequencingKitBoxBarcode"
          placeholder="Sequencing Kit Box Barcode"
          type="text"
          width="48"
          title="Sequencing Kit Box Barcode"
          @change="setSequencingKitBoxBarcode"
        />
      </b-col>
      <b-col>
        <b-form-input
          id="dna-control-complex-box-barcode"
          v-b-tooltip.hover
          :value="dnaControlComplexBoxBarcode"
          placeholder="DNA Control Complex Box Barcode"
          type="text"
          width="48"
          title="DNA Control Complex Box Barcode"
          @change="setDNAControlComplexBoxBarcode"
        />
      </b-col>
      <b-col>
        <b-form-select
          id="system-name"
          ref="systemName"
          v-b-tooltip.hover
          :value="systemName"
          :options="systemNameOptions"
          title="System Name"
          @change="setSystemName"
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-input
          id="comments"
          v-b-tooltip.hover
          :value="comments"
          placeholder="Comments"
          type="text"
          width="48"
          title="Comments"
          @change="setComments"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-input
          id="default-binding-kit-box-barcode"
          v-b-tooltip.hover
          style="max-width: 50%"
          :value="defaultBindingKitBoxBarcode"
          placeholder="Default Binding Kit Box Barcode for new wells"
          type="text"
          title="Default Binding Kit Box Barcode for new wells"
          @change="setDefaultBindingKitBoxBarcode"
        />
        <p style="float: left; font-size: 12px">
          * Non-submitted field, used for providing new wells with a default binding kit box barcode
        </p>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'PacbioRunInfoEdit',
  data() {
    return {
      systemNameOptions: [
        { text: 'System Name', value: '' },
        'Sequel I',
        'Sequel II',
        'Sequel IIe',
      ],
    }
  },
  computed: {
    ...mapGetters(['currentRun']),
    ...mapState({
      runName: (state) => state.currentRun.name,
      sequencingKitBoxBarcode: (state) => state.currentRun.sequencing_kit_box_barcode,
      dnaControlComplexBoxBarcode: (state) => state.currentRun.dna_control_complex_box_barcode,
      comments: (state) => state.currentRun.comments,
      uuid: (state) => state.currentRun.uuid,
      systemName: (state) => state.currentRun.system_name,
      defaultBindingKitBoxBarcode: (state) => state.currentRun.default_binding_kit_box_barcode,
      /* 
        Default binding kit box barcode is not a run attribute and it is not sent on update/create
        It exists to provide a default value when creating wells to autofill the well binding kit box barcode
      */
    }),
  },
  methods: {
    ...mapMutations([
      'setSequencingKitBoxBarcode',
      'setDNAControlComplexBoxBarcode',
      'setComments',
      'setUuid',
      'setSystemName',
      'setDefaultBindingKitBoxBarcode',
    ]),
  },
}
</script>

<style>
.pacbioRunInfoEdit {
  border: solid;
  border-width: 1px;
  padding: 10px;
}
</style>
