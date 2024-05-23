<template>
  <div data-type="plate-item">
    <Plate96SVG v-if="wells" data-attribute="plate96Svg" height="100%" width="100%">
      <Well
        v-for="well in mappedWells"
        :key="well.position"
        data-attribute="well"
        v-bind="well"
        @click="clickWell(well.id)"
      >
      </Well>
    </Plate96SVG>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Plate96SVG from '@/components/svg/Plate96SVG.vue'
import Well from '@/components/pacbio/PacbioWellItem.vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import useRootStore from '@/stores'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  barcode: {
    type: String,
    default: '',
  },
  wells: {
    type: Array,
    default: () => [],
  },
})
const store = usePacbioPoolCreateStore()
const rootStore = useRootStore()

const wellData = ref(store.wellList(props.wells))

const emit = defineEmits(['clickWell'])

const mappedWells = computed(() => {
  return Object.entries(rootStore.plateMap.wells).map(([position, mapWell]) => {
    const well = wellData.value.find((well) => well.position == position)
    return well ? { ...mapWell, ...well, source_id: well.id } : mapWell
  })
})

const clickWell = (id) => {
  emit('clickWell', id)
}
</script>
