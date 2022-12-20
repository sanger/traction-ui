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
          :validated="validated"
          :notify="notify"
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
    // flag passed from parent indicating whether the attributes in child
    // component(s) have been validated
    validated: {
      type: Boolean,
      default: false,
    },
    // function passed from parent indicating what to do when user changes
    // an attribute in a child component
    notify: {
      type: Function,
      required: true,
      default: () => {},
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
