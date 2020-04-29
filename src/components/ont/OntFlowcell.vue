<template>
  <g :transform="getMatrix">
    <rect width="61" height="227"/>
  </g>
</template>

<script>

export default {
  name: 'OntFlowcell',
  props: {
    xPos: {
      type: Number,
      required: true
    },
  },
  computed: {
    // Determines the flowcells x/y coordinates
    getMatrix () {
      return 'matrix(1,0,0,1,'+this.xPos+',135)'
    }
  }
}
</script>

<style scoped lang="scss">
  rect {
    stroke-width: 2;
    fill: rgb(67, 136, 204);
    fill-opacity: 0.309804;
    stroke: rgb(27, 50, 128);
    stroke-opacity: 1;
  }
</style>
