<template>
  <g :transform="getMatrix" v-on:drop="drop" v-on:dragover="allowDrop" v-on:dragleave="endDrop">

    <text x="25" y="30" class="medium">{{ position }}</text>
    <rect width="70" height="227" :class="[{active: hover}, status]"/>
    <title v-text="this.library.name"></title>

    <foreignObject width="70" height="227">
      <div draggable="true" v-on:dragstart="drag($event)">
        <b-form-input placeholder="Name" :id="elementId"  @change="updateFlowcell($event)" :value="library.name"></b-form-input>
        <img left src="/tube.png" height="30" draggable="false" :class="status"/>
      </div>
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
    allowDrop (event) {
      event.preventDefault()
      this.hover = true
    },
    endDrop (event) {
      event.preventDefault()
      this.hover = false
    },
    drag (event) {
      if (name === 0) return
      const img = new Image()
      img.src = '/tube.png'
      event.dataTransfer.setDragImage(img, 80, 0)
      event.dataTransfer.setData('flowcellPosition', this.position)
      event.dataTransfer.setData('libraryName', this.library.name)

      this.hover = false
    },
    drop (event) {
      event.preventDefault()
      let libraryName = event.dataTransfer.getData('libraryName')

      this.updateFlowcell(libraryName)
      this.updateLibraryList(libraryName)

      this.hover = false
    },
    // Update is being called twice when a library is dragged?
    updateFlowcell (libraryName) {
      this.$emit('updateFlowcell', this.position, libraryName)
    },
    updateLibraryList(libraryName) {
      let assignedToFlowcell = true
      this.$emit('updateLibraryList', libraryName, assignedToFlowcell)
    },
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

  img.empty {
    display: none;
  }

  .filled {
    fill:green;
  }
  .empty {
    fill: red;
  }
  .active {
    stroke: white;
  }
  input {
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
