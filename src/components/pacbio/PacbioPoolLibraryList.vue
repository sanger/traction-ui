<template>
  <b-col v-if="selectedRequests" data-type="pool-library-list">
    <b-alert
      :show="!!result.message"
      data-type="pool-create-message"
      dismissible
      :variant="alertVariant"
    >
      {{ result.message }}
    </b-alert>
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
          v-for="request in selectedRequests"
          :key="request.id"
          :request="request"
        ></PacbioPoolLibraryEdit>
      </b-tbody>
    </b-table-simple>
    <div class="text-right">
      <b-button data-action="create-pool" variant="success" @click="createPool()">
        Create Pool</b-button
      >
    </div>
  </b-col>
</template>

<script>
import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioPoolLibraryList',
  components: {
    PacbioPoolLibraryEdit,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['selectedRequests', 'result']),
    alertVariant() {
      return this.result.success ? 'success' : 'danger'
    },
  },

  methods: {
    ...mapActions(['createPool']),
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
th {
  font-size: 0.8em;
}
</style>
