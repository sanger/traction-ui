<template>
  <g :transform="getMatrix" v-on:drop="drop" v-on:dragover="allowDrop" v-on:dragleave="endDrop" v-bind:class="{active: hover}">
     <defs>
      <filter id="blurFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
    </defs>
    <text x="25" y="30" class="medium">{{ position }}</text>
    <rect width="70" height="227" v-on:dragleave="endDrop" :class="[{active: hover}, status]"/>
    <title v-text="this.library.name"></title>

    <foreignObject width="70" height="227" v-on:dragleave="endDrop" :class="[{active: hover}, status]">
      <b-form-input placeholder="Name" :id="'libraryNameInput-'+this.position" @change="updateFlowcell($event)" :value="library.name"></b-form-input>
    </foreignObject>
  </g>
</template>

<script>
// Flowcell component 
// is only to display a current value 
// and to accept drag and drop events, 
// notifying the parent when they happen.

export default {
  name: 'OntFlowcell',
  props: {
    position: {
      type: Number,
      required: true
    },
    library: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      hover: false
    }
  },
  methods: {
    updateFlowcell (libraryName) {
      this.$emit('updateFlowcell', this.position, libraryName)
    },
    allowDrop (event) {
      event.preventDefault()
      this.hover = true
    },
    endDrop (event) {
      event.preventDefault()
      this.hover = false
    },
    drop (event) {
      event.preventDefault()
      this.updateFlowcell(event.dataTransfer.getData('name'))
      this.hover=false;
    }
  },
  computed: {
    // Determines the flowcells x/y coordinates
    getMatrix () {
      let xPos = (this.position - 1) * 80 + 240
      return 'matrix(1,0,0,1,'+xPos+',135)'
    },
    status () {
      if (this.library.name) {
        return 'filled'
      } else {
        return 'empty'
      }
    },
    elementId () {
      return `libraryNameInput-${this.position}`
    }
  }
}
</script>

<style scoped lang="scss">
  rect {
    fill-opacity: 0.309804;
    stroke: rgb(0, 0, 0);
  }
  .filled{
    fill:green;
  }
  .empty {
    fill: red;
  }
  .active {
    stroke: white;
    stroke-width: 2px;
  }
  input{
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    width:170px;
    position: absolute;
    left: -50px;
    top: 100px;
  }
</style>
