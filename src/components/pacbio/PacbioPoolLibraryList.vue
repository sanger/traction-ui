<template>
  <b-col v-if="selectedRequests" data-type="pool-library-list">
    <alert ref="alert" data-type="pool-create-message"></alert>
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
      <b-button data-action="create-pool" variant="success" :disabled="busy" @click="create()">
        <span class="button-text">Create Pool </span>
        <b-spinner v-show="busy" small></b-spinner>
      </b-button>
    </div>
  </b-col>
</template>

<script>
import Alert from '@/components/Alert'
import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioPoolLibraryList',
  components: {
    PacbioPoolLibraryEdit,
    Alert,
  },
  data() {
    return {
      busy: false,
    }
  },
  computed: {
    ...mapGetters(['selectedRequests', 'result']),
  },
  methods: {
    ...mapActions(['createPool']),
    create() {
      this.busy = true
      this.createPool().then(
        ({
          success,
          data: { data: { pool: { tube: { barcode = '' } = {} } = {} } = {} } = {},
          errors,
        }) => {
          success
            ? this.$refs.alert.show(`Pool successfully created with barcode ${barcode}`, 'success')
            : this.$refs.alert.show(errors, 'danger')
        },
      )
      this.busy = false
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
th {
  font-size: 0.8em;
}
.button-text {
  padding-right: 2px;
  position: relative;
  top: 2px;
}
</style>
