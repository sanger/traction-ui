<template>
  <div class="flex flex-col w-full">
    <div class="flex mx-auto w-full max-w-[1000px] bg-gray-100 rounded-md mt-2 mb-2 p-3">
      <div class="grid grid-cols-4 gap-2">
        <div class="flex flex-col text-left">
          <p class="flex font-semibold text-l">Filter results</p>
          <p class="flex font-light text-gray-700 text-xs italiclist-none">
            By default returns the most recent 1000 results
          </p>
        </div>
        <div class="col-span-2 flex mx-auto items-center">
          <traction-input
            id="filterInput"
            v-model="filter_input"
            type="search"
            placeholder="Type to Search"
            class="mr-5 w-1/2"
            @enterKeyPress="getFilteredData()"
          />
          <traction-select
            id="filterValue"
            v-model="filter_value"
            :options="filterOptions"
            class="mr-5 w-1/2"
          />
          <div v-if="isWildcardOption" class="justify-center items-center w-1/3">
            <label for="checkbox" class="w-1/2">Wildcard</label>
            <input
              id="wildcardValue"
              v-model="filter_wildcard"
              type="checkbox"
              class="w-1/2 bg-sbd-400"
            />
          </div>
        </div>
        <div class="flex items-center">
          <div class="w-full">
            <traction-button @click="resetFilter()">Reset</traction-button>
            <traction-button
              id="filterButton"
              :disabled="filter_value == '' || filter_input == ''"
              @click="getFilteredData()"
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
import QueryParamsHelper from '@/mixins/QueryParamsHelper'
export default {
  name: 'FilterCard',
  mixins: [QueryParamsHelper],
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
  computed: {
    isWildcardOption() {
      return this.filterOptions.filter(({ value }) => value == this.filter_value)[0]?.wildcard
    },
  },
  methods: {
    async getFilteredData() {
      this.page_number=1
      await this.fetcher().then(({ success, errors }) => {
        success ? '' : this.showAlert(errors, 'danger')
      })
    },
    async resetFilter() {
      await this.clearFilter()
      await this.getFilteredData()
    },
  },
}
</script>
