<template>
  <div class="runInfo">

    <b-row>
      <b-col>
        <b-form-input :value="runName"
                @change="setName"
                id="name"
                placeholder="Run name"
                type="text"
                width="48"/>
      </b-col>
      <b-col>
        <b-form-input :value="templatePrepKitBoxBarcode"
                  @change="setTemplatePrepKitBoxBarcode"
                  id="template_prep_kit_box_barcode"
                  placeholder="Template Prep Kit Box Barcode"
                  type="text"
                  width="48"/>
      </b-col>
      <b-col>
        <b-form-input :value="bindingKitBoxBarcode"
                @change="setBindingKitBoxBarcode"
                id="binding_kit_box_barcode"
                placeholder="Binding Kit Box Barcode"
                type="text"
                width="48"/>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
          <b-form-input :value="sequencingKitBoxBarcode"
            @change="setSequencingKitBoxBarcode"
            id="sequencing_kit_box_barcode"
            placeholder="Sequencing Kit Box Barcode"
            type="text"
            width="48"/>
     </b-col>
      <b-col>
        <b-form-input :value="dnaControlComplexBoxBarcode"
          @change="setDNAControlComplexBoxBarcode"
          id="dna_control_complex_box_barcode"
          placeholder="DNA Control Complex Box Barcode"
          type="text"
          width="48"/>
     </b-col>
    <b-col>
      <b-form-input :value="comments"
        @change="setComments"
        id="comments"
        placeholder="Comments"
        type="text"
        width="48"/>
     </b-col>
    </b-row>
    
    <b-row>
      <b-col>
        <b-form-input :value="uuid"
          @change="setUuid"
          id="uuid"
          placeholder="UUID"
          type="text"
          width="48"/>
      </b-col>
      <b-col>
        <b-form-input :value="systemName"
          @change="setSystemName"
          id="system_name"
          placeholder="System Name"
          type="text"
          width="48"/>
      </b-col>
    </b-row>
  </div>

</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations} = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'PacbioRunInfo',
  methods: {
    ...mapMutations([
      'setName',
      'setTemplatePrepKitBoxBarcode',
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
      templatePrepKitBoxBarcode: state => state.currentRun.template_prep_kit_box_barcode,
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

.runInfo {
  border: solid;
  border-width: 1px;
  padding: 10px;
}

</style>