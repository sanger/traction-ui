<template>
  <div class="flex mx-auto w-1/2 bg-gray-100 rounded-md mb-2 p-3">
    <div class="flex w-full">
      <div class="w-full">
        <p class="flex font-semibold text-xl">Filter results</p>
        <p class="flex font-light text-gray-700 text-xs italiclist-none">
          By default returns the most recent 1000 results
        </p>
      </div>
      <div class="flex w-full">
        <traction-input
          id="filterInput"
          v-model="filterInput"
          type="search"
          placeholder="Type to Search"
          class="mr-5 w-full"
        />
        <traction-select
          id="filterValue"
          v-model="filterValue"
          :options="filterOptions"
          class="w-full"
        />
      </div>
      <div class="w-full">
        <div class="w-full">
          <traction-button @click="resetFilter()">Reset</traction-button>
          <traction-button
            id="`filterButton`"
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
    //    { value: 'id', text: 'id' }
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
    }
  },
  methods: {
    async getFilteredData() {
      const filter = {
        [this.filterValue]: this.filterInput,
      }
      await this.fetcher(filter).then(({ success, errors }) => {
        success ? '' : this.showAlert(errors, 'danger')
      })
    },
    async resetFilter() {
      this.filterValue = ''
      this.filterInput = ''
      await this.fetcher().then(({ success, errors }) => {
        success ? '' : this.showAlert(errors, 'danger')
      })
    },
  },
}
</script>
