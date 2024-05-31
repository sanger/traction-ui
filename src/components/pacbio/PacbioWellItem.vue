<template>
  <ellipse
    :style="ellipseStyle"
    transform="matrix(0.91863074, 0, 0, 0.92029059, 955.85411, 1007.3112)"
    :class="[checkRequest, selected]"
    :cx="cx"
    :cy="cy"
    :rx="rx"
    :ry="ry"
    @click="click"
  >
    <title v-if="getRequest" v-text="getRequest.sample_name"></title>
  </ellipse>
</template>

<script setup>
import { computed } from 'vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'

const props = defineProps({
  /**
   * The name of the row with which the well is associated
   * @example 'A'
   */
  row: {
    type: String,
    default: '',
  },
  /**
   * The name of the column with which the well is associated
   * @example '1'
   */
  column: {
    type: String,
    default: '',
  },
  /**
   * The x-coordinate of the ellipse used to render the well. These values
   * are usually pre-caluated, and are extracted from '@/config/PlateMap'
   * by the plate SVG element
   * @example 60.440327
   */
  cx: {
    type: String,
    default: '',
  },
  /**
   * The x-coordinate of the ellipse used to render the well. These values
   * are usually pre-caluated, and are extracted from '@/config/PlateMap'
   * by the plate SVG element
   * @example 75.818642
   */
  cy: {
    type: String,
    default: '',
  },
  /**
   * The x-radius of the ellipse used to render the well. These values
   * are usually pre-caluated, and are extracted from '@/config/PlateMap'
   * by the plate SVG element
   * @example 10.906492
   */
  rx: {
    type: String,
    default: '',
  },
  /**
   * The y-radius of the ellipse used to render the well. These values
   * are usually pre-caluated, and are extracted from '@/config/PlateMap'
   * by the plate SVG element
   * @example 11.032985
   */
  ry: {
    type: String,
    default: '',
  },
  /**
   * An array of request ids associated with the well
   */
  requests: {
    type: Array,
    default() {
      return []
    },
  },
  source_id: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])
const pacbioPoolCreateStore = usePacbioPoolCreateStore()

const getRequest = computed(() => {
  return props.requests.length ? pacbioPoolCreateStore.requestList(props)[0] : ''
})

const checkRequest = computed(() => {
  return getRequest.value ? 'filled' : 'empty'
})

const selected = computed(() => {
  if (getRequest.value) {
    return getRequest.value.selected ? 'selected' : 'unselected'
  } else {
    return 'unselected'
  }
})

const ellipseStyle = computed(() => {
  return {
    fill: checkRequest.value === 'filled' ? 'green' : 'grey',
    stroke: selected.value == 'selected' ? 'yellow' : 'grey',
    'stroke-width': selected.value == 'selected' ? '2' : '1',
  }
})

const click = () => {
  emit('click')
}
</script>
