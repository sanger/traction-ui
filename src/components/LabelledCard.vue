<template>
  <div
    class="mt-4 border-t-4 border-sp rounded-md space-y-1 bg-sdb-400 text-gray-100"
    :data-pipeline="title"
  >
    <div class="text-center text-2xl" data-attribute="title">{{ title }}</div>
    <div class="text-center text-xs italic px-2" data-attribute="description">
      {{ description }}
    </div>
    <div class="pt-2">
      <h1 class="border-b-2 border-sp" />
    </div>
    <div class="flex flex-row flex-wrap justify-center gap-y-8 gap-x-3 py-8 px-3">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'LabelledCard',
  components: {},
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
}
</script>
