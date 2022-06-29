<template>
  <div v-if="visible" class="bg-black fixed inset-0 py-24 bg-opacity-75 select-none">
    <spinner size="huge" :message="message" text-fg-color="#aaa"></spinner>
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'

export default {
  name: 'LoadingFullScreenModal',
  components: {
    Spinner,
  },
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

<style scoped></style>
