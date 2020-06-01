<template>
  <g :transform="getMatrix" v-on:drop="drop" v-on:dragover="allowDrop" v-on:dragleave="endDrop" v-bind:class="{active: hover}">
     <defs>
      <filter id="blurFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
    </defs>
    <text x="25" y="30" class="medium">{{ position }}</text>
    <rect width="70" height="227" :class="status"/>
    <title v-text="this.library.name"></title>

    <foreignObject y="100" width="70" height="227">
      <div draggable="true" v-on:dragstart="drag(libraryName, $event)">
        <b-form-input v-model="libraryName" placeholder="Name" :id="elementId"  @change="updateFlowcell($event)" :value="library.name"></b-form-input>
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
      libraryName: '',
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
    drag (libraryName, event) {
      if (this.libraryName.length === 0) return
      const img = new Image()
      img.src = '/tube.png'
      event.dataTransfer.setDragImage(img, 80, 0)
      event.dataTransfer.setData('name', this.libraryName)

      this.hover = false

      // this.libraryName = ''
      // this.updateFlowcell()
    },
    drop (event) {
      event.preventDefault()
      this.libraryName = event.dataTransfer.getData('name')
      this.updateFlowcell(this.libraryName)

      let el = document.getElementById(this.libraryName)
      if (el === null) return 
      el.parentNode.hidden = true

      const img = document.createElement('img')
      img.src = "/tube.png"
      img.draggable = false
      img.height = "30"
      img.setAttribute('id', `${this.libraryName}-img`)

      el = document.getElementById(this.elementId)
      el.parentNode.appendChild(img)

      this.hover = false

     
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
    stroke: #ffffff;
    filter: url(#blurFilter);
  }
</style>
