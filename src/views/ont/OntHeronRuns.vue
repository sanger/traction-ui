<template>
  <div class="runs">
    <b-table
      id="runs-table"
      hover
      bordered
      responsive
      :items="getRuns"
      :fields="fields"
      sticky-header
      show-empty
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template v-slot:cell(actions)="row">
        <b-button
          :id="'editRun-' + row.item.id"
          variant="outline-info"
          size="sm"
          class="mr-1"
          @click="redirectToRun(row.item.id)"
        >
          Edit
        </b-button>
      </template>

      <template v-slot:cell(libraryNames)="row">
        {{ row.item.flowcells.map((fc) => fc.library.name).join(', ') }}
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"> </b-pagination>

    <span class="font-weight-bold">Total records: {{ totalRows }}</span>

    <div class="clearfix">
      <b-button id="newRun" class="float-left" variant="success" @click="redirectToRun()">
        New Run
      </b-button>
    </div>
  </div>
</template>

<script>
import ONT_HERON_RUNS_ALL_QUERY from '@/graphql/queries/OntHeronRunsAll.query.gql'

export default {
  name: 'OntHeronRuns',
  data() {
    return {
      fields: ['experimentName', 'libraryNames', 'updatedAt', 'actions'],
      perPage: 5,
      currentPage: 1,
      totalRows: 0,
    }
  },
  methods: {
    redirectToRun(id) {
      this.$router.push({ path: `/ont/run/${id || 'new'}` })
    },
    getRuns(ctx, callback) {
      this.$apollo
        .query({
          query: ONT_HERON_RUNS_ALL_QUERY,
          variables: {
            pageNum: ctx.currentPage,
            pageSize: ctx.perPage,
          },
          fetchPolicy: 'no-cache',
        })
        .then((data) => {
          this.totalRows = data.data.runs.pageInfo.entitiesCount
          callback(data.data.runs.nodes)
        })
        .catch(() => {
          callback([])
        })
      return null
    },
  },
}
</script>
