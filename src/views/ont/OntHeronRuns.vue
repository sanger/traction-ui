<template>
  <div class="runs">
    <b-table 
      id="runs-table"
      hover 
      bordered
      responsive
      :items="runs"
      :fields="fields"
      sticky-header
      show-empty
    >
    </b-table>
  </div>
</template>

<script>

import ONT_HERON_RUNS_ALL_QUERY from '@/graphql/queries/OntHeronRunsAll.query.gql'

export default {
  name: 'OntHeronRuns',
  data () {
    return { 
      fields: [ 'id', 'instrumentName', 'state', 'deactivatedAt' ],
    }
  },
  apollo: {
    runs: {
      query: ONT_HERON_RUNS_ALL_QUERY
    }
  },
}
</script>


