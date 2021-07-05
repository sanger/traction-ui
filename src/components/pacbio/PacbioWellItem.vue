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
    wellId: {
      type: String,
      default() {
        return ''
      },
    },
  },
  computed: {
    checkRequest() {
      return this.getRequest ? 'filled' : 'empty'
    },
    getRequest() {
      if (this.wellId) {
        return this.$store.getters['traction/pacbio/poolCreate/wellRequest'](this.wellId)
      }
      return ''
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
