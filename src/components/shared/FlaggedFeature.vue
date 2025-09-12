<template>
  <div class="contents">
    <slot v-if="enabled"></slot>
    <slot v-else name="disabled"></slot>
  </div>
</template>

<script setup>
import useSWRV from 'swrv'
import { computed } from 'vue'

const DEFAULT_FEATURE = { enabled: false }

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const baseURL = import.meta.env.VITE_TRACTION_BASE_URL
const { data } = useSWRV(`${baseURL}/flipper/api/actors/User`)

const feature = computed(() => data.features?.[props.name] || DEFAULT_FEATURE)
const enabled = computed(() => feature.value.enabled)
</script>
