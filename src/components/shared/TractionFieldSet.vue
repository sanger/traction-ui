<!--
  TractionFieldSet

  Renders a fieldset
  - Title provides a legend for the fieldset
  - Optional default slot allows addition of custom content above the fields
  - Option bottom slot allows addition of custom content below the fields
-->
<template>
  <fieldset>
    <!-- These margins probably aren't set-up on the right components, as it
    results in subheadings becoming progressively nested. But I'm reluctant to
    touch too much when this is being actively worked on -->
    <TractionHeading v-if="title" level="5" :show-border="true" class="sm:-mx-6 lg:-mx-8">
      <legend>{{ title }}</legend>
    </TractionHeading>
    <slot />
    <slot name="bottom" />
  </fieldset>
</template>

<script>
// Imports

// Component
export default {
  name: 'TractionFieldSet',
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
  },
}
</script>

<style scoped>
/* Bootstrap is getting in here and manipulating out styles */
legend {
  font-size: revert;
}
</style>
