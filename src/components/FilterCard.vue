<template>
  <div class="flex-row p-5 bg-gray-100 rounded-md shadow-md mb-5">
    <div class="w-full w-1/2 mx-auto min-w-[500px]">
      <div class="flex flex-col flex-start">
        <p class="font-bold mb-5 font-size text-xl">Filter results</p>
        <p class="mb-5 font-size text-md">By default returns the most recent 1000 results</p>
      </div>
      <div class="flex mb-2 mx-auto">
        <traction-input
          id="filterInput"
          v-model="filterInput"
          type="search"
          placeholder="Type to Search"
          class="w-1/2 mr-5"
        />
        <traction-select
          id="filterValue"
          v-model="filterValue"
          :options="filterOptions"
          class="w-1/2"
        />
      </div>
      <div class="flex justify-end mx-auto">
        <traction-button @click="resetFilter()">Reset</traction-button>
        <traction-button
          :disabled="filterValue == '' || filterInput == ''"
          @click="getFilteredData()"
          >Search</traction-button
        >
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
