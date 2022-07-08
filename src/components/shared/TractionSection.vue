<template>
  <section class="flex flex-col gap-y-4 mb-10">
    <TractionHeading level="4" :show-border="true">
      <div class="flex flex-row gap-x-2">
        <slot name="icon"></slot> {{ title }}
      </div></TractionHeading
    >
    <div class="sm:px-6 lg:px-8">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TractionSection',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
