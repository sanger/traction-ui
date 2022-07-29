<template>
  <div :class="`flex flex-col gap-y-4 ${classNames}`">
    <div class="text-left border-b-2 border-gray-300 mb-2 font-medium">{{ title }}</div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * # TractionSubSection
   *
   * Tailwind component to display a traction style sub-section
   * with a title and an optional border.
   *
   * @example
   * <template>
   *   <div>
   *      <traction-sub-section title="Title">
   *        <div>
   *          Components to display within section
   *        </div>
   *      </traction-sub-section>
   *   </div>
   * </template>
   */
  name: 'TractionSubSection',
  props: {
    title: {
      type: String,
      required: true,
    },
    classNames: {
      type: String,
      default: '',
    },
  },
}
</script>
