/**
 * A mixin to store commonly used functionality for the bootstrap table component
 */

export default {
  name: 'TableHelper',
  data() {
    return { tableData: [] }
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
    setInitialData(initialTableData) {
      alert('here')
      console.log(initialTableData)
      this.initialTableData = initialTableData
      this.tableData = initialTableData
    },
    onPageChange(currentPage, perPage) {
      this.currentPage = currentPage
      this.tableData = this.initialData.slice(currentPage * perPage, perPage)
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
  },
}
