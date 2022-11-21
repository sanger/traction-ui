<template>
  <div class="flex flex-row items-center gap-2 text-gray-700">
    <TractionButton theme="paginationDefault"  data-testid="first-button" :disabled="isInFirstPage" @click="firstPageClick">
      <traction-pagination-icon>
        <path
          d="m11 18-6-6 6-6 1.4 1.4L7.825 12l4.575 4.6Zm6.6 0-6-6 6-6L19 7.4 14.425 12 19 16.6Z"
        />
      </traction-pagination-icon>
    </TractionButton>
    <TractionButton theme="paginationDefault" data-testid="prev-button" :disabled="isInFirstPage" @click="prevPageClick">
      <traction-pagination-icon>
        <path d="m14 18-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6Z" />
      </traction-pagination-icon>
    </TractionButton>
    <div v-for="page in pages" :key="page.name">
      <traction-button
        :disabled="page.isDisabled"
        :theme="getPageButtonTheme(page.name)"
        data-testid="page-button"
        @click="pageClick(page.name)"
      >
        {{ page.name }}
      </traction-button>
    </div>

    <TractionButton theme="paginationDefault" :disabled="isInLastPage" data-testid="next-button" @click="nextPageClick">
      <traction-pagination-icon>
        <path d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z" />
      </traction-pagination-icon>
    </TractionButton>
    <TractionButton theme="paginationDefault" :disabled="isInLastPage" data-testid="last-button" @click="lastPageClick">
      <traction-pagination-icon>
        <path
          d="M6.4 18 5 16.6 9.575 12 5 7.4 6.4 6l6 6Zm6.6 0-1.4-1.4 4.575-4.6L11.6 7.4 13 6l6 6Z"
        />
      </traction-pagination-icon>
    </TractionButton>
  </div>
</template>

<script>
export default {
  /**
   * # TractionPagination
   *
   * Displays a pagination component
   *
   */
  name: 'TractionPagination',
  props: {
    //value field  which will be bind automatically with 'v-model' prop passed into the component
    value: {
      type: Number,
      default: 1,
      required: true,
    },

    /**How many total items are in the list */
    totalRows: {
      type: Number,
      default: 0,
    },
    /**Number of items that every page represents */
    perPage: {
      type: Number,
      default: 10,
    },
    maxVisibleButtons: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      currentPage: this.value,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage)
    },
    visibleButtons() {
      return Math.min(this.totalPages, this.maxVisibleButtons)
    },
    startPage() {
      if (this.currentPage === 1) {
        return 1
      }

      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.visibleButtons + 1
      }

      return this.currentPage - 1
    },
    endPage() {
      return Math.min(this.startPage + this.visibleButtons - 1, this.totalPages)
    },
    pages() {
      const range = []
      for (let i = this.startPage; i <= this.endPage; i++) {
        range.push({
          name: i,
        })
      }
      return range
    },
    isInFirstPage() {
      return this.currentPage === 1
    },
    isInLastPage() {
      return this.currentPage === this.totalPages
    },
  },
  methods: {
    /**Emitted when the page change */
    pageClick(pageNumber) {
      this.currentPage = pageNumber
      this.$emit('input', pageNumber)
    },
    firstPageClick() {
      this.pageClick(1)
    },
    nextPageClick() {
      this.pageClick(this.currentPage + 1)
    },
    prevPageClick() {
      this.pageClick(this.currentPage - 1)
    },
    lastPageClick() {
      this.pageClick(this.totalPages)
    },
    getPageButtonTheme(page) {
      return this.currentPage === page ? 'paginationSelect' : 'paginationDefault'
    },
  },
}
</script>
