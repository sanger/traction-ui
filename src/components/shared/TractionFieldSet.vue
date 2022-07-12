<!--
  TractionFieldSet

  Renders a fieldset
  - Title provides a legend for the fieldset
  - Optional default slot allows addition of custom content above the fields
  - Option bottom slot allows addition of custom content below the fields
  - Can automatically render supplied fields
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
    <traction-input-prompts
      v-for="field in fields"
      :key="field.attribute"
      v-bind="field"
      :value="value[field.attribute]"
      @input="input(field.attribute, $event)"
    >
    </traction-input-prompts>
    <slot name="bottom" />
  </fieldset>
</template>

<script>
// Component
export default {
  name: 'TractionFieldSet',
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
    fields: {
      type: Array,
      required: false,
      default: () => [],
    },
    value: {
      // Value should be an object where each attribute in the
      // fields section has a corresponding key.
      type: Object,
      required: false,
      default() {
        // By default we return an object containing each attribute, with the
        // value null
        return Object.fromEntries(this.fields.map(({ attribute }) => [attribute, null]))
      },
    },
  },
  methods: {
    input(attribute, value) {
      this.$emit('input', {
        ...this.value,
        [attribute]: value,
      })
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
