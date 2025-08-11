<template>
  <div>
    <div v-if="isLoading" class="flex p-32 items-center justify-center">
      <traction-spinner classes="h-32 w-32" />
    </div>
    <div v-else-if="isError" class="flex p-32 flex-col items-center justify-center">
      <p class="flex text-lg font-semilight p-4">There was an error retrieving the data</p>
      <traction-button @click="getData()">Retry</traction-button>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
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

import { ref, onMounted } from 'vue'
import useAlert from '@/composables/useAlert.js'

// Props
const props = defineProps({
  // A method that performs the required data fetch
  fetcher: {
    type: Function,
    required: true,
  },
})

const isLoading = ref(true)
const isError = ref(false)
const { showAlert } = useAlert()

async function getData() {
  isLoading.value = true
  isError.value = false
  const res = await props.fetcher()
  if (!res.success) {
    isError.value = true
    showAlert(res.errors, 'danger')
  }
  isLoading.value = false
}

onMounted(() => {
  getData()
})
</script>
