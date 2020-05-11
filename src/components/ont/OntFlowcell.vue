<template>
  <g :transform="getMatrix">
    <text x="25" y="30" class="medium">{{ position }}</text>

    <rect width="61" height="227"/>

    <foreignObject y="100" width="70" height="227">
      <b-form-input v-model="libraryBarcode" placeholder="Barcode" id="library_barcode"></b-form-input>
    </foreignObject>
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
    position: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      libraryBarcode: ''
    }
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
