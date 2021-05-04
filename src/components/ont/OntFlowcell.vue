<template>
  <g :transform="getMatrix" @drop="drop" @dragover="allowDrop" @dragleave="endDrop">
    <text x="25" y="30" class="medium">
      {{ position }}
    </text>
    <rect width="70" height="227" :class="[{ active: hover }, status]" />
    <title v-text="library.name" />

    <foreignObject width="70" height="227">
      <div draggable="true" @dragstart="drag($event)">
        <b-form-input
          :id="elementId"
          placeholder="Name"
          :value="library.name"
          @change="updateFlowcell(position, $event)"
        />
        <img left src="/tube.png" height="30" draggable="false" :class="status" />
      </div>
    </foreignObject>
  </g>
</template>

<script>
// Flowcell component
// is only to display a current value
// and to accept drag and drop events, with the help of DragHelper
// notifying the parent when they happen.
import DragHelper from '@/mixins/DragHelper'

export default {
  name: 'OntFlowcell',
  mixins: [DragHelper],
  props: {
    position: {
      type: Number,
      required: true,
    },
    library: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // Determines the flowcells x/y coordinates
    getMatrix() {
      let xPos = (this.position - 1) * 80 + 240
      return 'matrix(1,0,0,1,' + xPos + ',135)'
    },
    status() {
      if (this.library.name) {
        return 'filled'
      } else {
        return 'empty'
      }
    },
    elementId() {
      return `libraryNameInput-${this.position}`
    },
  },
  methods: {
    drag(event) {
      const img = new Image()
      img.src = '/tube.png'
      event.dataTransfer.setDragImage(img, 80, 0)
      event.dataTransfer.setData('flowcellPosition', this.position)
      event.dataTransfer.setData('libraryName', this.library.name)

      event.dataTransfer.setData('sourceType', 'FLOWCELL')

      this.hover = false
    },
    drop(event) {
      event.preventDefault()
      let libraryName = event.dataTransfer.getData('libraryName')
      this.updateFlowcell(this.position, libraryName)

      if (event.dataTransfer.getData('sourceType') === 'FLOWCELL') {
        let flowcellPosition = parseInt(event.dataTransfer.getData('flowcellPosition'))
        this.updateFlowcell(flowcellPosition, '')
      } else if (event.dataTransfer.getData('sourceType') === 'LIBRARY_LIST') {
        this.updateLibraryList(libraryName, true)
      }
      this.hover = false
    },
  },
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
  fill: green;
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
  width: 170px;
  position: absolute;
  left: -50px;
  top: 100px;
}
</style>
