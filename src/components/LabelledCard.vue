<template>
  <div
    class="mt-4 border-t-4 border-sp rounded-md space-y-1 bg-sdb-400 text-gray-100"
    :data-pipeline="title"
  >
    <div class="text-center text-2xl" data-attribute="title">{{ title }}</div>
    <div class="px-4 sm:px-2 lg:px-4">
      <div class="text-center text-xs italic" data-attribute="description">{{ description }}</div>
      <div class="py-2">
        <h1 class="border-b-2 border-sp" />
      </div>
    </div>
    <div class="flex flex-row flex-wrap gap-y-8 gap-x-3 mt-2 px-3 py-4">
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
