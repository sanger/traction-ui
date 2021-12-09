<template>
  <div class="ont-plates">
    <b-table
      id="plates-table"
      hover
      bordered
      responsive
      :items="getPlates"
      :fields="fields"
      sticky-header
      show-empty
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template v-slot:cell(show_details)="row">
        <b-button
          :id="'details-btn-' + row.item.id"
          size="sm"
          variant="outline-primary"
          @click="row.toggleDetails"
        >
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Plate
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <OntPlate ref="ontPlate" :plate="row.item" @alert="alert"></OntPlate>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"> </b-pagination>

    <span class="font-weight-bold">Total records: {{ totalRows }}</span>
  </div>
</template>

<script>
import OntPlate from '@/components/ont/OntPlate'
import ONT_PLATES_QUERY from '@/graphql/queries/OntPlates.query.gql'

export default {
  name: 'OntPlates',
  components: {
    OntPlate,
  },
  data() {
    return {
      fields: ['id', 'barcode', 'createdAt', 'show_details'],
      perPage: 5,
      currentPage: 1,
      totalRows: 0,
    }
  },
  methods: {
    alert(message, type) {
      this.showAlert(message, type)
    },
    getPlates(ctx, callback) {
      this.$apollo
        .query({
          query: ONT_PLATES_QUERY,
          variables: {
            pageNum: ctx.currentPage,
            pageSize: ctx.perPage,
          },
          fetchPolicy: 'no-cache',
        })
        .then((data) => {
          this.totalRows = data.data.plates.pageInfo.entitiesCount
          callback(data.data.plates.nodes)
        })
        .catch(() => {
          callback([])
        })
      return null
    },
  },
}
</script>
