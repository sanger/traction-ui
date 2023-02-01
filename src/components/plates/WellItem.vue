<template>
  <ellipse :class="status" :cx="cx" :cy="cy" :rx="rx" :ry="ry">
    <title v-if="hasRequest" v-text="tooltip"></title>
  </ellipse>
</template>

<script>
export default {
  name: 'WellItem',
  props: {
    row: {
      type: String,
      default: '',
    },
    column: {
      type: String,
      default: '',
    },
    cx: {
      type: String,
      default: '',
    },
    cy: {
      type: String,
      default: '',
    },
    rx: {
      type: String,
      default: '',
    },
    ry: {
      type: String,
      default: '',
    },
    // eslint-disable-next-line vue/prop-name-casing
    well_info: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  computed: {
    hasRequest() {
      return this.well_info.requests.some((r) => r.sample_name)
    },
    status() {
      return this.hasRequest ? 'filled' : 'empty'
    },
    tooltip() {
      return this.hasRequest ? this.well_info.requests.map((r) => r.sample_name).join(', ') : ''
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
