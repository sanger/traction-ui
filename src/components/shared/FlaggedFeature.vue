<template>
  <div class="contents">
    <slot v-if="enabled"></slot>
    <slot v-else name="disabled"></slot>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'

const rootStore = useRootStore()
const data = ref(null)

const DEFAULT_FEATURE = { enabled: false }

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

onMounted(async () => {
  const request = rootStore.api.traction.feature_flags
  const promise = request.get()
  const { success, body } = await handleResponse(promise)
  if (success) {
    data.value = body.data
  }
})

const feature = computed(() => data.value?.features?.[props.name] || DEFAULT_FEATURE)
const enabled = computed(() => feature.value.enabled)
</script>
