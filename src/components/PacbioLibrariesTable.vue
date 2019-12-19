<template>
  <div class="librariesTable">
    <table>
      <thead>
        <tr>
          <th v-for="field in fields" v-bind:key="field.label">{{ field.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="library in libraries" draggable="true" v-on:dragstart="drag(library.barcode, $event)" v-bind:key="library.id">
          <td>{{ library.barcode}}</td>
          <td>{{ library.sample_names}}</td>
          <td>{{ library.tag_oligos}}</td>
          <td><tube></tube></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/tubes')
import Tube from '@/components/Tube'

export default {
  name: 'PacbioLibrariesTable',
  mixins: [Helper, TableHelper],
  data () {
    return {
      fields: [
        { key: 'barcode', label: 'Barcode', sortable: true},
        { key: 'sample_names', label: 'Sample Name', sortable: true },
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
    drag (barcode, event) {
      event.dataTransfer.setData('barcode', barcode)
    },
    async provider() {
        try {
        await this.setLibraries()
      } catch (error) {
        this.showAlert("Failed to get libraries: " + error.message, 'danger')
      }
    },
    ...mapActions([
      'setLibraries'
    ])
  },
  created() {
    this.provider()
  },
  components: {
    Tube
  }
}
</script>

<style>

.librariesTable {
  border: solid;
  border-width: 1px;
  padding: 20px;
}

</style>