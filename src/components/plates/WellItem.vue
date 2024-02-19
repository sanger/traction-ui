<template>
  <ellipse
    :data-status="checkRequest"
    :style="ellipseStyle"
    transform="matrix(0.91863074, 0, 0, 0.92029059, 955.85411, 1007.3112)"
    :class="[checkRequest, selected]"
    :cx="cx"
    :cy="cy"
    :rx="rx"
    :ry="ry"
  >
    <title v-if="getRequest" v-text="tooltip"></title>
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
    checkRequest() {
      return this.getRequest ? 'filled' : 'empty'
    },
    getRequest() {
      return this.well_info.requests.some((r) => r.sample_name)
    },
    tooltip() {
      return this.getRequest ? this.well_info.requests.map((r) => r.sample_name).join(', ') : ''
    },
    selected() {
      if (this.getRequest) {
        return this.getRequest.selected ? 'selected' : 'unselected'
      } else {
        return 'unselected'
      }
    },
    ellipseStyle() {
      return {
        fill: this.checkRequest === 'filled' ? 'green' : 'black',
        stroke: this.selected == 'selected' ? 'yellow' : 'black',
        'stroke-width': this.selected == 'selected' ? '2' : '1',
      }
    },
  },
}
</script>
