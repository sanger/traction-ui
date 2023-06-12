<template>
  <div class="bg-gray-100 rounded p-3">
    <traction-heading level="4" :show-border="true"> Summary </traction-heading>

    <div class="flex flex-col w-full">
      <div class="flex flex-row space-x-8 mt-5">
        <traction-button
          v-if="newRecord"
          id="reset"
          full-width
          theme="reset"
          @click="$emit('reset-run')"
        >
          Reset
        </traction-button>
        <traction-button
          :id="runType.id"
          full-width
          :theme="runType.theme"
          :data-action="runType.id"
          @click="$emit('save')"
        >
          {{ runType.label }}
        </traction-button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['resetRun', 'save'])
</script>

<script>
import { RunTypeEnum } from '@/store/traction/pacbio/runCreate/run'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/runCreate')

export default {
  name: 'PacbioRunSummary',
  components: {},
  computed: {
    newRecord: ({ runType }) => runType.type === RunTypeEnum.New,
    plateCount: ({ runItem }) => (runItem.system_name === 'Revio' ? 2 : 1),
    wellCount: ({ wells }) => Object.keys(wells).length,
    ...mapGetters(['runItem', 'runType', 'wells']),
  },
}
</script>

<style scoped></style>
