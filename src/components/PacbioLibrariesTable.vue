<template>
  <div class="librariesTable">
    <b-table id="libraries-table"
             sticky-header
             show-empty
             :items="items"
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
import MatType from '@/mixins/MatType'
import TableHelper from '@/mixins/TableHelper'
import * as consts from '@/consts/consts'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/tubes')

export default {
  name: 'PacbioLibrariesTable',
  mixins: [Helper, MatType, TableHelper],
  data () {
    return {
      fields: [
        { key: 'id', label: 'Library ID', sortable: true },
        { key: 'volume', label: 'Volume', sortable: true },
        { key: 'concentration', label: 'Concentration', sortable: true },
        { key: 'library_kit_barcode', label: 'Library Kit Barcode', sortable: true },
        { key: 'fragment_size', label: 'Fragment Size', sortable: true },
      ],
      items: []
    }
  },
  computed: {
    ...mapGetters([
      'libraryRequest'
    ])
  },
  methods: {
    async provider() {
      this.items = await this.getMaterial(consts.MAT_TYPE_LIBRARIES)
    },
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