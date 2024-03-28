<template>
  <div v-if="selectedRequests" data-type="pool-library-list">
    <traction-table :fields="headerFields" simple>
      <PacbioPoolLibraryEdit
        v-for="request in selectedRequests"
        :key="request.id"
        :request="request"
        :auto-tag="autoTag"
        :validated="validated"
        :notify="notify"
      ></PacbioPoolLibraryEdit>
    </traction-table>
  </div>
</template>
<script>
import PacbioPoolLibraryEdit from '@/components/pacbio/V1/PacbioPoolLibraryEditV1.vue'
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
  data() {
    return {
      headerFields: [
        'Sample Name',
        'Source',
        'Tag',
        'Template prep kit box barcode',
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
