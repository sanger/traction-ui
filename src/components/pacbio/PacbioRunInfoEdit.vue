<template>
  <div class="pacbioRunInfoEdit">
    <b-row>
      <b-col>
        <b-form-input
          id="run_name"
          v-b-tooltip.hover
          :value="runName"
          placeholder="Run name"
          type="text"
          width="48"
          title="Run Name"
          readonly
        />
      </b-col>
      <b-col>
        <b-form-input
          id="binding_kit_box_barcode"
          v-b-tooltip.hover
          :value="bindingKitBoxBarcode"
          placeholder="Binding Kit Box Barcode"
          type="text"
          width="48"
          title="Binding Kit Box Barcode"
          @change="setBindingKitBoxBarcode"
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-input
          id="sequencing_kit_box_barcode"
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
          id="dna_control_complex_box_barcode"
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
          id="systemName"
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
      bindingKitBoxBarcode: (state) => state.currentRun.binding_kit_box_barcode,
      sequencingKitBoxBarcode: (state) => state.currentRun.sequencing_kit_box_barcode,
      dnaControlComplexBoxBarcode: (state) => state.currentRun.dna_control_complex_box_barcode,
      comments: (state) => state.currentRun.comments,
      uuid: (state) => state.currentRun.uuid,
      systemName: (state) => state.currentRun.system_name,
    }),
  },
  methods: {
    ...mapMutations([
      'setBindingKitBoxBarcode',
      'setSequencingKitBoxBarcode',
      'setDNAControlComplexBoxBarcode',
      'setComments',
      'setUuid',
      'setSystemName',
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
