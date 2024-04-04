<template>
  <!-- I have added a v-if as we are having render errors. I suspect we will need to fix this properly. -->
  <div v-if="storePlate">
    <div class="text-left mx-5 mb-5 flex flex-col">
      <traction-label classes="text-left my-2">Plate number: {{ plateNumber }}</traction-label>
      <traction-label classes="text-left">
        Sequencing Kit Box Barcode:
        <traction-field-error
          v-if="storePlate"
          :data-attribute="`sequencing-kit-box-barcode-${plateNumber}-error`"
          :error="validateSequencingKitBoxBarcode.error"
          :with-icon="validateSequencingKitBoxBarcode.valid"
        >
          <traction-input
            :id="`sequencing-kit-box-barcode-${plateNumber}`"
            v-model="storePlate.sequencing_kit_box_barcode"
            placeholder="Sequencing Kit Box Barcode"
            type="text"
            :data-attribute="`sequencing-kit-box-barcode-${plateNumber}`"
            class="w-full"
          />
        </traction-field-error>
      </traction-label>
      <traction-label v-if="isRevio" data-attribute="serial-number" classes="text-left"
        >Serial Number: {{ serialNumber }}</traction-label
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
import PacbioRunWellEdit from '@/components/pacbio/V1/PacbioRunWellEditV1.vue'
import PacbioRunWell from '@/components/labware/PacbioRunWellV1.vue'
import LabwareMap from '@/components/labware/LabwareMap.vue'
import { PacbioInstrumentTypes, validatePlate } from '@/lib/PacbioInstrumentTypes.js'
import { mapState } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

export default {
  name: 'PacbioRunPlateItem',
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
  emits: ['alert'],
  data() {
    return {
      selectedWellPosition: '',
    }
  },
  computed: {
    ...mapState(usePacbioRunCreateStore, ['instrumentType', 'getPlate']),
    isRevio() {
      // we should be able to use object equality here but it doesn't work
      // e.g. Object.is(this.instrumentType, PacbioInstrumentTypes.Revio)
      return this.instrumentType.key === PacbioInstrumentTypes.Revio.key
    },
    serialNumber() {
      return this.storePlate.sequencing_kit_box_barcode.substring(15, 20)
    },
    storePlate() {
      return this.getPlate(this.plateNumber)
    },
    validateSequencingKitBoxBarcode() {
      if (!this.storePlate) return
      return validatePlate({ plate: this.storePlate, instrumentType: this.instrumentType })
    },
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
