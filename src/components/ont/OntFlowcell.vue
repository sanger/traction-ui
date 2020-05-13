<template>
  <g :transform="getMatrix">
    <text x="25" y="30" class="medium">{{ position }}</text>

    <rect width="61" height="227"/>

    <foreignObject y="100" width="70" height="227">
      <b-form-input placeholder="Library Name" id="libraryName" @change="setLibraryName"></b-form-input>
    </foreignObject>
  </g>
</template>

<script>
import UPDATE_FLOWCELL from '@/graphql/client/queries/UpdateFlowcell.mutation.gql'

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
  methods: {
    setLibraryName(libraryName) {
      this.$apollo.mutate({
        mutation: UPDATE_FLOWCELL,
        variables: {
          id: 123,
          position: this.position,
          libraryName: libraryName
        }
      })
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
