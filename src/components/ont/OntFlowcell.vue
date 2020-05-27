<template>
  <g :transform="getMatrix" v-on:drop="drop" v-on:dragover="allowDrop" draggable="true" v-on:dragstart="drag(libraryName, $event)">
    <text x="25" y="30" class="medium">{{ position }}</text>
    <rect width="70" height="227" v-bind:class="status"/>
    <title v-text="this.libraryName"></title>

    <foreignObject y="100" width="70" height="227">
      <div draggable="true" v-on:dragstart="drag(libraryName, $event)">
        <b-form-input v-model="libraryName" placeholder="Name" :id="elementId" @change="updateFlowcell"></b-form-input>
      </div>
      
    </foreignObject>
  </g>
</template>

<script>
import GET_CLIENT_FLOWCELL_LIBRARY_NAME from '@/graphql/queries/client/GetClientFlowcellLibraryName.query.gql'
import UPDATE_CLIENT_FLOWCELL from '@/graphql/queries/client/UpdateClientFlowcell.mutation.gql'

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
  data () {
    return {
      libraryName: '',
    }
  },
  methods: {
    updateFlowcell () {
      this.$apollo.mutate({
        mutation: UPDATE_CLIENT_FLOWCELL,
        variables: {
          position: this.position,
          libraryName: this.libraryName
        }
      })
    },
    allowDrop (event) {
      event.preventDefault()
    },
    drag (libraryName, event) {
      if (this.libraryName.length === 0) return
      const img = new Image()
      img.src = '/tube.png'
      event.dataTransfer.setDragImage(img, 80, 0)
      event.dataTransfer.setData('name', this.libraryName)
    },
    drop (event) {
      event.preventDefault()
      this.libraryName = event.dataTransfer.getData('name')
      this.updateFlowcell()

      let el = document.getElementById(this.libraryName)
      el.parentNode.hidden = true

      const img = document.createElement('img')
      img.src = "/tube.png"
      img.draggable = false
      img.height = "30"

      console.log(img)
      el = document.getElementById(this.elementId)
      el.parentNode.appendChild(img)

    }
  },
  computed: {
    // Determines the flowcells x/y coordinates
    getMatrix () {
      return 'matrix(1,0,0,1,'+this.xPos+',135)'
    },
    status () {
      if (this.libraryName) {
        return 'filled'
      } else {
        return 'empty'
      }
    },
    elementId () {
      return `libraryNameInput-${this.position}`
    }
  },
  apollo: {
    libraryName: {
      query: GET_CLIENT_FLOWCELL_LIBRARY_NAME,
      variables () {
        return {
          position: this.position,
        }
      },
      pollInterval: 100
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
</style>
