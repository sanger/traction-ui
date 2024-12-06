<template>
  <div
    class="border-2 border-sdb-200 rounded-md bg-white text-sdb-400 shadow-custom-pink"
    :data-pipeline="title"
  >
    <div class="text-left p-4 border-b-2 border-gray-200 bg-gray-100 rounded-md">
      <h3 class="text-xl" data-attribute="title">{{ title }}</h3>
      <span class="text-gray-600 font-light" data-attribute="description">
        {{ description }}
      </span>
    </div>
    <div class="flex flex-row flex-wrap gap-y-4 gap-x-3 py-4 px-4">
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
