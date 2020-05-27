<template>
  <g :transform="getMatrix" v-on:drop="drop" v-on:dragover="allowDrop" >
    <text x="25" y="30" class="medium">{{ position }}</text>
    <rect width="70" height="227" v-bind:class="status"/>
    <title v-text="this.library.name"></title>

    <foreignObject y="100" width="70" height="227">
      <b-form-input placeholder="Name" :id="'libraryNameInput-'+this.position" @change="updateFlowcell($event)" v-bind:value="library.name"></b-form-input>
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
    xPos: {
      type: Number,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    library: {
      type: Object,
      required: true
    }
  },
  methods: {
    updateFlowcell (libraryName) {
      this.$emit('updateFlowcell', this.position, libraryName)
    },
    allowDrop (event) {
      event.preventDefault()
    },
    drop (event) {
      this.updateFlowcell(event.dataTransfer.getData('name'))
    }
  },
  computed: {
    // Determines the flowcells x/y coordinates
    getMatrix () {
      return 'matrix(1,0,0,1,'+this.xPos+',135)'
    },
    status () {
      if (this.library.name) {
        return 'filled'
      } else {
        return 'empty'
      }
    },
  },
  created () {
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
</style>
