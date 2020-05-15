<template>
  <div class="ont-run-libraries">
    <b-list-group class="ont-run-libraries-list-group">
      <OntTube v-for="library in libraries" v-bind:key="library.id" v-bind="library">
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
  apollo: {
    libraries: {
      query: LIBRARIES_ALL_QUERY,
       variables () {
        return {
          unassignedToFlowcells: true,
        }
      },
    }
  }
}
</script>

<style>

.ont-run-libraries {
  border: solid;
  border-width: 1px;
  padding: 20px;
}

.ont-run-libraries-list-group {
  max-height: 400px;
  overflow: scroll;
}

</style>