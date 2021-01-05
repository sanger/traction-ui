<template>
  <div class="pacbioRunInfo">

    <b-row>
      <b-col>
        <b-form-input :value="runName"
                id="run_name"
                placeholder="Run name"
                type="text"
                width="48"
                v-b-tooltip.hover 
                title="Run Name"
                readonly/>
      </b-col>
      <b-col>
        <b-form-input :value="bindingKitBoxBarcode"
                @change="setBindingKitBoxBarcode"
                id="binding_kit_box_barcode"
                placeholder="Binding Kit Box Barcode"
                type="text"
                width="48"
                v-b-tooltip.hover 
                title="Binding Kit Box Barcode"/>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-input :value="sequencingKitBoxBarcode"
          @change="setSequencingKitBoxBarcode"
          id="sequencing_kit_box_barcode"
          placeholder="Sequencing Kit Box Barcode"
          type="text"
          width="48"
          v-b-tooltip.hover 
          title="Sequencing Kit Box Barcode"/>
      </b-col>
      <b-col>
        <b-form-input :value="dnaControlComplexBoxBarcode"
          @change="setDNAControlComplexBoxBarcode"
          id="dna_control_complex_box_barcode"
          placeholder="DNA Control Complex Box Barcode"
          type="text"
          width="48"
          v-b-tooltip.hover 
          title="DNA Control Complex Box Barcode"/>
      </b-col>
      <b-col>
        <b-form-select ref="systemName" 
                       id="systemName" 
                       :value="systemName" 
                       :options="systemNameOptions" 
                       @change="setSystemName"
                       v-b-tooltip.hover 
                       title="System Name"/>
      </b-col>
    </b-row>
    
    <b-row>
      <b-col>
        <b-form-input :value="comments"
          @change="setComments"
          id="comments"
          placeholder="Comments"
          type="text"
          width="48"
          v-b-tooltip.hover 
          title="Comments"/>
      </b-col>
    </b-row>
  </div>

</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations} = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'PacbioRunInfo',
  data () {
    return {
      systemNameOptions: [{ text: 'System Name', value: "" }, 'Sequel I', 'Sequel II', 'Sequel IIe'],
    }
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
  computed: {
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      runName: state => state.currentRun.name,
      bindingKitBoxBarcode: state => state.currentRun.binding_kit_box_barcode,
      sequencingKitBoxBarcode: state => state.currentRun.sequencing_kit_box_barcode,
      dnaControlComplexBoxBarcode: state => state.currentRun.dna_control_complex_box_barcode,
      comments: state => state.currentRun.comments,
      uuid: state => state.currentRun.uuid,
      systemName: state => state.currentRun.system_name,
    })
  }
}
</script>

<style>

.pacbioRunInfo {
  border: solid;
  border-width: 1px;
  padding: 10px;
}

</style>