<template>
  <traction-section title="Plates" class="min-w-[500px]">
    <LabwareMap v-slot="{ position }" name="96-well plate" :num-rows="8" :num-columns="12">
      <PacbioRunWell :position="position" :interactive="true" @click="onWellClick" />
    </LabwareMap>
    <WellEdit ref="modal" class="modal" :position="selectedWellPosition" @alert="alert"></WellEdit>
  </traction-section>
</template>

<script>
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'
import PacbioRunWell from '@/components/labware/PacbioRunWell'
import LabwareMap from './LabwareMap.vue'

export default {
  name: 'PacbioRunPlate',
  components: {
    WellEdit,
    LabwareMap,
    PacbioRunWell,
  },
  data() {
    return {
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
