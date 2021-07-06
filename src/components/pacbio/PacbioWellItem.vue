<template>
  <ellipse :class="checkRequest" :cx="cx" :cy="cy" :rx="rx" :ry="ry">
    <title v-if="getRequest" v-text="getRequest.sample_name"></title>
  </ellipse>
</template>

<script>
export default {
  name: 'Well',
  props: {
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
     * An array of requests associated with the well
     */
    requests: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    checkRequest() {
      return this.getRequest ? 'filled' : 'empty'
    },
    getRequest() {
      return this.requests
        ? this.$store.getters['traction/pacbio/poolCreate/requestList'](this.requests)[0]
        : ''
    },
  },
}
</script>

<style scoped lang="scss">
ellipse {
  transform: matrix(0.91863074, 0, 0, 0.92029059, 955.85411, 1007.3112);
  stroke: #000000;
}
.filled {
  fill: green;
}
</style>
