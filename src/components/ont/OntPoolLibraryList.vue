<template>
  <div v-if="selectedRequests" data-type="pool-library-list">
    <traction-table :fields="headerFields" simple>
      <OntPoolLibraryEdit
        v-for="request in selectedRequests"
        :key="request.id"
        :request="request"
        :auto-tag="autoTag"
        :validated="validated"
        :notify="notify"
      ></OntPoolLibraryEdit>
    </traction-table>
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
      default: () => {},
    },
  },
  data() {
    return {
      headerFields: [
        'Sample Name',
        'Source',
        'Tag',
        'Kit barcode',
        'Volume',
        'Concentration',
        'Insert Size',
      ],
    }
  },
  computed: {
    ...mapGetters(['selectedRequests']),
  },
}
</script>
