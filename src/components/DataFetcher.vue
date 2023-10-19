<template>
  <div>
    <div v-if="isLoading" class="flex flex-col w-full items-center justify-center">
      <traction-spinner class="h-32 w-32"></traction-spinner>
    </div>
    <div v-else-if="isError" class="flex flex-col w-full items-center justify-center">
      <p class="flex mb-5 mt-10 text-lg font-bold">There was an error retrieving the data</p>
      <traction-button class="flex mt-10" @click="getData()">Retry</traction-button>
    </div>
    <slot v-else />
  </div>
</template>
<script>
/**
 * # DataFetcher
 *
 * This component provides a means of wrapping content that will be displayed
 * based on a result. Typically the result of a request to traction-service.
 *
 * @example
 * <template>
 *     <DataFetcher :fetcher="fetchServiceData">
 *       Content to display on success
 *     </DataFetcher>
 * </template>
 */
export default {
  name: 'DataFetcher',
  props: {
    // A method that performs the required data fetch
    fetcher: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      isError: false,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.isLoading = true
      this.isError = false
      await this.fetcher().then((res) => {
        debugger
        if (!res.success) {
          this.isError = true
          this.showAlert(res.errors, 'danger')
        }
        this.isLoading = false
      })
    },
  },
}
</script>
