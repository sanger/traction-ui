<template>
  <b-col v-if="requests" data-type="pool-library-list">
    <h3>Pooled Samples</h3>
     <b-table-simple>
      <b-thead>
        <b-tr>
          <b-th>
            Sample Name
          </b-th>
          <b-th>
            Source
          </b-th>
          <b-th>
            Tag
          </b-th>
          <b-th>
            Template prep kit box barcode
          </b-th>
          <b-th>
            Volume
          </b-th>
          <b-th>
            Concentration
          </b-th>
          <b-th>
            Fragment Size
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <PacbioPoolLibraryEdit
          v-for="request in requests"
          :key="request.id"
          :request="request"
        ></PacbioPoolLibraryEdit>
      </b-tbody>
    </b-table-simple>
  </b-col>
</template>

<script>
import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'

export default {
  name: 'PacbioPoolLibraryList',
  components: {
    PacbioPoolLibraryEdit,
  },
  data() {
    return {}
  },
  computed: {
    requests() {
      return this.$store.getters['traction/pacbio/poolCreate/selectedRequests']
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
th {
  font-size: 0.9em;
}
</style>
