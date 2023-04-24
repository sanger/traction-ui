<template>
  <flagged-feature name="enable_custom_form_group">
    <template #disabled>
      <b-form-group 
      id="" 
      label="" 
      label-for="" 
      label-align=""
      label-align-sm=""
      label-cols-sm=""
      label-cols-lg="">
        <slot />
      </b-form-group>
    </template>
    <fieldset
    v-bind="$attrs">
      <slot />
    </fieldset>
  </flagged-feature>
</template>

<script>
import { BFormGroup } from 'bootstrap-vue'
export default {
  /**
   * TractionFormGroup
   *
   * Tailwind component to display a form group component using the html <fieldset> tag
   */
  name: 'TractionFormGroup',
  components: { BFormGroup },
  inheritAttrs: false,
  props: {},
  data() {},
}
</script>
