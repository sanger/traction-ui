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
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

/**
 * OntWellItem
 *
 * Displays a single well as an SVG ellipse, colored and styled based on its request state.
 *
 * Props:
 * - row: String. The row label for the well (e.g., 'A').
 * - column: String. The column label for the well (e.g., '1').
 * - cx: String. The x-coordinate for the ellipse center.
 * - cy: String. The y-coordinate for the ellipse center.
 * - rx: String. The x-radius for the ellipse.
 * - ry: String. The y-radius for the ellipse.
 * - requests: Array. Array of request IDs associated with the well.
 *
 * Emits:
 * - click: Emitted when the well is clicked.
 *
 * This component uses the ONT pool store to determine the request state for the well and styles the ellipse accordingly.
 */

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
})

const emit = defineEmits(['click'])
const store = useOntPoolCreateStore()
/**
 * Computes the request object for this well from the store, if any.
 * @returns {Object|String} The request object or an empty string if none found.
 */
const getRequest = computed(() => {
  return props.requests && props.requests.length ? store.requestList(props.requests)[0] : ''
})

/**
 * Computes whether the well is filled (has a request) or empty.
 * @returns {String} 'filled' or 'empty'.
 */
const checkRequest = computed(() => (getRequest.value ? 'filled' : 'empty'))

/**
 * Computes the selection state of the well.
 * @returns {String} 'selected' if the request is selected, otherwise 'unselected'.
 */
const selected = computed(() => {
  if (getRequest.value) {
    return getRequest.value.selected ? 'selected' : 'unselected'
  } else {
    return 'unselected'
  }
})

/**
 * Computes the style object for the ellipse based on request and selection state.
 * @returns {Object} The style object for the ellipse.
 */
const ellipseStyle = computed(() => ({
  fill: checkRequest.value === 'filled' ? 'green' : 'black',
  stroke: selected.value === 'selected' ? 'yellow' : 'black',
  'stroke-width': selected.value === 'selected' ? '2' : '1',
}))

/**
 * Emits the 'click' event when the well is clicked.
 */
function click() {
  emit('click')
}
</script>
