<template>
  <ellipse :class="checkRequest" :cx="cx" :cy="cy" :rx="rx" :ry="ry">
    <title v-if="getRequest" v-text="getRequest.sample_name"></title>
  </ellipse>
</template>

<script>
export default {
  name: 'Well',
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
