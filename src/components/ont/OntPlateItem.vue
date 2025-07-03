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
/**
 * OntPlateItem
 *
 * Displays an SVG of a 96 well plate with well selection ability.
 *
 * Props:
 * - id: String. The unique identifier for the plate.
 * - barcode: String. The barcode of the plate.
 * - wells: Array. The list of well data for the plate.
 *
 * Emits:
 * - clickWell: Emitted when a well is clicked, with the well id as payload.
 *
 * This component uses Plate96SVG to render the plate and OntWellItem for each well.
 * It maps well data to the SVG positions and merges any additional well info from the store.
 */

import { ref, computed, onMounted } from 'vue'
import Plate96SVG from '@/components/svg/Plate96SVG.vue'
import Well from '@/components/ont/OntWellItem.vue'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
import useRootStore from '@/stores'

const props = defineProps({
  id: { type: String, default: '' },
  barcode: { type: String, default: '' },
  wells: { type: Array, default: () => [] },
})

const emit = defineEmits(['clickWell'])
const store = useOntPoolCreateStore()
const rootStore = useRootStore()

const wellData = ref([])

/**
 * Computes the mapped wells for the plate by merging SVG map data with well data from the store.
 * Each well is matched by position and merged if found, otherwise the SVG map data is used as-is.
 * @returns {Array<Object>} Array of well objects for rendering.
 */
const mappedWells = computed(() => {
  return Object.entries(rootStore.plateMap.wells).map(([position, mapWell]) => {
    return getWellAt(mapWell, position)
  })
})

/**
 * Finds and merges well data for a given SVG map well and position.
 * If a well with the given position exists in wellData, merges its properties with the SVG map well.
 * Otherwise, returns the SVG map well as-is.
 * @param {Object} mapWell - The SVG map well object.
 * @param {String} position - The well position (e.g., 'A1').
 * @returns {Object} The merged well object for rendering.
 */
function getWellAt(mapWell, position) {
  const well = wellData.value.find((well) => well.position == position)
  return well ? { ...mapWell, ...well } : mapWell
}

/**
 * Emits the 'clickWell' event with the well id when a well is clicked.
 * @param {String} id - The id of the clicked well.
 */
function clickWell(id) {
  emit('clickWell', id)
}

/**
 * On component mount, populates wellData from the store using the wells prop.
 */
onMounted(() => {
  wellData.value = store.wellList(props.wells)
})
</script>
