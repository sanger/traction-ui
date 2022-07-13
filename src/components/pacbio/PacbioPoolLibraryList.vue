<template>
  <div v-if="selectedRequests" data-type="pool-library-list">
    <traction-table-simple>
      <traction-thead>
        <traction-tr>
          <traction-th> Sample Name </traction-th>
          <traction-th> Source </traction-th>
          <traction-th> Tag </traction-th>
          <traction-th> Template prep kit box barcode </traction-th>
          <traction-th> Volume </traction-th>
          <traction-th> Concentration </traction-th>
          <traction-th> Insert Size </traction-th>
        </traction-tr>
      </traction-thead>
      <traction-tbody>
        <PacbioPoolLibraryEdit
          v-for="request in selectedRequests"
          :key="request.id"
          :request="request"
          :auto-tag="autoTag"
        ></PacbioPoolLibraryEdit>
      </traction-tbody>
    </traction-table-simple>
  </div>
</template>

<script>
import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioPoolLibraryList',
  components: {
    PacbioPoolLibraryEdit,
  },
  props: {
    autoTag: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['selectedRequests']),
  },
}
</script>

<style scoped lang="scss">
th {
  font-size: 0.8em;
}
</style>
