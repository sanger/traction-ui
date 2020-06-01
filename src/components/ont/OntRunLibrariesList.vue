<template>

   <div class="ont-run-libraries" v-on:drop="drop" v-on:dragover="allowDrop" v-on:dragleave="endDrop" v-bind:class="{hover: hover}">
    <b-list-group class="ont-run-libraries-list-group" >
      <OntTube v-for="library in libraries" v-bind:key="library.id" v-bind="library" v-bind:selected="isLibrarySelected(library)">
      </OntTube>
    </b-list-group>
  </div>
</template>

<script>
import LIBRARIES_ALL_QUERY from '@/graphql/queries/LibrariesAll.query.gql'
import OntTube from '@/components/ont/OntTube'

export default {
  name: 'OntRunLibrariesList',
  components: {
    OntTube
  },
  props: ['selectedLibraryNames'],
  data () {
    return {
      hover: false,
    }
  },
  apollo: {
    libraries: {
      query: LIBRARIES_ALL_QUERY,
       variables () {
        return {
          unassignedToFlowcells: true,
        }
      },
    }
  },
  methods: {
    updateFlowcell (flowcellPosition, libraryName) {
      this.$emit('updateFlowcell', flowcellPosition, libraryName)
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
      let flowcellPosition = parseInt(event.dataTransfer.getData('flowcellPosition'))
      this.updateFlowcell(flowcellPosition,'')
      this.hover = false
    },
    isLibrarySelected(library) {
      return this.selectedLibraryNames.includes(library.name)
    }
  }
}
</script>

<style scoped lang="scss">

  .ont-run-libraries {
    border: solid;
    border-width: 1px;
    padding: 20px;

  }

  .hover {
    box-shadow: 0px 0px 2px 2px gray;
  }

  .ont-run-libraries-list-group {
    max-height: 400px;
    overflow: scroll;
  }

</style>