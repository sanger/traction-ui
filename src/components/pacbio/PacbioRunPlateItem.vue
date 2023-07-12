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
      <traction-label v-if="isRevio" data-attribute="serial-number" classes="text-left"
        >Serial Number: {{ serialNumber(plateNumber) }}</traction-label
      >
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
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/runCreate')

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
      plate: {},
    }
  },
  computed: {
    ...mapGetters(['runItem', 'instrumentType']),
    isRevio() {
      return this.instrumentType.name === PacbioInstrumentTypes.Revio.name
    },
  },
  created() {
    this.provider()
  },
  methods: {
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    onWellClick(position, plateNumber) {
      this.$refs.modal.showModalForPositionAndPlate(position, plateNumber)
    },
    serialNumber(plateNumber) {
      return this.runItem.plates[plateNumber].sequencing_kit_box_barcode.substring(15, 20)
    },
    async provider() {
      this.plate = await this.getOrCreatePlate({ plateNumber: this.plateNumber })
    },
    ...mapActions(['getOrCreatePlate']),
  },
}
</script>
