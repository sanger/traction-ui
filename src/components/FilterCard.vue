<template>
  <div class="flex mx-auto w-full max-w-[1000px] bg-gray-100 rounded-md mb-2 p-3">
    <div class="grid grid-cols-4 gap-2">
      <div class="flex flex-col text-left">
        <p class="flex font-semibold text-xl">Filter results</p>
        <p class="flex font-light text-gray-700 text-xs italiclist-none">
          By default returns the most recent 1000 results
        </p>
      </div>
      <div class="col-span-2 flex mx-auto items-center">
        <traction-input
          id="filterInput"
          v-model="filterInput"
          type="search"
          placeholder="Type to Search"
          class="mr-5 w-1/2"
        />
        <traction-select
          id="filterValue"
          v-model="filterValue"
          :options="filterOptions"
          class="mr-5 w-1/2"
        />
        <div v-if="wildcard" class="justify-center items-center w-1/3">
          <label for="checkbox" class="w-1/2">Wildcard</label>
          <input
            id="wildcardValue"
            v-model="filterWildcard"
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
            :disabled="filterValue == '' || filterInput == ''"
            @click="getFilteredData()"
            >Search</traction-button
          >
        </div>
      </div>
    </div>
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
  },
  data() {
    return {
      filterInput: '',
      filterValue: '',
      filterWildcard: true,
    }
  },
  computed: {
    wildcard() {
      return this.filterOptions.filter(({ value }) => value == this.filterValue)[0]?.wildcard
    },
  },
  methods: {
    async getFilteredData() {
      let searchValue = this.filterInput
      if (this.wildcard && this.filterWildcard) {
        // If wildcard is selected, add it to the search string
        searchValue += ',wildcard'
      }
      const filter = {
        [this.filterValue]: searchValue,
      }
      await this.fetcher(filter).then(({ success, errors }) => {
        success ? '' : this.showAlert(errors, 'danger')
      })
    },
    async resetFilter() {
      this.filterValue = ''
      this.filterInput = ''
      ;(this.filterWildcard = true),
        await this.fetcher().then(({ success, errors }) => {
          success ? '' : this.showAlert(errors, 'danger')
        })
    },
  },
}
</script>
