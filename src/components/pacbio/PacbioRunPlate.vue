<template>
  <traction-section title="Plates" class="min-w-[500px]">
    <LabwareMap v-slot="{ position }" :labware-type="labwareType">
      <PacbioRunWell :position="position" :interactive="true" @click="onWellClick" />
    </LabwareMap>
    <WellEdit ref="modal" class="modal" :position="selectedWellPosition" @alert="alert"></WellEdit>
  </traction-section>
</template>

<script>
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'
import PacbioRunWell from '@/components/labware/PacbioRunWell'
import LabwareMap from '@/components/labware/LabwareMap.vue'
import { LabwareTypes } from '../../lib/LabwareTypes'

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
    }
  },
  methods: {
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    onWellClick(position) {
      this.selectedWellPosition = position
      this.$refs.modal.showModalForPosition(position)
    },
  },
}
</script>
