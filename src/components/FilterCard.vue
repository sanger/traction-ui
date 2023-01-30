<template>
  <div class="mx-auto w-1/2 bg-gray-100 rounded-md mb-5 p-5">
    <div class="flex flex-col mb-2">
      <p class="flex font-semibold text-xl px-3">Filter results</p>
      <traction-muted-text> By default returns the most recent 1000 results </traction-muted-text>
      <div class="flex flex-row mx-3">
        <traction-input
          id="filterInput"
          v-model="filterInput"
          type="search"
          placeholder="Type to Search"
          class="mr-2 w-1/2"
        />
        <traction-select
          id="filterValue"
          v-model="filterValue"
          :options="filterOptions"
          class="mr-2 w-1/2"
        />
        <div class="flex mx-auto justify-end">
          <traction-button @click="resetFilter()">Reset</traction-button>
          <traction-button
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
