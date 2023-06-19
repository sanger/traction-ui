<template>
  <traction-section title="Plates">
    <flagged-feature name="enable_custom_modal">
      <template #disabled>
        <Plate96SVG height="100%" width="100%">
          <b-well v-for="(well, key) in plateMap.wells" :key="key" v-bind="well" @alert="alert">
          </b-well>
        </Plate96SVG>
      </template>
      <Plate96SVG height="100%" width="100%">
        <well
          v-for="(well, key) in plateMap.wells"
          :key="key"
          v-bind="well"
          @alert="alert"
          @click="onWellClick"
        >
        </well>
      </Plate96SVG>
      <WellEdit
        ref="modal"
        class="modal"
        :position="selectedWellPosition"
        @alert="alert"
      ></WellEdit>
    </flagged-feature>
  </traction-section>
</template>

<script>
import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import BWell from '@/components/pacbio/PacbioRunWellItemBootstrap'
import Well from '@/components/pacbio/PacbioRunWellItem'
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'

export default {
  name: 'PacbioRunPlateItem',
  components: {
    BWell,
    Well,
    WellEdit,
    Plate96SVG,
  },
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
