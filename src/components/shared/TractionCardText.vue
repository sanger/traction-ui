<template>
<div>
  <flagged-feature name="enable_custom_cardtext">
    <template #disabled>
        <b-card-text>
          <slot />
          <p> THIS IS BOOTSRAP </p>
        </b-card-text>
    </template>

    <p class="flex flex-col bg-white rounded p-4">
      Custom cardtext
        <slot />
    </p>
  </flagged-feature>
</div>
</template>

<script>
import { BCardText } from 'bootstrap-vue'
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'

export default {
  name: 'TractionCardText',
  components: { BCardText, FlaggedFeature },
}
</script>
