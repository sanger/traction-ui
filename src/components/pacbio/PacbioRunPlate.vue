<template>
  <traction-section title="Plates" class="min-w-[500px]">
    <div class="flex flex-row w-full">
      <div v-for="plate in labware.plateCount" :key="plate" class="w-full">
        <div class="text-left mx-5 mb-5">
          <traction-label classes="text-left">Plate number: {{ plate }}</traction-label>
          <traction-label classes="text-left">Sequencing Kit Box Barcode:</traction-label>
          <traction-input
            id="sequencing-kit-box-barcode"
            v-model="runItem.plates[plate].sequencing_kit_box_barcode"
            :value="runItem.plates[plate].sequencing_kit_box_barcode"
            placeholder="Sequencing Kit Box Barcode"
            type="text"
            data-attribute="sequencing_kit_box_barcode"
          />
        </div>
        <div :class="labware.plateClasses">
          <LabwareMap
            v-slot="{ position }"
            :labware-type="labware.labwareType"
            :name="labware.labwareType.name"
          >
            <PacbioRunWell
              :position="position"
              :plate-number="plate"
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
import { LabwareTypes } from '@/lib/LabwareTypes'
import { mapGetters } from 'vuex'

// Move to config
const REVIO = 'Revio'
const SEQUEL_IIE = 'Sequel IIe'

export default {
  name: 'PacbioRunPlate',
  components: {
    WellEdit,
    LabwareMap,
    PacbioRunWell,
  },
  data() {
    return {
      labwareType: LabwareTypes.Plate96,
      selectedWellPosition: '',
      selectedPlate: 1,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runCreate', ['runItem']),
    labware() {
      if (this.runItem.system_name == REVIO) {
        return {
          plateCount: 2,
          labwareType: LabwareTypes.Plate4,
          plateClasses: 'w-1/3 mx-auto',
        }
      } else if (this.runItem.system_name == SEQUEL_IIE) {
        return {
          plateCount: 1,
          labwareType: LabwareTypes.Plate96,
          plateClasses: 'w-full',
        }
      }
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
