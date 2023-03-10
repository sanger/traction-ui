/**
 * A mixin to store commonly used functionality for the bootstrap table component
 */

export default {
  name: 'TableHelper',
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
    onRowSelected(items) {
      this.selected = items
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.filteredItems = filteredItems
      this.currentPage = 1
    },
    setInitialData(initialData) {
      this.initialData = initialData
      this.tableData = initialData
    },
    onPageChange(currentPage, perPage) {
      this.currentPage = currentPage
      const start = currentPage * perPage
      this.tableData = this.initialData.slice(start, start + perPage)
    },
  },
  computed: {
    /**
     * We need the pagination component to reflect the correct number of rows dependent on the
     * items after filtering has been applied
     */
    rows() {
      if (this.filteredItems.length > 0) {
        return this.filteredItems.length
      }

      if (this.filteredItems.length == 0 && this.filter !== '' && this.filter !== null) {
        return this.filteredItems.length
      }

      return this.items.length
    },
    // ...mapGetters('traction/pacbio/requests', ['requests']),
  },
}
