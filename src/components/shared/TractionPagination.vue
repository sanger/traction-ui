<template>
  <div class="flex flex-row items-center gap-6 text-sm text-gray-700">
      <TractionButton   onClick={onPageDownClick}>
        <svg
          className="h-5 w-5"
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
      <div>
        <span class="font-medium">{currentPage}</span> of <span className="font-medium">{numberOfPages}</span>
      </div>
      <TractionButton  onClick={onPageUpClick} >
        <svg
          className="h-5 w-5"
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
    </div>
</template>

<script>


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
  props: {
    //value field  which will be bind automatically with 'v-model' prop passed into the component
    value: {
      type: Number,
      default: 0,
    },
    /**How many total items are in the list */
    totalItems: {
      type: Number,
      default: 0,
    },
    /**Number of items that every page represents */
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      currentPage: this.value,
    }
  },
  methods: {
    /**Emitted when the page change */
    change(pageNumber) {
      this.$emit('change', pageNumber)
    },
  },
}
</script>