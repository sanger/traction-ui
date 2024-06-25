<template>
  <div
    v-if="visible"
    class="bg-black fixed inset-0 py-24 bg-opacity-75 select-none"
    data-type="loading-full-screen-modal"
  >
    <div class="flex flex-col h-full items-center justify-center">
      <traction-spinner class="w-48 h-48"></traction-spinner>
      <span class="text-white">{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingFullScreenModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
}
</script>
