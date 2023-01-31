<!--
  TractionPagination

  Renders a custom tailwind or bootstrap pagination component based on 'enable_custom_pagination' feature flag is enabled or not respectively
   - flagged-feature  is the wrapper for the component to be toggled, name field specifies the name of the toggle feature
   - <template #disabled> displays the bootstrap pagination when the feature flag is disabled, otherwise the custom component
   - @input - On input, emit its own custom input event with the new value
-->
<template>
  <div class="flex flex-row items-center gap-2 text-gray-700">
    <flagged-feature name="enable_custom_pagination">
      <template #disabled>
        <b-pagination
          :value="value"
          :per-page="perPage"
          :total-rows="totalRows"
          class="float-right"
          @page-click="(event, page) => pageClick(page)"
        />
      </template>

      <TractionButton
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
      </TractionButton>
      <TractionButton
        theme="paginationDefault"
        data-testid="prev-button"
        :disabled="isInFirstPage"
        @click="prevPageClick"
      >
        <traction-pagination-icon>
          <path d="m14 18-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6Z" />
        </traction-pagination-icon>
      </TractionButton>
      <div v-for="page in pages" :key="page">
        <traction-button
          :disabled="page.isDisabled"
          :theme="getPageButtonTheme(page)"
          data-testid="page-button"
          @click="pageClick(page)"
          >{{ page }}</traction-button
        >
      </div>

      <TractionButton
        theme="paginationDefault"
        :disabled="isInLastPage"
        data-testid="next-button"
        @click="nextPageClick"
      >
        <traction-pagination-icon>
          <path d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z" />
        </traction-pagination-icon>
      </TractionButton>
      <TractionButton
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
      </TractionButton>
    </flagged-feature>
  </div>
</template>

<script>
import { BPagination } from 'bootstrap-vue'

export default {
  /**
   * # TractionPagination
   *
   * Displays a custom pagination or bootstrap component based on 'enable_custom_pagination' feature flag
   *
   */
  name: 'TractionPagination',
  components: { BPagination },
  inheritAttrs: false,
  props: {
    //value field  which will be bind automatically with 'v-model' prop passed into the component
    value: {
      type: Number,
      default: 1,
    },

    /**How many total items are in the list */
    totalRows: {
      type: Number,
      default: 0,
    },
    /**Number of items that every page represents */
    perPage: {
      type: [Number, String],
      default: 10,
    },
    /**Maximum visible page buttons to be displayed */
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
    //Calculate total pages required
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage)
    },
    //If total number of pages is less than number of buttons given, display only as many buttons as the pages
    visibleButtons() {
      return Math.min(this.totalPages, this.maxVisibleButtons)
    },
    //Calculate the start page number to be displayed (in page button), based on current selectiobn
    startPage() {
      if (this.currentPage === 1) {
        return 1
      }

      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.visibleButtons + 1
      }

      return this.currentPage - 1
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
      return this.currentPage === 1
    },
    //Is the very last page of total number of pages selected?
    isInLastPage() {
      return this.currentPage === this.totalPages
    },
  },
  methods: {
    /**Emitted when the page changes */
    pageClick(pageNumber) {
      this.currentPage = pageNumber
      this.$emit('input', pageNumber)
    },
    /**Handles the first page button (<<) click */
    firstPageClick() {
      this.pageClick(1)
    },
    /**Handles the previous page button (<) click */
    prevPageClick() {
      this.pageClick(this.currentPage - 1)
    },
    /**Handles the next page button (>) click */
    nextPageClick() {
      this.pageClick(this.currentPage + 1)
    },
    /**Handles the last page button (>>) click */
    lastPageClick() {
      this.pageClick(this.totalPages)
    },
    /**Display page-button style based on whether it is selected or not*/
    getPageButtonTheme(page) {
      return this.currentPage === page ? 'paginationSelect' : 'paginationDefault'
    },
  },
}
</script>
