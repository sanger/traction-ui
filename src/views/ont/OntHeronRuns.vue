<template>
  <div class="runs">

    <b-table 
      id="runs-table"
      hover 
      bordered
      responsive
      :items="runs"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      sticky-header
      show-empty
    >

      <template v-slot:cell(actions)="row">
        <b-button :id="'editRun-'+row.item.id" variant="outline-info" size="sm" class="mr-1" @click="redirectToRun(row.item.id)">
          Edit
        </b-button>
      </template>

      <template v-slot:cell(library_names)="row" >
        <span v-for="flowcell in row.item.flowcells" :key="flowcell.id">
          {{flowcell.library.name}} 
        </span>
      </template>

    </b-table>

    <div class="clearfix">
      <b-button id="newRun"
                class="float-left"
                @click="redirectToRun()"
                variant="success">
        New Run
      </b-button>
    </div>
  </div>
</template>

<script>

import ONT_HERON_RUNS_ALL_QUERY from '@/graphql/queries/OntHeronRunsAll.query.gql'

export default {
  name: 'OntHeronRuns',
  data () {
    return { 
      fields: [
        { key: 'experimentName', label: 'Experiment Name' , sortable: true},
        { key: 'library_names', label: 'Libraries', class: 'w-25' },
        { key: 'updatedAt', label: 'Updated at', sortable: true},
        { key: 'actions', label: 'Actions' },
      ],
      sortBy: 'updatedAt',
      sortDesc: true,
    }
  },
  apollo: {
    runs: {
      query: ONT_HERON_RUNS_ALL_QUERY
    }
  },
  methods: {
    redirectToRun(id) {
      this.$router.push({ path: `/ont/run/${id || 'new'}` })
    },
    refetchRuns() {
      this.$apollo.queries.runs.refetch()
    }
  },
  created () {
    this.refetchRuns()
  }
}
</script>
