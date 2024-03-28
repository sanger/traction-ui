<template>
  <section :class="`flex flex-col gap-y-2 ${classNames}`">
    <div>
      <TractionHeading level="4" :show-border="true">
        <div class="flex flex-row gap-x-2">
          <div v-if="number">{{ number }}.</div>
          <slot name="icon"></slot> {{ title }}
          <TractionTag v-if="tag.length > 0">{{ tag }}</TractionTag>
        </div>
      </TractionHeading>
      <TractionMutedText v-if="description.length > 0" class="text-left text-md px-2">{{
        description
      }}</TractionMutedText>
    </div>
    <div class="sm:px-6 lg:px-8">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  /**
   * # TractionSection
   *
   * Tailwind component to display a traction style section
   * with a title and an optional border.
   *
   * @example
   * <template>
   *   <div>
   *      <traction-section :show-border="true" title="Title">
   *        <div>
   *          Components to display within section
   *        </div>
   *      </traction-section>
   *   </div>
   * </template>
   */
  name: 'TractionSection',
  props: {
    title: {
      type: String,
      required: true,
    },
    classNames: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: '',
    },
    number: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
}
</script>
