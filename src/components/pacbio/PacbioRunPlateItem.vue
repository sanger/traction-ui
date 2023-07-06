<template>
  <div>
   <div class="text-left mx-5 mb-5 flex flex-col">
      <traction-label classes="text-left my-2">Plate number: {{ plateNumber }}</traction-label>
      <traction-label classes="text-left">Sequencing Kit Box Barcode:</traction-label>
      <traction-input
        id="sequencing-kit-box-barcode"
        v-model="runItem.plates[plateNumber].sequencing_kit_box_barcode"
        :value="runItem.plates[plateNumber].sequencing_kit_box_barcode"
        placeholder="Sequencing Kit Box Barcode"
        type="text"
        :data-attribute="`sequencing_kit_box_barcode-${plateNumber}`"
      />
    </div>
    <div :class="instrumentType.plateClasses">
      <LabwareMap
        v-slot="{ position }"
        :labware-type="instrumentType.labwareType"
        :name="instrumentType.labwareType.name"
        :data-attribute="`pacbio-run-plate-${plateNumber}`"
      >
        <PacbioRunWell
          :position="position"
          :plate-number="plateNumber"
          :interactive="true"
          @click="onWellClick"
        />
      </LabwareMap>
    </div>
    <PacbioRunWellEdit ref="modal" class="modal" @alert="alert"></PacbioRunWellEdit>
  </div>
</template>

<script>
import PacbioRunWellEdit from '@/components/pacbio/PacbioRunWellEdit'
import PacbioRunWell from '@/components/labware/PacbioRunWell'
import LabwareMap from '@/components/labware/LabwareMap.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PacbioRunPlateList',
  components: {
    PacbioRunWellEdit,
    LabwareMap,
    PacbioRunWell,
  },
  props: {
    plateNumber: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      selectedWellPosition: '',
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runCreate', ['runItem', 'instrumentType']),
  },
  methods: {
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    onWellClick(position, plateNumber) {
      this.$refs.modal.showModalForPositionAndPlate(position, plateNumber)
    },
  },
}
</script>
