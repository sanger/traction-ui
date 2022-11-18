<template>
  <div class="flex flex-row items-center gap-2 text-gray-700">
    <TractionButton theme="pagination" :disabled="isInFirstPage" @click="firstPageClick">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
        <path
          d="m11 18-6-6 6-6 1.4 1.4L7.825 12l4.575 4.6Zm6.6 0-6-6 6-6L19 7.4 14.425 12 19 16.6Z"
        />
      </svg>
    </TractionButton>
    <TractionButton theme="pagination" :disabled="isInFirstPage" @click="prevPageClick">
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </TractionButton>
    <div v-for="page in pages" :key="page.name">
      <traction-button :theme="getPageButtonTheme(page.name)" @click="pageClick(page.name)">
        {{ page.name }}
      </traction-button>
    </div>

    <TractionButton theme="pagination" :disabled="isInLastPage" @click="nextPageClick">
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </TractionButton>
    <TractionButton theme="pagination" @click="lastPageClick">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
        <path
          d="M6.4 18 5 16.6 9.575 12 5 7.4 6.4 6l6 6Zm6.6 0-1.4-1.4 4.575-4.6L11.6 7.4 13 6l6 6Z"
        />
      </svg>
    </TractionButton>
  </div>
</template>

<script>
import TractionButton from './TractionButton.vue'
export default {
  /**
   * # TractionPagination
   *
   *
   *
   * Displays a pagination component
   *
   */
  name: 'TractionPagination',
  components: { TractionButton },
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

    startPage() {
      if (this.currentPage === 1) {
        return 1
      }

      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons + 1
      }

      return this.currentPage - 1
    },
    endPage() {
      return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages)
    },
    pages() {
      const range = []
      for (let i = this.startPage; i <= this.endPage; i++) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage,
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
      return this.currentPage === page ? 'default' : 'pagination'
    },
  },
}
</script>
