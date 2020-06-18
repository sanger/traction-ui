<template>

  <div class="ont-run-libraries" v-on:drop="drop" v-on:dragover="allowDrop" v-on:dragleave="endDrop" v-bind:class="{hover: hover}" ref="lib">

    <b-list-group class="ont-run-libraries-list-group" ref='list'>
      <OntTube v-for="library in unselectedLibraries" v-bind:key="library.id" v-bind="library">
      </OntTube>
    </b-list-group>
  </div>
</template>

<script>
import LIBRARIES_ALL_QUERY from '@/graphql/queries/LibrariesAll.query.gql'
import OntTube from '@/components/ont/OntTube'
import GET_CLIENT_LIBRARIES from '@/graphql/queries/client/GetClientLibraries.query.gql'
import SET_CLIENT_LIBRARIES from '@/graphql/queries/client/SetClientLibraries.mutation.gql'
import DragHelper from '@/mixins/DragHelper'

export default {
  name: 'OntRunLibrariesList',
  mixins: [ DragHelper ],
  components: {
    OntTube
  },
  apollo: {
    libraries: {
      query: GET_CLIENT_LIBRARIES,
      update: data => data.libraries
    }
  },
  methods: {
    drop (event) {
      event.preventDefault()
      
      let flowcellPosition = parseInt(event.dataTransfer.getData('flowcellPosition'))
      let libraryName = event.dataTransfer.getData('libraryName')
      this.handleDropUpdate(flowcellPosition, libraryName, false)
    },
    fetchLibraries () { 
      this.$apollo.query({
        query: LIBRARIES_ALL_QUERY,
        variables: {
          unassignedToFlowcells: false,
          pageNum: 1,
          pageSize: 1000
        },
        fetchPolicy: 'no-cache'
      }).then(data => {
        this.setClientLibraries(data.data.libraries.nodes)
      })
    },
    setClientLibraries(libraries){
      this.$apollo.mutate({
        mutation: SET_CLIENT_LIBRARIES,
        variables: {
          libraries: libraries
        }
      })
    },
    provider () {
      this.fetchLibraries()
    }
  },
  computed: {
    unselectedLibraries () {
      return this.libraries.filter(library => !library.assignedToFlowcell)
    }
  },
  created () {
    this.provider()
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