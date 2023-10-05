<template>
  <div class="flex flex-row items-center gap-2 text-gray-700" :class="$attrs.class">
    <label label-for="input-per-page" class="whitespace-nowrap mr-2"> Per Page</label>
    <traction-input
      id="input-per-page"
      v-model="page_size"
      data-testid="per-page-input"
      trim
      class="w-full w-25"
      type="number"
      min="1"
    ></traction-input>
    <traction-button
      theme="paginationDefault"
      data-testid="first-button"
      :disabled="isInFirstPage"
      @click="firstPageClick"
    >
      <traction-pagination-icon>
        <path
          d="m11 18-6-6 6-6 1.4 1.4L7.825 12l4.575 4.6Zm6.6 0-6-6 6-6L19 7.4 14.425 12 19 16.6Z"
        />
      </traction-pagination-icon>
    </traction-button>
    <traction-button
      theme="paginationDefault"
      data-testid="prev-button"
      :disabled="isInFirstPage"
      @click="prevPageClick"
    >
      <traction-pagination-icon>
        <path d="m14 18-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6Z" />
      </traction-pagination-icon>
    </traction-button>
    <div v-for="page in pages" :key="page">
      <traction-button
        :disabled="page.isDisabled"
        :theme="getPageButtonTheme(page)"
        data-testid="page-button"
        @click="pageClick(page)"
        >{{ page }}</traction-button
      >
    </div>

    <traction-button
      theme="paginationDefault"
      :disabled="isInLastPage"
      data-testid="next-button"
      @click="nextPageClick"
    >
      <traction-pagination-icon>
        <path d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z" />
      </traction-pagination-icon>
    </traction-button>
    <traction-button
      theme="paginationDefault"
      :disabled="isInLastPage"
      data-testid="last-button"
      @click="lastPageClick"
    >
      <traction-pagination-icon>
        <path
          d="M6.4 18 5 16.6 9.575 12 5 7.4 6.4 6l6 6Zm6.6 0-1.4-1.4 4.575-4.6L11.6 7.4 13 6l6 6Z"
        />
      </traction-pagination-icon>
    </traction-button>
  </div>
</template>

<script>
import QueryParamsHelper from '@/mixins/QueryParamsHelper'
export default {
  /**
   * # TractionUrlPagination
   * Uses router query params to control pagination
   */
  name: 'TractionUrlPagination',
  mixins: [QueryParamsHelper],
  inheritAttrs: false,
  props: {
    /**How many total items are in the list */
    totalPages: {
      type: Number,
      default: 1,
    },
    /**Maximum visible page buttons to be displayed */
    maxVisibleButtons: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    //If total number of pages is less than number of buttons given, display only as many buttons as the pages
    visibleButtons() {
      return Math.min(this.totalPages, this.maxVisibleButtons)
    },
    //Calculate the start page number to be displayed (in page button), based on current selection
    startPage() {
      if (this.page_number === 1) {
        return 1
      }

      if (this.page_number === this.totalPages) {
        return this.totalPages - this.visibleButtons + 1
      }

      return this.page_number - 1
    },
    //Calculate the end page number to be displayed, based on current selection
    endPage() {
      return Math.min(this.startPage + this.visibleButtons - 1, this.totalPages)
    },
    //Get page numbers to display in page-buttons
    pages() {
      return Array.from({ length: this.endPage - this.startPage + 1 }, (v, k) => k + this.startPage)
    },
    //Is the very first page of total number of pages selected?
    isInFirstPage() {
      return this.page_number === 1
    },
    //Is the very last page of total number of pages selected?
    isInLastPage() {
      return this.page_number === this.totalPages
    },
  },
  methods: {
    /**Emitted when the page changes */
    pageClick(pageNumber) {
      this.page_number = pageNumber
    },
    /**Handles the first page button (<<) click */
    firstPageClick() {
      this.pageClick(1)
    },
    /**Handles the previous page button (<) click */
    prevPageClick() {
      this.pageClick(this.page_number - 1)
    },
    /**Handles the next page button (>) click */
    nextPageClick() {
      this.pageClick(this.page_number + 1)
    },
    /**Handles the last page button (>>) click */
    lastPageClick() {
      this.pageClick(this.totalPages)
    },
    /**Display page-button style based on whether it is selected or not*/
    getPageButtonTheme(page) {
      return this.page_number === page ? 'paginationSelect' : 'paginationDefault'
    },
  },
}
</script>
