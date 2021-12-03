<template>
  <div v-if="selectedRequests" data-type="pool-library-list">
    <b-form-checkbox v-model="autoTag" name="check-button" switch data-attribute="auto-tagging">
      Autotagging
    </b-form-checkbox>
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
            Insert Size
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <PacbioPoolLibraryEdit
          v-for="request in selectedRequests"
          :key="request.id"
          :request="request"
          :auto-tag="autoTag"
        ></PacbioPoolLibraryEdit>
      </b-tbody>
    </b-table-simple>
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
  data() {
    return {
      autoTag: false,
    }
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
