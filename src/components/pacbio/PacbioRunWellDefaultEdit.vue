<template>
  <div class="border border-black p-[10px]">
    <fieldset>
      <traction-row v-for="field in smrtLinkWellDefaults" :key="field.name">
        <traction-col>
          <label>{{ field.label }}</label>
        </traction-col>
        <traction-col>
          <component
            :is="field.component"
            v-bind="field.props"
            v-model="runDefaultWellAttributes[field.value]"
          />
        </traction-col>
      </traction-row>
      <traction-muted-text>
        * Non-submitted fields, used for providing new wells with default values
      </traction-muted-text>
    </fieldset>
  </div>
</template>

<script>
// There is a lot of duplication between this component and PacbioRunWellEdit.
// A lot of it could be moved to the store
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/runCreate')
import { smrtLinkVersionDefaultComponents } from '@/store/traction/pacbio/runCreate/run'
export default {
  name: 'PacbioRunWellDefaultEdit',
  computed: {
    ...mapGetters(['runDefaultWellAttributes', 'runItem', 'smrtLinkVersion']),
    smrtLinkWellDefaults() {
      return smrtLinkVersionDefaultComponents[this.smrtLinkVersion.name]
    },
  },
}
</script>
