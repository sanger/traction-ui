<template>
  <div class="flex-row p-5 bg-gray-100 rounded-md shadow-md mb-5">
    <div class="w-full w-1/2 mx-auto min-w-[500px]">
      <div class="flex flex-col flex-start">
        <p class="font-bold mb-5 font-size text-xl">Filter results</p>
        <p class="mb-5 font-size text-md">By default returns the most recent 100 results</p>
      </div>
      <div class="flex mb-5 mx-auto">
        <traction-input
          id="filterInput"
          v-model="filterInput"
          type="search"
          placeholder="Type to Search"
          label="Search value"
          class="w-1/2 mr-10"
        />
        <traction-select
          v-model="filterValue"
          :options="filterOptions"
          label="Search type"
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
export default {
  name: 'FilterCard',
  props: {
    fetcher: {
      type: Function,
      required: true,
    },
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
