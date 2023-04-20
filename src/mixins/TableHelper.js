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
    setInitialData(initialData, perPage) {
      this.initialData = initialData
      this.perPage = perPage
      this.tableData = this.initialData.slice(0, perPage)
    },
    onPageChange(pageInfo) {
      this.perPage = pageInfo.perPage
      this.currentPage = pageInfo.currentPage
      const start = (this.currentPage - 1) * this.perPage
      this.tableData = this.initialData.slice(start, start + this.perPage)
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
