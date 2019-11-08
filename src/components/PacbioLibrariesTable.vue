<template>
  <div class="librariesTable">
    <b-table id="libraries-table"
             sticky-header
             show-empty
             :items="libraries"
             :fields="fields"
             hover
             selectable
             select-mode="single"
             @row-selected="onRowSelected">
    </b-table>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/tubes')

export default {
  name: 'PacbioLibrariesTable',
  mixins: [Helper, TableHelper],
  data () {
    return {
      fields: [
        { key: 'barcode', label: 'Barcode', sortable: true},
        { key: 'sample_names', label: 'Sample Names', sortable: true },
        { key: 'tag_oligos', label: 'Tags', sortable: true }
      ],
      items: []
    }
  },
  computed: {
    ...mapGetters([
      'libraries'
    ])
  },
  methods: {
    async provider() {
        try {
        await this.setLibraries()
      } catch (error) {
        this.showAlert("Failed to get libraries: " + error.message, 'danger')
      }
    },
    ...mapActions([
      'setLibraries'
    ]),
  },
  created() {
    this.provider()
  },
}
</script>

<style>

.librariesTable {
  border: solid;
  border-width: 1px;
  padding: 20px;
}

</style>