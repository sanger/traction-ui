<template>
  <div class="flex flex-col w-full">
    <div class="flex mx-auto w-full max-w-[1000px] bg-gray-100 rounded-md py-2 px-4">
      <div class="grid grid-cols-5 w-full">
        <div class="flex flex-col text-left">
          <p class="flex text-l">Filter results</p>
          <p class="flex font-light text-gray-700 text-sm italiclist-none">
            By default filters by created at
          </p>
        </div>
        <div class="flex col-span-3 items-center space-x-2">
          <traction-input
            id="filterInput"
            v-model="filter_input"
            type="search"
            placeholder="Type to Search"
            class="w-1/2"
          />
          <traction-select
            id="filterValue"
            v-model="filter_value"
            :options="filterOptions"
            class="w-1/2"
          />
          <div v-if="isWildcardOption" class="justify-center items-center w-1/3">
            <label for="checkbox" class="p-2">Wildcard</label>
            <input id="filterWildcard" v-model="filter_wildcard" type="checkbox" />
          </div>
        </div>
        <div class="flex items-center">
          <div class="w-full">
            <traction-button theme="accent" @click="resetFilter()">Reset</traction-button>
            <traction-button
              id="filterButton"
              :disabled="filter_value == '' || filter_input == ''"
              @click="getFirstPageData()"
              >Search</traction-button
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="displaySeparator" class="flex mt-2 mb-4 border" />
  </div>
</template>
<script>
/**
 * # FilterCard
 *
 * This component contains elements required to perform a filtered search to traction-service.
 *
 * @example
 * <template>
 *     <FilterCard :fetcher="fetchServiceData" :filter-options=[{ value: '', text: ''}] />
 * </template>
 */
import useQueryParams from '@/composables/useQueryParams'
export default {
  name: 'FilterCard',
  props: {
    // A method that performs the required data fetch
    fetcher: {
      type: Function,
      required: true,
    },
    // A list of filters to filter the fetcher method on
    // In the format
    // [
    //    { value: '', text: '' },
    //    { value: 'id', text: 'id' },
    //    { value: 'barcode', text: 'Barcode', wildcard: true }
    // ]
    filterOptions: {
      type: Array,
      required: true,
    },
    displaySeparator: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { filter_input, filter_value, filter_wildcard, page_size, page_number, clearFilter } =
      useQueryParams()
    return { filter_input, filter_value, filter_wildcard, page_size, page_number, clearFilter }
  },
  computed: {
    isWildcardOption() {
      return this.filterOptions.filter(({ value }) => value == this.filter_value)[0]?.wildcard
    },
  },
  watch: {
    /*
      page_number and page_size:
      We ensure the page is paginated before fetching data.
      This catches an edge case where the watchers are still active when navigating
      between paginated and unpaginated routes
    */
    page_size() {
      this.$route.meta?.paginated ? this.getData() : ''
    },
    page_number() {
      this.$route.meta?.paginated ? this.getData() : ''
    },
  },
  methods: {
    async getFirstPageData() {
      if (this.page_number == 1) {
        await this.getData()
      } else {
        // This triggers the page_number watcher and ensures we are on the first page
        this.page_number = 1
      }
    },
    async getData() {
      await this.fetcher().then(({ success, errors }) => {
        success ? '' : this.showAlert(errors, 'danger')
      })
    },
    async resetFilter() {
      await this.clearFilter()
      await this.getFirstPageData()
    },
  },
}
</script>
