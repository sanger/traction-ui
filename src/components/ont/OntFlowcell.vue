<template>
  <g :transform="getMatrix" v-on:drop="drop" v-on:dragover="allowDrop" >
    <text x="25" y="30" class="medium">{{ position }}</text>

    <rect width="70" height="227" v-bind:class="status"/>
    <title v-text="this.libraryName"></title>

    <foreignObject y="100" width="70" height="227">
      <b-form-input v-model="libraryName" placeholder="Name" :id="'libraryNameInput-'+this.position" @change="updateFlowcell"></b-form-input>
    </foreignObject>
  </g>
</template>

<script>
import UPDATE_FLOWCELL from '@/graphql/queries/client/UpdateFlowcell.mutation.gql'
import ONT_HERON_RUN_QUERY from '@/graphql/queries/client/OntHeronRun.query.gql'

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
      libraryName: ''
    }
  },
  methods: {
    updateFlowcell () {
      this.$apollo.mutate({
        mutation: UPDATE_FLOWCELL,
        variables: {
          position: this.position,
          libraryName: this.libraryName
        },
        update: (cache, { data: { updateFlowcell} }) => {
          const data = cache.readQuery({ query: ONT_HERON_RUN_QUERY })
          const currentFlowcell = data.run.flowcells.find(flowcell => flowcell.position === updateFlowcell.position)
          currentFlowcell.libraryName = updateFlowcell.libraryName
          cache.writeQuery({ query: ONT_HERON_RUN_QUERY, data })
        }
      })
    },
    allowDrop (event) {
      event.preventDefault()
    },
    drop (event) {
      this.libraryName = event.dataTransfer.getData('name')
      this.updateFlowcell()
    },
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
