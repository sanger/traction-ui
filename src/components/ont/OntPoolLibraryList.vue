<template>
  <div v-if="selectedRequests" data-type="pool-library-list">
    <traction-table-simple>
      <traction-thead>
        <traction-tr>
          <traction-th> Sample Name </traction-th>
          <traction-th> Source </traction-th>
          <traction-th> Tag </traction-th>
          <traction-th> Kit Barcode </traction-th>
          <traction-th> Volume </traction-th>
          <traction-th> Concentration </traction-th>
          <traction-th> Insert Size </traction-th>
        </traction-tr>
      </traction-thead>
      <traction-tbody>
        <OntPoolLibraryEdit
          v-for="request in selectedRequests"
          :key="request.id"
          :request="request"
          :auto-tag="autoTag"
          :validated="validated"
          :notify="notify"
        ></OntPoolLibraryEdit>
      </traction-tbody>
    </traction-table-simple>
  </div>
</template>

<script>
import OntPoolLibraryEdit from '@/components/ont/OntPoolLibraryEdit'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('traction/ont/pools')

/**
 * # OntPoolLibraryList
 *
 * Displays a list of libraries from the ont pool libraries store
 */
export default {
  name: 'OntPoolLibraryList',
  components: {
    OntPoolLibraryEdit,
  },
  props: {
    autoTag: {
      type: Boolean,
      default: false,
    },
    // Indicates whether the values in this component have been validated
    validated: {
      type: Boolean,
      default: false,
    },
    // Parent function indiciated what to do when a user changes an attribute
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
