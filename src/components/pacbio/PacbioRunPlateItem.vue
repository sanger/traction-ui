<template>
  <div>
    <Plate96SVG :height="'100%'" :width="'100%'">
      <well
        v-for="(well, key) in plateMap.wells"
        :key="key"
        v-bind="well"
        @alert="alert"
        @click="onWellClick"
      >
      </well>
    </Plate96SVG>
    <WellEdit ref="modal" :position="selectedWellPosition" @alert="alert"></WellEdit>
  </div>
</template>

<script>
import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import Well from '@/components/pacbio/PacbioRunWellItem'
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'
export default {
  name: 'PacbioRunPlateItem',
  components: {
    Well,
    WellEdit,
    Plate96SVG,
  },
  emits: ['alert'],
  data() {
    return {
      selectedWellPosition: '',
    }
  },
  computed: {
    plateMap() {
      return PlateMap
    },
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
