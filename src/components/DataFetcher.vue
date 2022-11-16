<template>
  <div>
    <div v-if="isLoading" class="flex flex-col w-full items-center justify-center">
      <traction-spinner class="h-32 w-32"></traction-spinner>
    </div>
    <div v-else-if="error" class="flex flex-col w-full items-center justify-center">
      <p class="flex mb-5 mt-10 text-lg font-bold">There was an error retrieving the data</p>
      <traction-button class="flex mt-10" @click="getData()">Retry</traction-button>
    </div>
    <slot v-else />
  </div>
</template>
<script>
export default {
  name: 'DataFetcher',
  props: {
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
      this.error = false
      await this.fetcher().then((res) => {
        if (!res.success) {
          this.error = true
          this.showAlert(res.errors, 'danger')
        }
        this.isLoading = false
      })
    },
  },
}
</script>
