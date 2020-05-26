<template>
  <g :transform="getMatrix" v-on:drop="drop" v-on:dragover="allowDrop" >
    <text x="25" y="30" class="medium">{{ position }}</text>
    <rect width="70" height="227" v-bind:class="status"/>
    <title v-text="this.libraryName"></title>

    <foreignObject y="100" width="70" height="227">
      <b-form-input placeholder="Name" :id="'libraryNameInput-'+this.position" @change="updateFlowcell" v-bind:value="libraryName"></b-form-input>
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
    },
    library: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      libraryName: this.library.name
    }
  },
  methods: {
    updateFlowcell () {
      console.log("!!! #7 updateFlowcell")
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
    drop (event) {
      this.libraryName = event.dataTransfer.getData('name')
      this.updateFlowcell()
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
    }
  },
  // apollo: {
  //   libraryName: {

  //     query: GET_CLIENT_FLOWCELL_LIBRARY_NAME,
  //     variables () {
  //       return {
  //         position: this.position,
  //       }
  //     }
  //   }
  // },
  created () {
    console.log("!!! #5 flowcell comp created")
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
