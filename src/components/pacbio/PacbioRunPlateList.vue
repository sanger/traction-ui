<template>
  <traction-section title="Plates" class="min-w-[500px]">
    <div class="flex flex-row w-full">
      <div v-for="plateNumber in labware.plateCount" :key="plateNumber" class="w-full">
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
        <div :class="labware.plateClasses">
          <LabwareMap
            v-slot="{ position }"
            :labware-type="labware.labwareType"
            :name="labware.labwareType.name"
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
      </div>
    </div>
    <WellEdit ref="modal" class="modal" @alert="alert"></WellEdit>
  </traction-section>
</template>

<script>
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'
import PacbioRunWell from '@/components/labware/PacbioRunWell'
import LabwareMap from '@/components/labware/LabwareMap.vue'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'
import { mapGetters } from 'vuex'

export default {
  name: 'PacbioRunPlateList',
  components: {
    WellEdit,
    LabwareMap,
    PacbioRunWell,
  },
  data() {
    return {
      selectedWellPosition: '',
      selectedPlate: 1,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runCreate', ['runItem']),
    labware() {
      if (this.runItem.system_name == PacbioInstrumentTypes.Revio.name) {
        return PacbioInstrumentTypes.Revio
      } else if (this.runItem.system_name == PacbioInstrumentTypes.SequelIIe.name) {
        return PacbioInstrumentTypes.SequelIIe
      }
      return {}
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
